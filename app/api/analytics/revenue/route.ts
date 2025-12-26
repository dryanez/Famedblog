import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'all'; // '7d', '30d', '90d', 'all'
        const groupBy = searchParams.get('groupBy') || 'day'; // 'day', 'week', 'month'

        // Calculate date range
        let startDate = new Date();
        switch (period) {
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
            case 'all':
                startDate = new Date('2020-01-01'); // Far enough back
                break;
        }

        // Fetch all payments in period
        const { data: payments, error } = await supabase
            .from('payments')
            .select('*')
            .eq('status', 'paid')
            .gte('payment_date', startDate.toISOString())
            .order('payment_date', { ascending: true });

        if (error) {
            console.error('[Analytics API] Error fetching payments:', error);
            return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
        }

        // Calculate totals
        const totalRevenue = payments.reduce((sum, p) => sum + (p.amount_total || 0), 0);
        const totalOrders = payments.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Group data for chart
        const groupedData: Record<string, { revenue: number; orders: number }> = {};

        payments.forEach(payment => {
            const date = new Date(payment.payment_date);
            let key: string;

            switch (groupBy) {
                case 'week':
                    // Get week start (Monday)
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay() + 1);
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
                    break;
                case 'day':
                default:
                    key = date.toISOString().split('T')[0];
                    break;
            }

            if (!groupedData[key]) {
                groupedData[key] = { revenue: 0, orders: 0 };
            }
            groupedData[key].revenue += payment.amount_total || 0;
            groupedData[key].orders += 1;
        });

        // Convert to array and sort
        const chartData = Object.keys(groupedData)
            .sort()
            .map(date => ({
                date,
                revenue: groupedData[date].revenue / 100, // Convert to euros
                orders: groupedData[date].orders,
            }));

        // Product stats
        const productStats: Record<string, { revenue: number; units: number; name: string }> = {};

        payments.forEach(payment => {
            const productKey = payment.product_id || payment.product_name || 'Unknown';
            if (!productStats[productKey]) {
                productStats[productKey] = {
                    name: payment.product_name || 'Unknown Product',
                    revenue: 0,
                    units: 0,
                };
            }
            productStats[productKey].revenue += payment.amount_total || 0;
            productStats[productKey].units += payment.quantity || 1;
        });

        const productPerformance = Object.values(productStats)
            .map(p => ({
                ...p,
                revenue: p.revenue / 100, // Convert to euros
            }))
            .sort((a, b) => b.revenue - a.revenue);

        // Recent payments (last 10)
        const recentPayments = payments.slice(-10).reverse().map(p => ({
            id: p.id,
            date: p.payment_date,
            email: p.user_email,
            product: p.product_name,
            amount: p.amount_total / 100,
            currency: p.currency,
        }));

        return NextResponse.json({
            totalRevenue: totalRevenue / 100, // euros
            totalOrders,
            avgOrderValue: avgOrderValue / 100, // euros
            chartData,
            productPerformance,
            recentPayments,
        });

    } catch (error: any) {
        console.error('[Analytics API] Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
