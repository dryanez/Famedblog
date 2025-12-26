import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productName = searchParams.get('product_name');

        if (!productName) {
            return NextResponse.json({ error: 'product_name required' }, { status: 400 });
        }

        // Fetch all payments for this product
        const { data: payments, error } = await supabase
            .from('payments')
            .select('*')
            .eq('product_name', productName)
            .order('payment_date', { ascending: false });

        if (error) {
            console.error('[Product Customers API] Error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Group by email and aggregate
        const customerMap = new Map();

        payments?.forEach(payment => {
            const email = payment.user_email;
            if (!customerMap.has(email)) {
                customerMap.set(email, {
                    email,
                    user_id: payment.user_id,
                    first_purchase: payment.payment_date,
                    last_purchase: payment.payment_date,
                    total_spent: 0,
                    purchase_count: 0,
                    payments: []
                });
            }

            const customer = customerMap.get(email);
            customer.total_spent += payment.amount_total;
            customer.purchase_count += 1;
            customer.payments.push({
                id: payment.id,
                amount: payment.amount_total,
                currency: payment.currency,
                date: payment.payment_date,
                quantity: payment.quantity
            });

            // Update date range
            if (payment.payment_date < customer.first_purchase) {
                customer.first_purchase = payment.payment_date;
            }
            if (payment.payment_date > customer.last_purchase) {
                customer.last_purchase = payment.payment_date;
            }
        });

        const customers = Array.from(customerMap.values());

        return NextResponse.json({
            product_name: productName,
            customer_count: customers.length,
            customers: customers
        });

    } catch (error: any) {
        console.error('[Product Customers API] Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
