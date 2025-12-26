/**
 * One-time script to import historical Stripe Checkout Sessions into Supabase
 * Uses product caching to avoid expansion depth limits
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia' // Matching project version
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Cache for product details to avoid repeated API calls
const productCache = new Map();

async function getProductDetails(productId) {
    if (!productId) return null;
    if (productCache.has(productId)) return productCache.get(productId);

    try {
        // console.log(`🔎 Fetching product details for ${productId}...`);
        const product = await stripe.products.retrieve(productId);
        productCache.set(productId, product);
        return product;
    } catch (err) {
        console.error(`⚠️ Failed to fetch product ${productId}:`, err.message);
        return null;
    }
}

async function backfillCheckoutSessions() {
    console.log('🔄 Starting Stripe Checkout Session backfill (v2)...\n');

    let hasMore = true;
    let startingAfter = undefined;
    let totalProcessed = 0;
    let totalInserted = 0;
    let totalSkipped = 0;

    try {
        while (hasMore) {
            // Fetch checkout sessions (100 at a time)
            // Expand only line_items, not deeper
            const sessions = await stripe.checkout.sessions.list({
                limit: 100,
                starting_after: startingAfter,
                expand: ['data.line_items'],
            });

            console.log(`📦 Fetched ${sessions.data.length} checkout sessions...`);

            for (const session of sessions.data) {
                totalProcessed++;

                // Only process completed sessions (paid)
                if (session.status !== 'complete' || session.payment_status !== 'paid') {
                    // console.log(`⏭️  Skipping incomplete session ${session.id}`);
                    totalSkipped++;
                    continue;
                }

                // Get customer email (Checkout always has this in customer_details)
                const customerEmail = session.customer_details?.email || session.customer_email;

                if (!customerEmail) {
                    console.log(`⚠️  No email for session ${session.id}, skipping`);
                    totalSkipped++;
                    continue;
                }

                // Get product details from line items
                let productName = 'Unknown Product';
                let productId = null;
                let priceId = null;
                let metadataAccountType = null;
                let quantity = 1;

                const lineItems = session.line_items?.data || [];

                if (lineItems.length > 0) {
                    const item = lineItems[0]; // Primary item
                    const price = item.price;

                    // The 'product' field in price is an ID string (because we didn't expand it deeply)
                    const prodId = typeof price?.product === 'string' ? price.product : price?.product?.id;

                    priceId = price?.id || null;
                    productId = prodId || null;
                    quantity = item.quantity || 1;

                    // Fetch full product details (cached)
                    if (prodId) {
                        const product = await getProductDetails(prodId);
                        if (product) {
                            productName = product.name;
                            metadataAccountType = product.metadata?.account_type || null;
                        } else {
                            productName = item.description || 'Unknown Product';
                        }
                    } else {
                        productName = item.description || 'Unknown Product';
                    }
                }

                // Normalization Logic: Consolidate products by price and keywords
                const amount = session.amount_total;
                const nameLower = productName.toLowerCase();

                // 1. EXCLUDE Test Plans (≤ €1 or contains "Test Plan")
                if (amount <= 100 || nameLower.includes('test plan')) {
                    console.log(`⏭️  Skipping test item: ${productName} (€${(amount / 100).toFixed(2)})`);
                    totalSkipped++;
                    continue; // Skip this session entirely
                }

                // 2. Consolidate 6-Month Products (~€100)
                if (amount >= 9500 && amount <= 10500) { // €95-105
                    productName = '💎 6-Month Pro Prep Holiday Special';
                    if (!metadataAccountType) metadataAccountType = 'paid_6m';
                }

                // 3. Consolidate 1-Month Products SPLIT by Price

                // A. Discounted / Holiday Special (~€29.00 - €30.00)
                else if (amount >= 2900 && amount <= 3000) {
                    productName = '⚡ 1-Month Intensive Holiday Special';
                    if (!metadataAccountType) metadataAccountType = 'paid_1m';
                }

                // B. Standard Price (~€59.00)
                else if (amount >= 5800 && amount <= 6000) {
                    productName = '1-Month Intensive (Standard)';
                    if (!metadataAccountType) metadataAccountType = 'paid_1m';
                }

                // 4. Keyword Fallbacks (if price buckets didn't match exactly but clearly belongs to one group)
                else {
                    const oneMonthKeywords = ['antonino', 'ramzy', 'sahouli', 'farouk', 'holiday special'];
                    // "1-month intensive" keyword is ambiguous without price, so strictly rely on price buckets above for main groups.
                    // If it has "special" or specific names, force to Special.

                    const sixMonthKeywords = ['6-month', '6 monat', '6 months'];

                    if (sixMonthKeywords.some(k => nameLower.includes(k)) && amount > 5000) {
                        productName = '💎 6-Month Pro Prep Holiday Special';
                        if (!metadataAccountType) metadataAccountType = 'paid_6m';
                    } else if (oneMonthKeywords.some(k => nameLower.includes(k))) {
                        // Strict Price Check: specific keywords like "Special" should typically imply the discount.
                        // If someone paid > €40 but has "Special" in name, treat as Standard
                        if (amount < 4000) {
                            productName = '⚡ 1-Month Intensive Holiday Special';
                        } else {
                            productName = '1-Month Intensive (Standard)';
                        }
                        if (!metadataAccountType) metadataAccountType = 'paid_1m';
                    } else if (nameLower.includes('1-month intensive')) {
                        // Fallback for generic "1-month intensive" name outside exact buckets
                        // Split by price threshold €40
                        if (amount < 4000) {
                            productName = '⚡ 1-Month Intensive Holiday Special'; // Assume discounted
                        } else {
                            productName = '1-Month Intensive (Standard)'; // Assume standard
                        }
                        if (!metadataAccountType) metadataAccountType = 'paid_1m';
                    }
                }

                // Find user by email
                const { data: userData } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', customerEmail)
                    .single();

                const userId = userData?.id || null;

                // Payment Intent ID
                const paymentIntentId = typeof session.payment_intent === 'string'
                    ? session.payment_intent
                    : session.payment_intent?.id;

                // Construct record
                // Use paymentIntentId as primary key if available, else session.id
                const stripePaymentId = paymentIntentId || session.id;

                const record = {
                    stripe_payment_id: stripePaymentId,
                    stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
                    stripe_session_id: session.id,
                    user_email: customerEmail,
                    user_id: userId,
                    amount_total: session.amount_total,
                    currency: session.currency,
                    status: 'paid',
                    product_name: productName,
                    product_id: productId,
                    price_id: priceId,
                    quantity: quantity,
                    payment_date: new Date(session.created * 1000).toISOString(),
                    metadata: {
                        backfilled: true,
                        source: 'checkout_session',
                        account_type_from_metadata: metadataAccountType,
                    }
                };

                const { error: insertError } = await supabase
                    .from('payments')
                    .upsert(record, { onConflict: 'stripe_payment_id' });

                if (insertError) {
                    console.error(`❌ Error upserting ${session.id}:`, insertError.message);
                    totalSkipped++;
                } else {
                    console.log(`✅ Upserted: ${customerEmail} | ${productName} | €${(session.amount_total / 100).toFixed(2)}`);
                    totalInserted++;
                }
            }

            hasMore = sessions.has_more;
            if (hasMore && sessions.data.length > 0) {
                startingAfter = sessions.data[sessions.data.length - 1].id;
            }
        }

        console.log('\n✅ Backfill complete!');
        console.log(`📊 Total sessions processed: ${totalProcessed}`);
        console.log(`✅ Successfully upserted: ${totalInserted}`);
        console.log(`⏭️  Skipped: ${totalSkipped}`);

    } catch (error) {
        console.error('❌ Fatal error:', error);
    }
}

backfillCheckoutSessions();
