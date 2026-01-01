"use client";

import { useState } from "react";
import { X, Mail, Loader2 } from "lucide-react";

interface SendCampaignModalProps {
    selectedUserIds?: string[];
    prefilterEmails?: string[];
    onClose: () => void;
    onSuccess?: () => void;
}

const CAMPAIGNS = [
    { id: 'exam_urgency_14d', name: '14 Days Urgency', subject: '⚠️ Your Exam is in 14 Days!', description: 'For users with exam in ~2 weeks' },
    { id: 'exam_urgency_7d', name: '7 Days Urgency', subject: '🚨 Final Week! Your Exam is This Week', description: 'For users with exam in ~1 week' },
    { id: 'exam_urgency_3d', name: '3 Days Urgency', subject: '⏰ 72 Hours Until Your FaMED Exam', description: 'For users with exam in 2-4 days' },
    { id: 'exam_urgency_1_week_special', name: '1-Week Special (€9.99)', subject: '🚨 1 Week Left! Last Chance to Pass', description: 'Special offer for users with exam in ≤7 days' },
    { id: 'exam_urgency_special_offer', name: '2-Week Special (€19.99)', subject: '🔥 Special Offer (€19.99)', description: 'Limited time pricing offer' },
    { id: 'holiday_special', name: 'Holiday Special', subject: '🎄 Holiday Special: 50% Off', description: 'Seasonal promotion campaign' },
    { id: 'new_year_special', name: 'New Year Special', subject: '🎉 HAPPY NEW YEAR! Start 2026 Right', description: 'New Year promotion campaign' },
    { id: 'welcome_bundle_promo', name: 'Welcome Bundle Promo', subject: '🎁 Welcome! Get the Complete FaMED Bundle', description: 'For new users (last 7 days, not paid)' },
    { id: 'welcome_day0', name: 'Welcome Email', subject: '👋 Welcome to FaMED Prep!', description: 'Onboarding for new users' },
    { id: 'subscription_expiry', name: 'Subscription Expiry', subject: '🔔 Premium Access Expires Soon', description: 'Renewal reminder for paid users' }
];

export function SendCampaignModal({ selectedUserIds = [], prefilterEmails = [], onClose, onSuccess }: SendCampaignModalProps) {
    const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);

    const recipientCount = prefilterEmails.length > 0 ? prefilterEmails.length : selectedUserIds.length;

    const handleSend = async () => {
        if (!selectedCampaign) return;

        setSending(true);
        setError(null);
        setResult(null);

        try {
            console.log('📧 Sending campaign:', {
                campaignId: selectedCampaign,
                userIds: selectedUserIds,
                emails: prefilterEmails
            });

            const response = await fetch('/api/campaigns/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId: selectedCampaign,
                    userIds: selectedUserIds.length > 0 ? selectedUserIds : undefined,
                    emails: prefilterEmails.length > 0 ? prefilterEmails : undefined
                })
            });

            console.log('📧 Response status:', response.status, response.ok);
            const data = await response.json();
            console.log('📧 Response data:', data);

            if (!response.ok) {
                console.error('❌ Response not OK:', data);
                throw new Error(data.error || 'Failed to send campaign');
            }

            console.log('✅ Setting result:', data);
            setResult(data);
            setTimeout(() => {
                onSuccess?.();
            }, 2000);
        } catch (err: any) {
            console.error('❌ Catch error:', err);
            setError(err.message || 'Something went wrong');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Send Campaign</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Sending to <strong>{recipientCount}</strong> selected {recipientCount !== 1 ? 'users' : 'user'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        disabled={sending}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {result ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-green-900 mb-2">Campaign Sent!</h3>
                            <p className="text-green-700">
                                Successfully sent <strong>{result.sentCount}</strong> email{result.sentCount !== 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-green-600 mt-2">{result.message}</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Campaign</h3>
                            <div className="grid gap-3">
                                {CAMPAIGNS.map((campaign) => (
                                    <button
                                        key={campaign.id}
                                        onClick={() => setSelectedCampaign(campaign.id)}
                                        disabled={sending}
                                        className={`
                                            text-left p-4 rounded-xl border-2 transition-all
                                            ${selectedCampaign === campaign.id
                                                ? 'border-blue-600 bg-blue-50 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }
                                            ${sending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`
                                                p-2 rounded-lg mt-0.5
                                                ${selectedCampaign === campaign.id ? 'bg-blue-100' : 'bg-gray-100'}
                                            `}>
                                                <Mail className={`w-5 h-5 ${selectedCampaign === campaign.id ? 'text-blue-600' : 'text-gray-600'}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                                                    {selectedCampaign === campaign.id && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                                            Selected
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{campaign.description}</p>
                                                <p className="text-sm text-gray-500">
                                                    <strong>Subject:</strong> {campaign.subject}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm font-medium">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!result && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            {selectedCampaign ? 'Ready to send' : 'Choose a campaign above'}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={sending}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!selectedCampaign || sending}
                                className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                                {sending ? 'Sending...' : 'Send Campaign'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
