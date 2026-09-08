"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
    data: Array<{
        date: string;
        revenue: number;
        orders: number;
    }>;
    chartType?: 'line' | 'bar';
}

export function RevenueChart({ data, chartType = 'line' }: RevenueChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const Chart = chartType === 'line' ? LineChart : BarChart;
    const DataElement = chartType === 'line' ? Line : Bar;

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <Chart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                    />
                    {/* Left Y-axis for Revenue */}
                    <YAxis
                        yAxisId="left"
                        stroke="#3b82f6"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `€${value}`}
                        label={{ value: 'Revenue (€)', angle: -90, position: 'insideLeft', style: { fill: '#3b82f6' } }}
                    />
                    {/* Right Y-axis for Orders */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#10b981"
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Orders', angle: 90, position: 'insideRight', style: { fill: '#10b981' } }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                        }}
                        formatter={(value: any, name?: string) => {
                            if (name === 'Revenue (€)') return [`€${value.toFixed(2)}`, 'Revenue'];
                            if (name === 'Orders') return [value, 'Orders'];
                            return [value, name || ''];
                        }}
                    />
                    <Legend />
                    <DataElement
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        strokeWidth={2}
                        name="Revenue (€)"
                    />
                    <DataElement
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#10b981"
                        fill="#10b981"
                        strokeWidth={2}
                        name="Orders"
                    />
                </Chart>
            </ResponsiveContainer>
        </div>
    );
}
