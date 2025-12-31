import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-ticto-webhook-token',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  console.log('🔵 Webhook Ticto recebido')

  try {
    // Validate webhook token
    const webhookToken = req.headers.get('x-ticto-webhook-token')
    const expectedToken = Deno.env.get('TICTO_WEBHOOK_TOKEN')

    if (!webhookToken || webhookToken !== expectedToken) {
      console.error('❌ Token inválido ou ausente')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Parse request body
    const payload = await req.json()
    console.log('📦 Payload recebido:', JSON.stringify(payload, null, 2))

    // Extract relevant data from Ticto webhook
    const { 
      status,
      customer,
      transaction_id,
      product
    } = payload

    const email = customer?.email?.toLowerCase()
    
    if (!email) {
      console.error('❌ Email não encontrado no payload')
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`📧 Email do cliente: ${email}`)
    console.log(`📊 Status da transação: ${status}`)

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Determine plan type based on product or amount
    const planType = product?.name?.toLowerCase().includes('anual') ? 'annual' : 'monthly'
    
    // Calculate expiration date
    const now = new Date()
    let expiresAt: Date
    
    if (planType === 'annual') {
      expiresAt = new Date(now.setFullYear(now.getFullYear() + 1))
    } else {
      expiresAt = new Date(now.setMonth(now.getMonth() + 1))
    }

    // Add 7 days trial
    expiresAt.setDate(expiresAt.getDate() + 7)

    if (status === 'approved' || status === 'paid' || status === 'active') {
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
            ticto_transaction_id: transaction_id,
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
        // Try to find user by email
        const { data: userData } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', email)
          .maybeSingle()

        // Create new subscription
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            email,
            user_id: userData?.id || null,
            status: 'active',
            plan_type: planType,
            ticto_transaction_id: transaction_id,
            started_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString()
          })

        if (insertError) {
          console.error('❌ Erro ao criar subscription:', insertError)
          throw insertError
        }
        console.log('✅ Nova subscription criada')
      }
    } else if (status === 'canceled' || status === 'expired' || status === 'refunded') {
      console.log('🚫 Assinatura cancelada/expirada - Removendo Premium')

      const { error: cancelError } = await supabase
        .from('subscriptions')
        .update({
          status: status === 'refunded' ? 'canceled' : status
        })
        .eq('email', email)

      if (cancelError) {
        console.error('❌ Erro ao cancelar subscription:', cancelError)
        throw cancelError
      }
      console.log('✅ Subscription cancelada')
    } else {
      console.log(`ℹ️ Status não processado: ${status}`)
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