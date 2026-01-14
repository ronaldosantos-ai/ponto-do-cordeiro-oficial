import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Zod schema for webhook payload validation
const webhookSchema = z.object({
  token: z.string().min(1).max(500),
  status: z.enum([
    'waiting_payment',
    'approved',
    'paid',
    'active',
    'canceled',
    'expired',
    'refunded',
    'chargeback'
  ]),
  customer: z.object({
    email: z.string().email().max(255).transform(val => val.toLowerCase())
  }),
  order: z.object({
    hash: z.string().max(100).optional()
  }).optional(),
  item: z.object({
    product_name: z.string().max(255).optional(),
    offer_name: z.string().max(255).optional()
  }).optional()
})

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Generate request ID for traceability
  const requestId = crypto.randomUUID()
  console.log(`🔵 [${requestId}] Webhook Ticto recebido`)

  try {
    // Parse request body first (token comes in body for Ticto)
    let rawPayload
    try {
      rawPayload = await req.json()
    } catch (parseError) {
      console.error(`❌ [${requestId}] JSON inválido`)
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    console.log(`📦 [${requestId}] Payload recebido`)

    // Validate payload structure with Zod
    const parseResult = webhookSchema.safeParse(rawPayload)
    
    if (!parseResult.success) {
      console.error(`❌ [${requestId}] Payload inválido:`, parseResult.error.flatten())
      return new Response(JSON.stringify({ error: 'Invalid payload structure' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const payload = parseResult.data

    // Validate webhook token from payload body
    const webhookToken = payload.token
    const expectedToken = Deno.env.get('TICTO_WEBHOOK_TOKEN')

    if (!webhookToken || webhookToken !== expectedToken) {
      console.error(`❌ [${requestId}] Token inválido ou ausente`)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`✅ [${requestId}] Token validado com sucesso`)

    // Extract relevant data from validated payload
    const { status, customer, order, item } = payload
    const email = customer.email // Already validated and lowercased by Zod
    const transactionId = order?.hash

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Determine plan type based on offer name or product name
    const offerName = item?.offer_name?.toLowerCase() || ''
    const productName = item?.product_name?.toLowerCase() || ''
    const planType = (offerName.includes('anual') || productName.includes('anual')) ? 'annual' : 'monthly'
    
    console.log(`📅 [${requestId}] Tipo de plano: ${planType}, Status: ${status}`)

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
      console.log(`✅ [${requestId}] Pagamento aprovado - Ativando Premium`)

      // Check if subscription exists
      const { data: existingSub, error: selectError } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (selectError) {
        console.error(`❌ [${requestId}] Erro ao buscar subscription:`, selectError.message)
        return new Response(JSON.stringify({ error: 'Database error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

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
          console.error(`❌ [${requestId}] Erro ao atualizar subscription:`, updateError.message)
          return new Response(JSON.stringify({ error: 'Database error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        console.log(`✅ [${requestId}] Subscription atualizada`)
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
          console.error(`❌ [${requestId}] Erro ao criar subscription:`, insertError.message)
          return new Response(JSON.stringify({ error: 'Database error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        console.log(`✅ [${requestId}] Nova subscription criada`)
      }
    } else if (cancellationStatuses.includes(status)) {
      console.log(`🚫 [${requestId}] Assinatura cancelada/expirada - Removendo Premium`)

      const newStatus = status === 'refunded' || status === 'chargeback' ? 'canceled' : status

      const { error: cancelError } = await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('email', email)

      if (cancelError) {
        console.error(`❌ [${requestId}] Erro ao cancelar subscription:`, cancelError.message)
        return new Response(JSON.stringify({ error: 'Database error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      console.log(`✅ [${requestId}] Subscription cancelada`)
    } else {
      console.log(`ℹ️ [${requestId}] Status não processado (aguardando pagamento): ${status}`)
    }

    console.log(`✅ [${requestId}] Webhook processado com sucesso`)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    // Unexpected errors - log without exposing details
    console.error(`❌ Erro inesperado no webhook:`, error instanceof Error ? error.message : 'Unknown error')
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})