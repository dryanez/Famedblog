"use client";

import { useState, useEffect } from "react";
import { X, Save, Eye, Code, Loader2 } from "lucide-react";

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

    useEffect(() => {
        setContent(initialContent);
        setHasChanges(false);
    }, [initialContent]);

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        setHasChanges(newContent !== initialContent);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(content);
            setHasChanges(false);
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    return (
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
                                Preview
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
                        /* Live Preview */
                        <div className="flex-1 overflow-auto bg-gray-50 p-6">
                            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
                                <iframe
                                    srcDoc={content}
                                    className="w-full h-[calc(90vh-200px)] border-0"
                                    title="Email Preview"
                                    sandbox="allow-same-origin"
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
                        Tip: Edit the HTML directly below. Change URLs, text, images, styling - everything!
                    </div>
                </div>
            </div>
        </div>
    );
}
