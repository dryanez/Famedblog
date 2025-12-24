"use client";

import { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, Eye, MousePointerClick } from 'lucide-react';

interface CampaignLog {
    id: string;
    campaign_id: string;
    user_email: string;
    status: string;
    created_at: string;
    metadata?: {
        subject?: string;
        is_test?: boolean;
    };
    opened_at?: string;
    clicked_at?: string;
}

interface CampaignHistoryModalProps {
    userId: string;
    userEmail: string;
    onClose: () => void;
}

export function CampaignHistoryModal({ userId, userEmail, onClose }: CampaignHistoryModalProps) {
    const [logs, setLogs] = useState<CampaignLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await fetch(`/api/users/${userId}/campaigns`);
                const data = await response.json();
                setLogs(data.logs || []);
            } catch (error) {
                console.error('Error fetching campaign history:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [userId]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Campaign History</h2>
                        <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12">
                            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No campaign emails sent to this user yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">
                                                    {log.campaign_id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </h3>
                                                {log.metadata?.is_test && (
                                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                        Test
                                                    </span>
                                                )}
                                            </div>
                                            {log.metadata?.subject && (
                                                <p className="text-sm text-gray-600 mt-1">{log.metadata.subject}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-2">
                                                {new Date(log.created_at).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                <CheckCircle className="w-3 h-3" />
                                                Sent
                                            </div>
                                            {log.opened_at && (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                    <Eye className="w-3 h-3" />
                                                    Opened
                                                </div>
                                            )}
                                            {log.clicked_at && (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                                    <MousePointerClick className="w-3 h-3" />
                                                    Clicked
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
