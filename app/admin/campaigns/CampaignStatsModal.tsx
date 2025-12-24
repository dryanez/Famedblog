import React, { useEffect, useState } from 'react';
import { X, RefreshCw, CheckCircle, Mail, ExternalLink, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface CampaignStatsModalProps {
    campaignId: string;
    campaignName: string;
    onClose: () => void;
}

interface CampaignLog {
    id: string;
    user_email: string;
    status: string;
    sent_at: string;
    metadata: any;
}

export function CampaignStatsModal({ campaignId, campaignName, onClose }: CampaignStatsModalProps) {
    const [logs, setLogs] = useState<CampaignLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('campaign_logs')
            .select('*')
            .eq('campaign_id', campaignId)
            .order('sent_at', { ascending: false });

        if (!error && data) {
            setLogs(data);
        } else {
            console.error('Error fetching logs:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, [campaignId]);

    // Calculate stats
    const totalSent = logs.length;
    const totalDelivered = logs.filter(l => l.status === 'delivered' || l.status === 'opened' || l.status === 'clicked').length;
    const totalOpened = logs.filter(l => l.status === 'opened' || l.status === 'clicked').length;
    const totalClicked = logs.filter(l => l.status === 'clicked').length;

    const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : '0';
    const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0';
    const clickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : '0';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Campaign Stats</h2>
                        <p className="text-sm text-gray-500">{campaignName}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={fetchLogs}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw className={cn("w-5 h-5 text-gray-500", loading && "animate-spin")} />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="p-6 grid grid-cols-4 gap-4 bg-gray-50 border-b border-gray-200">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Total Sent</p>
                        <p className="text-2xl font-bold text-gray-900">{totalSent}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Delivered</p>
                        <p className="text-2xl font-bold text-gray-900">{deliveryRate}%</p>
                        <p className="text-xs text-gray-400">{totalDelivered} delivered</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Open Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{openRate}%</p>
                        <p className="text-xs text-gray-400">{totalOpened} unique opens</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Click Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{clickRate}%</p>
                        <p className="text-xs text-gray-400">{totalClicked} unique clicks</p>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-auto p-0">
                    {loading && logs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Loading history...</div>
                    ) : logs.length === 0 ? (
                        <div className="p-12 text-center">
                            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No emails sent for this campaign yet.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Recipient</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Sent At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {log.user_email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                                log.status === 'sent' && "bg-blue-100 text-blue-700",
                                                log.status === 'delivered' && "bg-green-100 text-green-700",
                                                log.status === 'opened' && "bg-purple-100 text-purple-700",
                                                log.status === 'clicked' && "bg-orange-100 text-orange-700",
                                                log.status === 'failed' && "bg-red-100 text-red-700"
                                            )}>
                                                {log.status === 'sent' && <CheckCircle className="w-3 h-3" />}
                                                {(log.status === 'opened' || log.status === 'clicked') && <ExternalLink className="w-3 h-3" />}
                                                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                {new Date(log.sent_at).toLocaleString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
