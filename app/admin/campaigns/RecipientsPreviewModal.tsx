"use client";

import React, { useState } from 'react';
import { X, Mail, CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface User {
    id: string;
    email: string;
    name: string;
    exam_date: string | null;
    days_until_exam: number | null;
    account_type: string;
    already_sent: boolean;
}

interface RecipientsPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaignId: string;
    campaignName: string;
    users: User[];
    totalMatches: number;
    alreadySent: number;
    notSent: number;
    onResend: (userId: string) => Promise<void>;
}

export function RecipientsPreviewModal({
    isOpen,
    onClose,
    campaignId,
    campaignName,
    users,
    totalMatches,
    alreadySent,
    notSent,
    onResend
}: RecipientsPreviewModalProps) {
    const [filter, setFilter] = useState<'all' | 'sent' | 'not_sent'>('all');
    const [resending, setResending] = useState<Set<string>>(new Set());

    if (!isOpen) return null;

    const filteredUsers = users.filter(user => {
        if (filter === 'sent') return user.already_sent;
        if (filter === 'not_sent') return !user.already_sent;
        return true;
    });

    const handleResend = async (userId: string) => {
        setResending(prev => new Set(prev).add(userId));
        try {
            await onResend(userId);
        } finally {
            setResending(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{campaignName}</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {totalMatches} total matches • {notSent} not sent • {alreadySent} already sent
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="px-6 pt-4 border-b border-gray-200">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`pb-3 px-1 border-b-2 transition-colors ${filter === 'all'
                                    ? 'border-blue-600 text-blue-600 font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            All ({totalMatches})
                        </button>
                        <button
                            onClick={() => setFilter('not_sent')}
                            className={`pb-3 px-1 border-b-2 transition-colors ${filter === 'not_sent'
                                    ? 'border-blue-600 text-blue-600 font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Not Sent ({notSent})
                        </button>
                        <button
                            onClick={() => setFilter('sent')}
                            className={`pb-3 px-1 border-b-2 transition-colors ${filter === 'sent'
                                    ? 'border-blue-600 text-blue-600 font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Already Sent ({alreadySent})
                        </button>
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No users match this filter</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredUsers.map(user => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <p className="font-semibold text-gray-900">{user.name}</p>
                                            {user.already_sent ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Sent
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                                                    <Clock className="w-3 h-3" />
                                                    Not Sent
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                                        {user.exam_date && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Exam: {new Date(user.exam_date).toLocaleDateString()}
                                                {user.days_until_exam !== null && ` (${user.days_until_exam} days)`}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleResend(user.id)}
                                        disabled={resending.has(user.id)}
                                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm font-medium"
                                    >
                                        {resending.has(user.id) ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="w-4 h-4" />
                                                {user.already_sent ? 'Resend' : 'Send'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing {filteredUsers.length} of {totalMatches} users
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
