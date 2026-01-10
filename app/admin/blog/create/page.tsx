"use client";

import React, { useState, useRef } from 'react';
import { ArrowLeft, Loader2, Save, Sparkles, FileText, CheckCircle, Upload, X, Send, MessageSquare, Eye, Code } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default function CreateBlogPostPage() {
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [savedPath, setSavedPath] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string, content: string, parsing?: boolean }[]>([]);
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (files: FileList | null) => {
        if (!files) return;

        for (const file of Array.from(files)) {
            // Add file with parsing status
            setUploadedFiles(prev => [...prev, { name: file.name, content: '', parsing: true }]);

            try {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('/api/blog/parse-document', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();

                if (data.success && data.content) {
                    setUploadedFiles(prev =>
                        prev.map(f => f.name === file.name ? { name: file.name, content: data.content, parsing: false } : f)
                    );
                } else {
                    // Remove failed file
                    setUploadedFiles(prev => prev.filter(f => f.name !== file.name));
                    alert(`Failed to parse ${file.name}: ${data.error}`);
                }
            } catch (e: any) {
                setUploadedFiles(prev => prev.filter(f => f.name !== file.name));
                alert(`Error parsing ${file.name}`);
            }
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const sendChat = () => {
        if (!chatInput.trim()) return;

        setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
        setChatInput('');

        setTimeout(() => {
            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: `Got it! I'll include "${chatInput}" when generating.`
            }]);
        }, 500);
    };

    const handleGenerate = async () => {
        if (!topic) return;

        setLoading(true);
        setStatus('Initializing AI agent...');
        setContent('');
        setSavedPath('');

        try {
            setStatus('Generating blog post with images (30-60 seconds)...');

            let additionalContext = '';
            if (chatMessages.length > 0) {
                additionalContext += '\n\nUSER REQUESTS FROM CHAT:\n';
                chatMessages.filter(m => m.role === 'user').forEach(msg => {
                    additionalContext += `- ${msg.content}\n`;
                });
            }

            if (uploadedFiles.length > 0) {
                additionalContext += '\n\n=== DOCUMENT CONTENTS (USE THIS INFORMATION) ===\n';
                uploadedFiles.forEach(file => {
                    if (file.content) {
                        additionalContext += `\n--- FROM ${file.name} ---\n${file.content}\n`;
                    }
                });
            }

            const response = await fetch('/api/blog/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, additionalContext })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Generation failed');
            }

            if (data.success && data.content) {
                setContent(data.content);
                setStatus('✅ Content generated! Switch to Preview to see styled version.');
                setViewMode('preview');
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
            let slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/);
            if (titleMatch && titleMatch[1]) {
                slug = titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }

            const response = await fetch('/api/blog/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, content })
            });

            const data = await response.json();

            if (response.ok) {
                setSavedPath(data.path);
                setStatus(`✅ Saved to ${data.path}`);
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            setStatus(`❌ Save Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Extract body content (remove frontmatter for preview)
    const getPreviewContent = () => {
        const parts = content.split('---');
        if (parts.length >= 3) {
            return parts.slice(2).join('---').trim();
        }
        return content;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create New Blog Post</h1>
                            <p className="text-gray-500">AI-powered generation with images</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Left: Context Panel */}
                    <div className="col-span-1 space-y-4">
                        {/* Chat Box */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
                            <div className="flex items-center gap-2 text-gray-700 font-medium border-b pb-2">
                                <MessageSquare className="w-5 h-5" />
                                <span>Chat with AI</span>
                            </div>

                            <div className="h-48 overflow-y-auto space-y-2 text-sm">
                                {chatMessages.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">Add instructions for the AI here</p>
                                ) : (
                                    chatMessages.map((msg, i) => (
                                        <div key={i} className={`p-2 rounded text-gray-900 ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                            <span className="font-bold">{msg.role === 'user' ? 'You' : 'AI'}:</span> {msg.content}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                                    placeholder="e.g., Add more examples"
                                    className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <button onClick={sendChat} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
                            <div className="flex items-center gap-2 text-gray-700 font-medium border-b pb-2">
                                <Upload className="w-5 h-5" />
                                <span>Reference Files</span>
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
                                onDragOver={(e) => e.preventDefault()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
                            >
                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">Drop files or click</p>
                            </div>
                            <input ref={fileInputRef} type="file" multiple onChange={(e) => handleFileUpload(e.target.files)} className="hidden" />

                            {uploadedFiles.length > 0 && (
                                <div className="space-y-2">
                                    {uploadedFiles.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm text-gray-900">
                                            <div className="flex items-center gap-2 truncate flex-1">
                                                {file.parsing ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                )}
                                                <span className="truncate">{file.name}</span>
                                                {!file.parsing && <span className="text-xs text-gray-400">({file.content.length} chars)</span>}
                                            </div>
                                            <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Generator & Editor */}
                    <div className="col-span-2 space-y-4">
                        {/* Generator Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Topic or Keyword</label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., 'FaMED Anamnese Tips'"
                                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base"
                                    />
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !topic}
                                    className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${loading || !topic
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg active:scale-95'
                                        }`}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                    Generate
                                </button>
                            </div>

                            {status && (
                                <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${status.includes('Error') ? 'bg-red-50 text-red-700' :
                                    status.includes('Generating') || status.includes('Initializing') ? 'bg-blue-50 text-blue-700' :
                                        'bg-green-50 text-green-700'
                                    }`}>
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {status.includes('✅') && <CheckCircle className="w-4 h-4" />}
                                    {status}
                                </div>
                            )}
                        </div>

                        {/* Editor/Preview Area */}
                        {content && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Toolbar */}
                                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setViewMode('edit')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${viewMode === 'edit' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Code className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setViewMode('preview')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${viewMode === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Eye className="w-4 h-4" />
                                            Preview
                                        </button>
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
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-4">
                                    {viewMode === 'edit' ? (
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="w-full h-[600px] font-mono text-sm p-4 text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                            spellCheck={false}
                                        />
                                    ) : (
                                        <div className="prose prose-lg max-w-none h-[600px] overflow-y-auto p-4 bg-white rounded-lg border border-gray-200">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {getPreviewContent()}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
