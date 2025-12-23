"use client";

import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UserData } from "@/lib/types";

interface ActivityChartProps {
    users: UserData[];
}

export function ActivityChart({ users }: ActivityChartProps) {
    const data = useMemo(() => {
        // Aggregate by week
        const counts: Record<string, number> = {};

        users.forEach(u => {
            if (!u.parsedLastActive) return;
            // Key by YYYY-MM-DD (start of week?)
            // Let's just do by Month for simpler view, or by exact date if not too sparse.
            // Let's do by Day for the last 90 days.

            // Or simpler: Group by Month YYYY-MM
            const d = u.parsedLastActive;
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            counts[key] = (counts[key] || 0) + 1;
        });

        // Fill gaps?
        // Let's just sort keys
        return Object.keys(counts).sort().map(key => ({
            date: key,
            users: counts[key]
        }));
    }, [users]);

    if (data.length === 0) return null;

    return (
        <div className="h-[300px] w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Active Users (Monthly)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
