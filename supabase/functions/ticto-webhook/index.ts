import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  console.log('🔵 Webhook Ticto recebido')

  try {
    // Parse request body first (token comes in body for Ticto)
    const payload = await req.json()
    console.log('📦 Payload recebido:', JSON.stringify(payload, null, 2))

    // Validate webhook token from payload body
    const webhookToken = payload.token
    const expectedToken = Deno.env.get('TICTO_WEBHOOK_TOKEN')

    if (!webhookToken || webhookToken !== expectedToken) {
      console.error('❌ Token inválido ou ausente')
      console.log('Token recebido:', webhookToken ? 'presente' : 'ausente')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('✅ Token validado com sucesso')

    // Extract relevant data from Ticto webhook (correct structure)
    const { status, customer, order, item } = payload
    const email = customer?.email?.toLowerCase()
    const transactionId = order?.hash
    
    if (!email) {
      console.error('❌ Email não encontrado no payload')
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`📧 Email do cliente: ${email}`)
    console.log(`📊 Status da transação: ${status}`)
    console.log(`🏷️ Produto: ${item?.product_name}`)
    console.log(`📋 Oferta: ${item?.offer_name}`)
    console.log(`🔑 Transaction ID: ${transactionId}`)

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Determine plan type based on offer name or product name
    const offerName = item?.offer_name?.toLowerCase() || ''
    const productName = item?.product_name?.toLowerCase() || ''
    const planType = (offerName.includes('anual') || productName.includes('anual')) ? 'annual' : 'monthly'
    
    console.log(`📅 Tipo de plano detectado: ${planType}`)

    // Calculate expiration date
    const now = new Date()
    let expiresAt: Date
    
    if (planType === 'annual') {
      expiresAt = new Date(now.getTime())
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    } else {
      expiresAt = new Date(now.getTime())
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    }

    // Add 7 days grace period
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Map Ticto statuses to actions
    // Ticto statuses: waiting_payment, approved, paid, canceled, refunded, expired, etc.
    const activationStatuses = ['approved', 'paid', 'active']
    const cancellationStatuses = ['canceled', 'expired', 'refunded', 'chargeback']

    if (activationStatuses.includes(status)) {
      console.log('✅ Pagamento aprovado - Ativando Premium')

      // Check if subscription exists
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (existingSub) {
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            plan_type: planType,
            ticto_transaction_id: transactionId,
            started_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString()
          })
          .eq('email', email)

        if (updateError) {
          console.error('❌ Erro ao atualizar subscription:', updateError)
          throw updateError
        }
        console.log('✅ Subscription atualizada')
      } else {
        // Create new subscription (user_id will be linked when user logs in)
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            email,
            user_id: null,
            status: 'active',
            plan_type: planType,
            ticto_transaction_id: transactionId,
            started_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString()
          })

        if (insertError) {
          console.error('❌ Erro ao criar subscription:', insertError)
          throw insertError
        }
        console.log('✅ Nova subscription criada')
      }
    } else if (cancellationStatuses.includes(status)) {
      console.log('🚫 Assinatura cancelada/expirada - Removendo Premium')

      const newStatus = status === 'refunded' || status === 'chargeback' ? 'canceled' : status

      const { error: cancelError } = await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('email', email)

      if (cancelError) {
        console.error('❌ Erro ao cancelar subscription:', cancelError)
        throw cancelError
      }
      console.log('✅ Subscription cancelada')
    } else {
      console.log(`ℹ️ Status não processado (aguardando pagamento ou outro): ${status}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    // Always return 200 to avoid Ticto retries
    return new Response(JSON.stringify({ success: true, error: 'Internal error logged' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})