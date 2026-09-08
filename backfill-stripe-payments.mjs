/**
 * One-time script to import historical Stripe payments into Supabase
 * Run this to backfill your analytics with past payment data
 * 
 * Usage: node backfill-stripe-payments.mjs
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function backfillPayments() {
    console.log('🔄 Starting Stripe payment backfill...\n');

    let hasMore = true;
    let startingAfter = undefined;
    let totalProcessed = 0;
    let totalInserted = 0;
    let totalSkipped = 0;

    try {
        while (hasMore) {
            // Fetch payment intents from Stripe (100 at a time)
            const paymentIntents = await stripe.paymentIntents.list({
                limit: 100,
                starting_after: startingAfter,
            });

            console.log(`📦 Fetched ${paymentIntents.data.length} payment intents...`);

            for (const payment of paymentIntents.data) {
                totalProcessed++;

                // Only process successful payments
                if (payment.status !== 'succeeded') {
                    console.log(`⏭️  Skipping ${payment.id} (status: ${payment.status})`);
                    totalSkipped++;
                    continue;
                }

                // Get charges to check for email/product
                const charge = payment.charges?.data?.[0];

                // Robust Email Lookup: Check all possible fields
                const customerEmail =
                    payment.receipt_email ||
                    charge?.receipt_email ||
                    charge?.billing_details?.email ||
                    (payment.customer ? await getCustomerEmail(payment.customer) : null);

                if (!customerEmail) {
                    console.log(`⚠️  No email found for ${payment.id} (Cust: ${payment.customer || 'N/A'}), skipping`);
                    totalSkipped++;
                    continue;
                }

                // Get product details
                let productName = 'Unknown Product';
                let productId = null;
                let priceId = null;
                let metadataAccountType = null;
                let quantity = 1;

                if (charge) {
                    // Try to get invoice line items
                    if (charge.invoice) {
                        try {
                            const invoice = await stripe.invoices.retrieve(charge.invoice, {
                                expand: ['lines.data.price.product'],
                            });

                            if (invoice.lines.data.length > 0) {
                                const line = invoice.lines.data[0];
                                const price = line.price;
                                const product = price?.product;

                                productName = product?.name || line.description || 'Unknown Product';
                                productId = product?.id || null;
                                priceId = price?.id || null;
                                metadataAccountType = product?.metadata?.account_type || null;
                                quantity = line.quantity || 1;
                            }
                        } catch (err) {
                            console.log(`⚠️  Could not fetch invoice details for ${payment.id}`);
                        }
                    }

                    // Fallback to charge description if still unknown
                    if (productName === 'Unknown Product' && charge.description) {
                        productName = charge.description;
                    }
                }

                // Find user by email
                const { data: userData } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', customerEmail)
                    .single();

                const userId = userData?.id || null;

                // Insert into Supabase
                const { error: insertError } = await supabase
                    .from('payments')
                    .insert({
                        stripe_payment_id: payment.id,
                        stripe_customer_id: payment.customer,
                        stripe_session_id: null, // Historical payments don't have session
                        user_email: customerEmail,
                        user_id: userId,
                        amount_total: payment.amount,
                        currency: payment.currency,
                        status: 'paid',
                        product_name: productName,
                        product_id: productId,
                        price_id: priceId,
                        quantity: 1,
                        payment_date: new Date(payment.created * 1000).toISOString(),
                        metadata: {
                            backfilled: true,
                            payment_intent_id: payment.id,
                            account_type_from_metadata: metadataAccountType,
                        }
                    });

                if (insertError) {
                    if (insertError.code === '23505') {
                        console.log(`⏭️  Already exists: ${payment.id}`);
                        totalSkipped++;
                    } else {
                        console.error(`❌ Error inserting ${payment.id}:`, insertError.message);
                        totalSkipped++;
                    }
                } else {
                    console.log(`✅ Inserted: ${payment.id} | ${customerEmail} | €${(payment.amount / 100).toFixed(2)}`);
                    totalInserted++;
                }
            }

            hasMore = paymentIntents.has_more;
            if (hasMore && paymentIntents.data.length > 0) {
                startingAfter = paymentIntents.data[paymentIntents.data.length - 1].id;
            }
        }

        console.log('\n✅ Backfill complete!');
        console.log(`📊 Total processed: ${totalProcessed}`);
        console.log(`✅ Successfully inserted: ${totalInserted}`);
        console.log(`⏭️  Skipped: ${totalSkipped}`);

    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

async function getCustomerEmail(customerId) {
    try {
        const customer = await stripe.customers.retrieve(customerId);
        return customer.email;
    } catch (err) {
        return null;
    }
}

// Run the backfill
backfillPayments();
