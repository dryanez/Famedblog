import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Note: No more hardcoded Price IDs! 
// We now fetch product details dynamically from Stripe 
// and use Stripe Metadata (e.g., account_type: 'paid_1m') for app logic.

// Helper to initialize Stripe (lazy initialization to avoid build-time errors)
function getStripe() {
    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-01-27.acacia' as any,
    });
}

// Helper to get Supabase client
function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function POST(request: Request) {
    try {
        const stripe = getStripe();
        const supabase = getSupabase();
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            console.error('[Webhook] Missing stripe-signature header');
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error('[Webhook] Signature verification failed:', err.message);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        console.log('[Webhook] Received event:', event.type);

        // Handle checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            console.log('[Webhook] Processing checkout session:', session.id);

            // Extract data
            const customerEmail = session.customer_details?.email || session.customer_email;
            const amountTotal = session.amount_total || 0;
            const currency = session.currency || 'eur';
            const paymentIntentId = session.payment_intent as string;

            if (!customerEmail) {
                console.error('[Webhook] No customer email found in session');
                return NextResponse.json({ error: 'No customer email' }, { status: 400 });
            }

            // Get line items to determine product
            let productName = 'Unknown Product';
            let productId = null;
            let priceId = null;
            let quantity = 1;
            let metadataAccountType = null;

            try {
                // Fetch line items with expanded product details
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
                    limit: 1,
                    expand: ['data.price.product'],
                });

                if (lineItems.data.length > 0) {
                    const item = lineItems.data[0];
                    const price = item.price;
                    const product = price?.product as Stripe.Product;

                    priceId = price?.id || null;
                    productId = product?.id || null;
                    quantity = item.quantity || 1;
                    productName = product?.name || item.description || 'Unknown Product';

                    // 🔥 DYNAMIC LOGIC: Check Stripe Product Metadata for account_type
                    // You can set this in the Stripe Dashboard for any product!
                    metadataAccountType = product?.metadata?.account_type || null;

                    console.log(`[Webhook] Dynamic product lookup: ${productName} (Account Type: ${metadataAccountType})`);
                }
            } catch (err) {
                console.error('[Webhook] Error fetching dynamic product details:', err);
            }

            // Find user by email
            const { data: userData } = await supabase
                .from('users')
                .select('id')
                .eq('email', customerEmail)
                .single();

            const userId = userData?.id || null;

            // Insert payment record
            const { data: paymentData, error: paymentError } = await supabase
                .from('payments')
                .insert({
                    stripe_payment_id: paymentIntentId || session.id,
                    stripe_customer_id: session.customer as string,
                    stripe_session_id: session.id,
                    user_email: customerEmail,
                    user_id: userId,
                    amount_total: amountTotal,
                    currency: currency,
                    status: 'paid',
                    product_name: productName,
                    product_id: productId,
                    price_id: priceId,
                    quantity: quantity,
                    payment_date: new Date().toISOString(),
                    metadata: {
                        session_id: session.id,
                        payment_status: session.payment_status,
                        account_type_from_metadata: metadataAccountType
                    }
                })
                .select()
                .single();

            if (paymentError) {
                // Check if it's a duplicate
                if (paymentError.code === '23505') { // Unique violation
                    console.log('[Webhook] Payment already recorded (duplicate)');
                    return NextResponse.json({ received: true, duplicate: true });
                }

                console.error('[Webhook] Error inserting payment:', paymentError);
                return NextResponse.json({ error: 'Database error' }, { status: 500 });
            }

            console.log('[Webhook] Payment recorded:', paymentData?.id);

            // Update user account type if dynamic metadata is present
            if (userId && metadataAccountType) {
                // Validate account types
                const validTypes = ['paid_1m', 'paid_3m', 'book'];
                if (validTypes.includes(metadataAccountType)) {
                    // Calculate expiry date (1 month or 3 months from now)
                    let expiryDate = null;
                    if (metadataAccountType === 'paid_1m') {
                        expiryDate = new Date();
                        expiryDate.setMonth(expiryDate.getMonth() + 1);
                    } else if (metadataAccountType === 'paid_3m') {
                        expiryDate = new Date();
                        expiryDate.setMonth(expiryDate.getMonth() + 3);
                    }

                    const updateData: any = { account_type: metadataAccountType };
                    if (expiryDate) {
                        updateData.plan_expiry = expiryDate.toISOString();
                    }

                    await supabase
                        .from('users')
                        .update(updateData)
                        .eq('id', userId);

                    console.log('[Webhook] Dynamically updated user account type to:', metadataAccountType);
                }
            }

            return NextResponse.json({ received: true, paymentId: paymentData?.id });
        }

        // Handle other event types if needed
        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('[Webhook] Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
