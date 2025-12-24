"use client";

import { supabase } from '@/lib/supabase';

import React, { useState, useEffect } from "react";
import { Users, Send, Zap, Calendar, DollarSign, Moon, Eye, X, Edit, Plus, Sparkles, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    getExamUrgency14Days,
    getExamUrgency7Days,
    getExamUrgency3Days,
    getWelcomeDay0,
    getSubscriptionExpiry,
    getExamUrgencySpecialOffer,
    getHolidaySpecial
} from "@/lib/campaign-templates";
import { CampaignStatsModal } from "./CampaignStatsModal";

interface CampaignTemplate {
    id: string;
    name: string;
    description: string;
    type: "automated" | "manual";
    targetSegment: string;
    icon?: React.ComponentType<{ className?: string }>;
    color: string;
    estimatedReach: number;
    conversionRate: string;
    customContent?: string; // Store custom HTML here
}

const DEFAULT_CAMPAIGNS: CampaignTemplate[] = [
    {
        id: "exam_urgency_14d",
        name: "Exam in 14 Days (Urgent)",
        description: "Trigger: Exam date in 14 days + Free account",
        type: "automated",
        targetSegment: "exam_soon_unpaid",
        icon: Calendar,
        color: "bg-amber-100 text-amber-700",
        estimatedReach: 0,
        conversionRate: "40-60%"
    },
    {
        id: "exam_urgency_special_offer",
        name: "Two Week Special Offer ($19.99)",
        description: "Trigger: Exam in 7-14 days. Upsell: Fast Track Prep.",
        type: "automated",
        targetSegment: "exam_7_14d_unpaid",
        icon: DollarSign,
        color: "bg-green-100 text-green-700",
        estimatedReach: 0,
        conversionRate: "65-85%"
    },
    {
        id: "holiday_special",
        name: "Holiday Special (50% Off + Book)",
        description: "Trigger: Holiday offer for free users. 50% Off + Free Book.",
        type: "automated",
        targetSegment: "free_users",
        icon: Sparkles,
        color: "bg-green-100 text-green-700",
        estimatedReach: 0,
        conversionRate: "70-90%"
    },
    {
        id: "exam_urgency_7d",
        name: "Exam in 7 Days (Critical)",
        description: "Trigger: Exam date in 7 days + Free account",
        type: "automated",
        targetSegment: "exam_week_unpaid",
        icon: Calendar,
        color: "bg-red-100 text-red-700",
        estimatedReach: 0,
        conversionRate: "50-70%"
    },
    {
        id: "exam_urgency_3d",
        name: "Exam in 3 Days (Last Chance)",
        description: "Trigger: Exam date in 3 days + Free account",
        type: "automated",
        targetSegment: "exam_72h_unpaid",
        icon: Zap,
        color: "bg-purple-100 text-purple-700",
        estimatedReach: 0,
        conversionRate: "60-80%"
    },
    {
        id: "welcome_day0",
        name: "Welcome Email",
        description: "Trigger: New user signup",
        type: "automated",
        targetSegment: "new_signups",
        icon: Users,
        color: "bg-blue-100 text-blue-700",
        estimatedReach: 0,
        conversionRate: "15-25%"
    },
    {
        id: "subscription_expiry",
        name: "Subscription Renewal Reminder",
        description: "Trigger: Plan expires in 7 days",
        type: "automated",
        targetSegment: "expiring_soon",
        icon: DollarSign,
        color: "bg-green-100 text-green-700",
        estimatedReach: 0,
        conversionRate: "70-80%"
    },
    {
        id: "no_exam_set",
        name: "No Exam Date Set",
        description: "Manual: Users without exam date",
        type: "manual",
        targetSegment: "no_exam_date",
        icon: Moon,
        color: "bg-indigo-100 text-indigo-700",
        estimatedReach: 0,
        conversionRate: "10-15%"
    }
];

