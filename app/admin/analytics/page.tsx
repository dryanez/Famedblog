"use client";

import { useState, useEffect } from 'react';
import { RevenueChart } from '@/components/RevenueChart';
import { TrendingUp, DollarSign, ShoppingCart, Download } from 'lucide-react';

interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    chartData: Array<{
        date: string;
        revenue: number;
        orders: number;
    }>;
    productPerformance: Array<{
        name: string;
        revenue: number;
        units: number;
    }>;
    recentPayments: Array<{
        id: string;
        date: string;
        email: string;
        product: string;
        amount: number;
        currency: string;
    }>;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30d');
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics/revenue?period=${period}`);
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!data) return;

        const csv = [
            ['Date', 'Email', 'Product', 'Amount', 'Currency'],
            ...data.recentPayments.map(p => [
                p.date,
                p.email,
                p.product,
                p.amount.toFixed(2),
                p.currency.toUpperCase()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Failed to load analytics</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
                    <p className="text-gray-500 mt-1">Track your sales performance</p>
                </div>
                <div className="flex gap-3">
                    <a
                        href="/admin"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                        ← Back to Dashboard
                    </a>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        €{data.totalRevenue.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Total Revenue</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <ShoppingCart className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        {data.totalOrders}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Total Orders</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        €{data.avgOrderValue.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Avg Order Value</div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Revenue Over Time</h2>
                    <div className="flex gap-2">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="all">All time</option>
                        </select>
                        <select
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                            <option value="line">Line Chart</option>
                            <option value="bar">Bar Chart</option>
                        </select>
                    </div>
                </div>
                <RevenueChart data={data.chartData} chartType={chartType} />
            </div>

            {/* Product Performance */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Product Performance</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200">
                            <tr className="text-left text-sm text-gray-500">
                                <th className="pb-3 font-medium">Product</th>
                                <th className="pb-3 font-medium text-right">Revenue</th>
                                <th className="pb-3 font-medium text-right">Units Sold</th>
                                <th className="pb-3 font-medium text-right">Avg Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.productPerformance.map((product, index) => (
                                <tr key={index} className="text-sm">
                                    <td className="py-3 font-medium text-gray-900">{product.name}</td>
                                    <td className="py-3 text-right text-gray-700">€{product.revenue.toFixed(2)}</td>
                                    <td className="py-3 text-right text-gray-700">{product.units}</td>
                                    <td className="py-3 text-right text-gray-700">€{(product.revenue / product.units).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Payments</h2>
                <div className="space-y-3">
                    {data.recentPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">{payment.email}</div>
                                <div className="text-sm text-gray-500">{payment.product}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-gray-900">€{payment.amount.toFixed(2)}</div>
                                <div className="text-xs text-gray-500">
                                    {new Date(payment.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
