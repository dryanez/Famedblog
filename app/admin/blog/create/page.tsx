"use client";

import React, { useState, useRef } from 'react';
import { ArrowLeft, Loader2, Save, Sparkles, FileText, CheckCircle, Upload, X, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';

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
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const sendChat = () => {
        if (!chatInput.trim()) return;

        setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
        setChatInput('');

        // Simple echo for now - you can enhance this to call an API
        setTimeout(() => {
            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: `I'll incorporate "${chatInput}" into the blog post when you generate it.`
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
            setStatus('Researching topic and generating content with images (this may take 30-60 seconds)...');

            // Build context from chat and files
            let additionalContext = '';
            if (chatMessages.length > 0) {
                additionalContext += '\n\nUSER REQUESTS FROM CHAT:\n';
                chatMessages.filter(m => m.role === 'user').forEach(msg => {
                    additionalContext += `- ${msg.content}\n`;
                });
            }

            if (uploadedFiles.length > 0) {
                additionalContext += '\n\nREFERENCE FILES PROVIDED:\n';
                uploadedFiles.forEach(file => {
                    additionalContext += `- ${file.name}\n`;
                });
            }

            const response = await fetch('/api/blog/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    additionalContext
                })
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
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create New Blog Post</h1>
                            <p className="text-gray-500">AI-powered generation with context & images</p>
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
                                    <p className="text-gray-400 text-center py-8">Give the AI extra instructions here</p>
                                ) : (
                                    chatMessages.map((msg, i) => (
                                        <div key={i} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                                            <span className="font-semibold">{msg.role === 'user' ? 'You' : 'AI'}:</span> {msg.content}
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
                                    placeholder="e.g., Add more medical examples"
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <button
                                    onClick={sendChat}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
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
                                <p className="text-sm text-gray-600">Drop files or click to upload</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={(e) => handleFileUpload(e.target.files)}
                                className="hidden"
                            />

                            {uploadedFiles.length > 0 && (
                                <div className="space-y-2">
                                    {uploadedFiles.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                            <span className="truncate flex-1">{file.name}</span>
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
                                    Generate with Images
                                </button>
                            </div>

                            {status && (
                                <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${status.includes('Error') ? 'bg-red-50 text-red-700' :
                                        status.includes('Researching') || status.includes('Initializing') ? 'bg-blue-50 text-blue-700' :
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
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <FileText className="w-5 h-5" />
                                        <span>Generated Content</span>
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
            </div>
        </div>
    );
}