export default function CampaignsPage() {
    // Separate custom campaigns to manage persistence easily
    const [customCampaigns, setCustomCampaigns] = useState<CampaignTemplate[]>([]);

    // Fetch campaigns from Supabase on mount
    const fetchCampaigns = async () => {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching campaigns:', error);
            return;
        }

        if (data) {
            const mappedCampaigns: CampaignTemplate[] = data.map((c: any) => ({
                id: c.id,
                name: c.name,
                description: c.goal ? `Custom Campaign: ${c.goal.substring(0, 40)}...` : 'Custom AI Campaign',
                type: 'manual',
                targetSegment: c.target_audience || 'all',
                color: 'bg-gradient-to-br from-purple-50 to-blue-50 border-blue-200',
                icon: Sparkles,
                estimatedReach: 0,
                conversionRate: 'New',
                customContent: c.content
            }));
            setCustomCampaigns(mappedCampaigns);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const allCampaigns = [...DEFAULT_CAMPAIGNS, ...customCampaigns];

    const [sending, setSending] = useState(false);
    const [previewCampaignId, setPreviewCampaignId] = useState<string | null>(null);
    const [statsCampaign, setStatsCampaign] = useState<{ id: string; name: string } | null>(null);
    const [testEmail, setTestEmail] = useState<string>("");
    const [editedContent, setEditedContent] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [newCampaign, setNewCampaign] = useState({
        name: "",
        targetAudience: "all",
        goal: "",
        tone: "professional"
    });
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleSendCampaign = async (campaignId: string) => {
        setSending(true);
        setResult(null);

        try {
            const response = await fetch('/api/campaigns/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ campaignId })
            });

            const data = await response.json();

            if (response.ok) {
                setResult({ success: true, message: `Successfully sent to ${data.sentCount} users!` });
            } else {
                setResult({ success: false, message: data.error || 'Failed to send campaign' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Network error. Please try again.' });
        } finally {
            setSending(false);
        }
    };

    const handleSendTest = async () => {
        if (!previewCampaignId) return;

        const email = window.prompt("Enter test email address:", testEmail || "");
        if (!email) return;
        setTestEmail(email);

        setSending(true);
        try {
            const response = await fetch('/api/campaigns/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId: previewCampaignId,
                    testEmail: email
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Test email sent to ${email}!`);
            } else {
                alert('Failed to send test: ' + data.error);
            }
        } catch (error) {
            alert('Error sending test email');
        } finally {
            setSending(false);
        }
    };

    const handlePreview = async (campaignId: string) => {
        const campaign = allCampaigns.find(c => c.id === campaignId);
        if (!campaign) return;

        let template;

        // If it's a custom campaign with saved content, use that
        if (campaign.customContent) {
            template = campaign.customContent;
        } else {
            // For holiday_special, check if there's saved content in the database
            if (campaignId === 'holiday_special') {
                try {
                    const response = await fetch('/api/campaigns/holiday_special');
                    if (response.ok) {
                        const data = await response.json();
                        if (data.content) {
                            console.log('Loaded saved holiday_special content from DB');
                            template = data.content;
                        }
                    }
                } catch (error) {
                    console.error('Error fetching saved holiday content:', error);
                }
            }

            // If no saved content, use default template
            if (!template) {
                const sampleData = {
                    userName: "Dr. Maria Schmidt",
                    userEmail: "maria.schmidt@example.com",
                    examDate: "2026-01-15",
                    daysUntilExam: 14,
                    planExpiry: "2025-02-01",
                    accountType: "paid_1m"
                };

                switch (campaignId) {
                    case 'exam_urgency_14d':
                        template = getExamUrgency14Days(sampleData);
                        break;
                    case 'exam_urgency_special_offer':
                        template = getExamUrgencySpecialOffer(sampleData);
                        break;
                    case 'exam_urgency_7d':
                        template = getExamUrgency7Days(sampleData);
                        break;
                    case 'exam_urgency_3d':
                        template = getExamUrgency3Days(sampleData);
                        break;
                    case 'welcome_day0':
                        template = getWelcomeDay0(sampleData);
                        break;
                    case 'subscription_expiry':
                        template = getSubscriptionExpiry(sampleData);
                        break;
                    case 'holiday_special':
                        template = getHolidaySpecial(sampleData);
                        break;
                    default:
                        // For default campaigns without specific function or manual ones
                        template = "<div>No preview available for this standard campaign yet.</div>";
                }
            }
        }

        setEditedContent(template);
        setPreviewCampaignId(campaignId);
        setIsEditing(false); // Start in preview mode
    };

    // Save changes to a custom campaign
    const handleSaveChanges = async () => {
        // Allow saving for any campaign that is in our custom list (persisted or new)
        // AND special allowance for "holiday_special" which we want to be editable
        const isDefault = DEFAULT_CAMPAIGNS.some(c => c.id === previewCampaignId);

        if (isDefault && previewCampaignId !== 'holiday_special') {
            alert("You cannot modify default campaigns permanently.");
            return;
        }


        setSending(true);
        console.log('Saving campaign:', previewCampaignId);
        console.log('Content length:', editedContent?.length);
        try {
            const response = await fetch(`/api/campaigns/${previewCampaignId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ htmlContent: editedContent })
            });
            console.log('Response status:', response.status);

            const data = await response.json();

            if (response.ok) {
                console.log('Save successful!');
                // Update local state
                setCustomCampaigns(prev => prev.map(c =>
                    c.id === previewCampaignId
                        ? { ...c, customContent: editedContent }
                        : c
                ));
                setResult({ success: true, message: "Campaign saved successfully!" });
                setIsEditing(false);
            } else {
                console.error('Save failed:', data);
                setResult({ success: false, message: data.error || 'Failed to save campaign' });
            }
        } catch (error) {
            console.error('Save error:', error);
            setResult({ success: false, message: 'Network error saving campaign' });
        } finally {
            setSending(false);
            setTimeout(() => setResult(null), 3000);
        }
    };

    const handleDeleteCampaign = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this campaign?")) {
            // Optimistic update
            setCustomCampaigns(prev => prev.filter(c => c.id !== id));

            try {
                const response = await fetch(`/api/campaigns/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete campaign from server');
                fetchCampaigns(); // Revert on error
            }
        }
    };

    const handleCreateCampaign = async () => {
        setGenerating(true);
        try {
            const response = await fetch('/api/campaigns/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignName: newCampaign.name,
                    targetAudience: newCampaign.targetAudience,
                    campaignGoal: newCampaign.goal,
                    tone: newCampaign.tone
                })
            });

            const data = await response.json();
            if (response.ok) {
                // Refresh list to pull the saved campaign from DB (including its real ID)
                await fetchCampaigns();

                // If API returned ID, we can find it to preview immediately, otherwise we take the latest
                const newId = data.id;

                // Show preview of generated campaign
                setEditedContent(data.html);
                if (newId) {
                    setPreviewCampaignId(newId);
                }

                // Close creation modal
                setShowCreateModal(false);
                setNewCampaign({ name: "", targetAudience: "all", goal: "", tone: "professional" });
                setIsEditing(true); // Open in edit mode immediately
            } else {
                alert('Failed to generate campaign: ' + data.error);
            }
        } catch (error) {
            console.error('Campaign creation error:', error);
            alert('Failed to create campaign');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Email Campaigns</h1>
                    <p className="text-gray-600 mt-2">Automated and manual campaigns to boost conversions</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Create New Campaign
                </button>
            </header>

            {result && (
                <div className={cn(
                    "mb-6 p-4 rounded-lg border",
                    result.success
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                )}>
                    {result.message}
                </div>
            )}

            {/* Campaign Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCampaigns.map((campaign) => {
                    const Icon = campaign.icon || Sparkles; // Fallback icon
                    // Check if it's a default campaign by ID
                    const isDefault = DEFAULT_CAMPAIGNS.some(c => c.id === campaign.id);
                    const canDelete = !isDefault;

                    return (
                        <div
                            key={campaign.id}
                            className={cn(
                                "bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow relative group",
                                canDelete ? "border-purple-200" : "border-gray-200"
                            )}
                        >
                            {canDelete && (
                                <button
                                    onClick={(e) => handleDeleteCampaign(e, campaign.id)}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete Campaign"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className={cn("p-3 rounded-lg", campaign.color)}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={cn(
                                    "text-xs px-2 py-1 rounded-full font-medium",
                                    campaign.type === "automated"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                )}>
                                    {campaign.type === "automated" ? "⚡ Auto" : "Manual"}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate" title={campaign.name}>
                                {campaign.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">{campaign.description}</p>

                            <div className="space-y-2 mb-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Est. Reach:</span>
                                    <span className="font-medium text-gray-900">
                                        {campaign.estimatedReach > 0 ? `${campaign.estimatedReach} users` : "Loading..."}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Conv. Rate:</span>
                                    <span className="font-medium text-green-600">{campaign.conversionRate}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePreview(campaign.id)}
                                    className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </button>
                                <button
                                    onClick={() => handleSendCampaign(campaign.id)}
                                    disabled={sending}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                                        sending
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-900 text-white hover:bg-gray-800"
                                    )}
                                >
                                    <Send className="w-4 h-4" />
                                    {campaign.type === "automated" ? "Enable" : "Send Now"}
                                </button>
                            </div>
                            <button
                                onClick={() => setStatsCampaign({ id: campaign.id, name: campaign.name })}
                                className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Users className="w-3 h-3" />
                                View History & Stats
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">💡 Campaign Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Automated campaigns</strong> run daily at 9 AM for eligible users</li>
                    <li>• <strong>Manual campaigns</strong> send immediately to all matching users</li>
                    <li>• Users are automatically excluded if they've received an email in the last 24 hours</li>
                    <li>• Click "Enable" to activate automated campaigns (they'll run in the background)</li>
                </ul>
            </div>

            {/* Email Preview Modal */}
            {previewCampaignId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setPreviewCampaignId(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Email Editor</h2>
                                <p className="text-sm text-gray-500">
                                    Campaign: {allCampaigns.find(c => c.id === previewCampaignId)?.name}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {/* Save Button - For custom campaigns OR Holiday Special */}
                                {previewCampaignId && (!DEFAULT_CAMPAIGNS.some(c => c.id === previewCampaignId) || previewCampaignId === 'holiday_special') && (
                                    <button
                                        onClick={handleSaveChanges}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                )}

                                <button
                                    onClick={handleSendTest}
                                    disabled={sending}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                    Send Test
                                </button>

                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                                        isEditing
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    )}
                                >
                                    <Edit className="w-4 h-4" />
                                    {isEditing ? 'Editing' : 'Preview'}
                                </button>
                                <button
                                    onClick={() => setPreviewCampaignId(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {isEditing ? (
                                <div>
                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>💡 Tip:</strong> Edit the HTML directly below. Change URLs, text, images, styling - everything!
                                            {previewCampaignId.startsWith('custom_') && " Don't forget to click Save!"}
                                        </p>
                                    </div>
                                    <textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        className="w-full h-[600px] p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Edit HTML here..."
                                    />
                                </div>
                            ) : (
                                <div
                                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                    dangerouslySetInnerHTML={{ __html: editedContent }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Campaign Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
                                        <p className="text-sm text-gray-500">AI-powered email generation</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                                <input
                                    type="text"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Black Friday Sale, Exam Motivation Boost"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                                <select
                                    value={newCampaign.targetAudience}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, targetAudience: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Users</option>
                                    <option value="free">Free Users Only</option>
                                    <option value="paid">Paid Users Only</option>
                                    <option value="exam_soon">Users with Exam in Next 30 Days</option>
                                    <option value="no_exam">Users Without Exam Date</option>
                                    <option value="inactive">Inactive Users (No activity in 7+ days)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Goal / Message</label>
                                <textarea
                                    value={newCampaign.goal}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, goal: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Describe what this campaign should communicate. E.g., 'Encourage users to upgrade with a limited-time 30% discount' or 'Motivate users to start preparing for their upcoming exam'"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                                <select
                                    value={newCampaign.tone}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, tone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="professional">Professional & Warm</option>
                                    <option value="urgent">Urgent & Action-Oriented</option>
                                    <option value="friendly">Casual & Friendly</option>
                                    <option value="motivational">Motivational & Inspiring</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    <Sparkles className="w-4 h-4 inline mr-1" />
                                    AI will generate a campaign matching your existing email style
                                </p>
                                <button
                                    onClick={handleCreateCampaign}
                                    disabled={!newCampaign.name || !newCampaign.goal || generating}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all",
                                        !newCampaign.name || !newCampaign.goal || generating
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg"
                                    )}
                                >
                                    {generating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Generate Campaign
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Stats Modal */}
            {statsCampaign && (
                <CampaignStatsModal
                    campaignId={statsCampaign.id}
                    campaignName={statsCampaign.name}
                    onClose={() => setStatsCampaign(null)}
                />
            )}
        </div>
    );
}
