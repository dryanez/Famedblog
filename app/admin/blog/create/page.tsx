"use client";

import React, { useState } from 'react';
import { ArrowLeft, Loader2, Save, Sparkles, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateBlogPostPage() {
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [savedPath, setSavedPath] = useState('');

    const handleGenerate = async () => {
        if (!topic) return;

        setLoading(true);
        setStatus('Initializing AI agent...');
        setContent(''); // Clear previous
        setSavedPath('');

        try {
            setStatus('Researching topic and generating content (this may take 1-2 minutes)...');

            const response = await fetch('/api/blog/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Generation failed');
            }

            if (data.success && data.content) {
                setContent(data.content);
                setStatus('✅ Content generated successfully!');
            } else {
                throw new Error(data.error || 'No content returned');
            }
        } catch (error: any) {
            console.error('Generation Error:', error);
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content) return;

        setLoading(true);
        setStatus('Saving draft...');

        try {
            // Extract slug from frontmatter or topic
            let slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            // Try to extract slug from frontmatter title if available
            const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/);
            if (titleMatch && titleMatch[1]) {
                slug = titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }

            const response = await fetch('/api/blog/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    content
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSavedPath(data.path);
                setStatus(`✅ Saved successfully to ${data.path}`);
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            setStatus(`❌ Save Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create New Blog Post</h1>
                            <p className="text-gray-500">AI-powered content generation for FaMED</p>
                        </div>
                    </div>
                </div>

                {/* Generator Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Topic or Keyword</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., 'Anamnese Tips for FaMED' or 'Exam Anxiety Strategies'"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !topic}
                            className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${loading || !topic
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md active:scale-95'
                                }`}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            Generate Draft
                        </button>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${status.includes('Error') ? 'bg-red-50 text-red-700' :
                                status.includes('Researching') ? 'bg-blue-50 text-blue-700' :
                                    'bg-green-50 text-green-700'
                            }`}>
                            {loading && !status.includes('Error') && <Loader2 className="w-4 h-4 animate-spin" />}
                            {status.includes('✅') && <CheckCircle className="w-4 h-4" />}
                            {status}
                        </div>
                    )}
                </div>

                {/* Editor Area */}
                {content && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <FileText className="w-5 h-5" />
                                <span>Markdown Content</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigator.clipboard.writeText(content)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Copy
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium shadow-sm"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Post
                                </button>
                            </div>
                        </div>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-[600px] font-mono text-sm p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                            spellCheck={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
