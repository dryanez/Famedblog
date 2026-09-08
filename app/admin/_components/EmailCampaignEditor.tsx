"use client";

import { useState, useEffect, useRef } from "react";
import { X, Save, Eye, Code, Loader2, Send } from "lucide-react";

interface EmailCampaignEditorProps {
    campaignId: string;
    campaignName: string;
    initialContent: string;
    onClose: () => void;
    onSave: (content: string) => Promise<void>;
}

export function EmailCampaignEditor({
    campaignId,
    campaignName,
    initialContent,
    onClose,
    onSave
}: EmailCampaignEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    const [testEmail, setTestEmail] = useState("");
    const [sendingTest, setSendingTest] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setContent(initialContent);
        setHasChanges(false);
    }, [initialContent]);

    // Update preview when switching to preview mode, but NOT during active editing
    useEffect(() => {
        if (viewMode === 'preview' && previewRef.current) {
            // Only update if the element is not currently focused (not being edited)
            if (document.activeElement !== previewRef.current) {
                previewRef.current.innerHTML = content;
            }
        }
    }, [content, viewMode]);

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        setHasChanges(newContent !== initialContent);
    };

    // Handle direct editing in preview
    const handlePreviewEdit = () => {
        if (previewRef.current) {
            const newContent = previewRef.current.innerHTML;
            handleContentChange(newContent);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            console.log('Saving content, length:', content.length);
            await onSave(content);
            setHasChanges(false);
            console.log('Save successful!');
        } catch (error: any) {
            console.error('Save error:', error);
            const errorMessage = error?.message || error?.toString() || 'Failed to save changes';
            alert(`Failed to save changes: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    const handleSendTest = async () => {
        if (!testEmail) return;

        setSendingTest(true);
        try {
            const response = await fetch('/api/campaigns/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId: campaignId,
                    testEmail: testEmail
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert(`✅ Test email sent to ${testEmail}!`);
                setShowTestModal(false);
                setTestEmail("");
            } else {
                alert(`❌ Failed to send test: ${data.error}`);
            }
        } catch (error) {
            alert('❌ Error sending test email');
        } finally {
            setSendingTest(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Email Editor</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Campaign: <span className="font-medium">{campaignName}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                                <button
                                    onClick={() => setViewMode('preview')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'preview'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Eye className="w-4 h-4" />
                                    Editing
                                </button>
                                <button
                                    onClick={() => setViewMode('code')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'code'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Code className="w-4 h-4" />
                                    Code
                                </button>
                            </div>

                            {/* Send Test Button */}
                            <button
                                onClick={() => setShowTestModal(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-all shadow-sm"
                            >
                                <Send className="w-4 h-4" />
                                Send Test
                            </button>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || saving}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${hasChanges && !saving
                                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden flex">
                        {viewMode === 'preview' ? (
                            /* Editable Preview */
                            <div className="flex-1 overflow-auto bg-gray-50 p-6">
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>💡 Click anywhere to edit!</strong> You can directly edit text, links, and content in the email below.
                                    </p>
                                </div>
                                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                                    <div
                                        ref={previewRef}
                                        contentEditable={true}
                                        onInput={handlePreviewEdit}
                                        onBlur={handlePreviewEdit}
                                        className="w-full min-h-[calc(90vh-300px)] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{ color: '#333333', backgroundColor: '#ffffff' }}
                                        suppressContentEditableWarning={true}
                                    />
                                </div>
                            </div>
                        ) : (
                            /* Code Editor */
                            <div className="flex-1 overflow-auto p-6 bg-gray-900">
                                <textarea
                                    value={content}
                                    onChange={(e) => handleContentChange(e.target.value)}
                                    className="w-full h-full bg-gray-800 text-gray-100 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                    spellCheck={false}
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {hasChanges ? (
                                <span className="text-amber-600 font-medium">● Unsaved changes</span>
                            ) : (
                                <span className="text-green-600">✓ All changes saved</span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500">
                            {viewMode === 'preview'
                                ? 'Click and type directly in the email to edit. Switch to Code mode for HTML editing.'
                                : 'Edit HTML code directly. Switch to Editing mode to see the visual preview.'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Send Test Modal */}
            {showTestModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Send Test Email</h3>
                            <button
                                onClick={() => setShowTestModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Enter your email address to receive a test version of this campaign.
                        </p>

                        <input
                            type="email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none mb-4"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && testEmail) {
                                    handleSendTest();
                                }
                            }}
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowTestModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendTest}
                                disabled={!testEmail || sendingTest}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {sendingTest ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Test
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
