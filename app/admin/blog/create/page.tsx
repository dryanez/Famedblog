"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Loader2, Save, Sparkles, FileText, CheckCircle, Upload, X, Send, MessageSquare, Eye, Code, FileUp, Lightbulb, FolderOpen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface TopicSuggestion {
    title: string;
    angle: string;
    keywords: string[];
    searchVolume: 'High' | 'Medium' | 'Low';
}

interface StoredDocument {
    id: string;
    file_name: string;
    file_uri: string;
    uploaded_at: string;
}

export default function CreateBlogPostPage() {
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [savedPath, setSavedPath] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

    // PDF workflow states
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfUri, setPdfUri] = useState<string>('');
    const [suggestedTopics, setSuggestedTopics] = useState<TopicSuggestion[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<TopicSuggestion | null>(null);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [storedDocuments, setStoredDocuments] = useState<StoredDocument[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    const pdfInputRef = useRef<HTMLInputElement>(null);

    // Fetch stored documents on mount
    useEffect(() => {
        fetchStoredDocuments();
    }, []);

    const fetchStoredDocuments = async () => {
        setLoadingDocs(true);
        try {
            const res = await fetch('/api/blog/documents');
            const data = await res.json();
            if (data.success) {
                setStoredDocuments(data.documents || []);
            }
        } catch (e) {
            console.error('Failed to fetch documents:', e);
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleSelectStoredDocument = async (doc: StoredDocument) => {
        setPdfUri(doc.file_uri);
        setPdfFile(null);
        setStatus(`Selected: ${doc.file_name}. Analyzing for topics...`);
        await getSuggestedTopics(doc.file_uri);
    };

    const handleDeleteDocument = async (id: string) => {
        if (!confirm('Delete this document?')) return;

        try {
            await fetch('/api/blog/documents', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            await fetchStoredDocuments();
        } catch (e) {
            console.error('Failed to delete:', e);
        }
    };

    const handlePdfUpload = async (file: File) => {
        if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
            alert('Please upload a PDF file');
            return;
        }

        setPdfFile(file);
        setUploadingPdf(true);
        setStatus('Uploading PDF to Gemini...');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/blog/upload-pdf', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (data.success && data.fileUri) {
                setPdfUri(data.fileUri);
                setStatus('✅ PDF uploaded! Analyzing for topic suggestions...');

                // Get topic suggestions
                await getSuggestedTopics(data.fileUri);
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error: any) {
            setStatus(`❌ Error: ${error.message}`);
            setPdfFile(null);
        } finally {
            setUploadingPdf(false);
        }
    };

    const getSuggestedTopics = async (fileUri: string) => {
        setLoading(true);
        setStatus('AI is analyzing your PDF and suggesting topics...');

        try {
            const res = await fetch('/api/blog/suggest-topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileUri })
            });

            const data = await res.json();

            if (data.success && data.topics) {
                setSuggestedTopics(data.topics);
                setStatus(`✅ Found ${data.topics.length} topic ideas! Pick one to generate.`);
            } else {
                throw new Error(data.error || 'Failed to get suggestions');
            }
        } catch (error: any) {
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleTopicSelect = (topic: TopicSuggestion) => {
        setSelectedTopic(topic);
        setTopic(topic.title);
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

    const handleScheduleAll = async () => {
        if (!suggestedTopics || suggestedTopics.length === 0) return;

        if (!confirm(`Schedule all ${suggestedTopics.length} topics? They will be posted 1 per day starting tomorrow at 9 AM.`)) {
            return;
        }

        setLoading(true);
        setStatus(`Scheduling ${suggestedTopics.length} posts...`);

        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const response = await fetch('/api/blog/schedule-bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topics: suggestedTopics,
                    pdfUri: pdfUri || undefined,
                    pdfName: pdfFile?.name || 'Unknown',
                    startDate: tomorrow.toISOString().split('T')[0]
                })
            });

            const data = await response.json();

            if (data.success) {
                setStatus(`✅ Scheduled ${data.scheduled}/${data.total} posts! Check the calendar to see them.`);
                setSuggestedTopics([]);
                setPdfUri('');
                setPdfFile(null);
            } else {
                throw new Error(data.error || 'Scheduling failed');
            }
        } catch (error: any) {
            console.error('Schedule error:', error);
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!topic) return;

        setLoading(true);
        setStatus('Generating blog post (30-60 seconds)...');
        setContent('');
        setSavedPath('');

        try {
            let additionalContext = '';
            if (chatMessages.length > 0) {
                additionalContext += '\n\nUSER REQUESTS FROM CHAT:\n';
                chatMessages.filter(m => m.role === 'user').forEach(msg => {
                    additionalContext += `- ${msg.content}\n`;
                });
            }

            const response = await fetch('/api/blog/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    additionalContext,
                    fileUri: pdfUri || undefined,
                    selectedTopic: selectedTopic || undefined
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Generation failed');
            }

            if (data.success && data.content) {
                let finalContent = data.content;

                // Extract image placeholders and generate real images
                const imagePlaceholders = finalContent.match(/!\[([^\]]+)\]\(\/placeholder-image\.jpg\)/g);

                if (imagePlaceholders && imagePlaceholders.length > 0) {
                    setStatus(`✅ Content generated! Generating ${imagePlaceholders.length} image(s)...`);

                    for (let i = 0; i < Math.min(imagePlaceholders.length, 2); i++) {
                        const placeholder = imagePlaceholders[i];
                        const descriptionMatch = placeholder.match(/!\[([^\]]+)\]/);

                        if (descriptionMatch) {
                            const description = descriptionMatch[1];

                            try {
                                const imgRes = await fetch('/api/blog/generate-image', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        description,
                                        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                                    })
                                });

                                const imgData = await imgRes.json();

                                if (imgData.success && imgData.imagePath) {
                                    // Replace placeholder with actual image path
                                    finalContent = finalContent.replace(
                                        placeholder,
                                        `![${description}](${imgData.imagePath})`
                                    );
                                }
                            } catch (e) {
                                console.warn('Image generation failed:', e);
                                // Keep placeholder if generation fails
                            }
                        }
                    }
                }

                setContent(finalContent);
                setStatus('✅ Content generated with images! Switch to Preview.');
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
                            <p className="text-gray-500">Upload PDF for AI topic suggestions or enter manually</p>
                        </div>
                    </div>
                </div>

                {/* PDF Upload Section */}
                {!pdfUri && (
                    <>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-300 p-8">
                            <div className="text-center">
                                <FileUp className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF for AI Topic Suggestions</h3>
                                <p className="text-gray-600 mb-4">AI will analyze your document and suggest SEO-optimized blog topics</p>
                                <input
                                    ref={pdfInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => pdfInputRef.current?.click()}
                                    disabled={uploadingPdf}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
                                >
                                    {uploadingPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                    {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                                </button>
                                <p className="text-xs text-gray-500 mt-3">Or skip and enter topic manually below</p>
                            </div>
                        </div>

                        {/* Stored Documents Library - ALWAYS SHOW */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FolderOpen className="w-5 h-5 text-gray-600" />
                                <h3 className="text-lg font-semibold text-gray-900">My Documents</h3>
                                <span className="text-sm text-gray-500">({storedDocuments.length})</span>
                            </div>

                            {loadingDocs ? (
                                <div className="flex items-center justify-center py-8 text-gray-500">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Loading documents...
                                </div>
                            ) : storedDocuments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No documents saved yet.</p>
                                    <p className="text-sm mt-1">Upload a PDF above and it will appear here for reuse.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {storedDocuments.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="group flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
                                            onClick={() => handleSelectStoredDocument(doc)}
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <FileText className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</p>
                                                    <p className="text-xs text-gray-500">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.id); }}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</p>
                            <p className="text-xs text-gray-500">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded transition"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
                                    ))}
        </div>
                            </div >
                        )
}
                    </>
                )}

{/* Topic Suggestions */ }
{
    suggestedTopics.length > 0 && !selectedTopic && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Suggested Topics</h3>
                </div>
                <button
                    onClick={handleScheduleAll}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium inline-flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '📅'}
                    Schedule All (1/day for {suggestedTopics.length} days)
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {suggestedTopics.map((topic, i) => (
                    <button
                        key={i}
                        onClick={() => handleTopicSelect(topic)}
                        className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 flex-1">{topic.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded ${topic.searchVolume === 'High' ? 'bg-green-100 text-green-700' :
                                topic.searchVolume === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                {topic.searchVolume}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{topic.angle}</p>
                        <div className="flex flex-wrap gap-1">
                            {topic.keywords.slice(0, 3).map((kw, j) => (
                                <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{kw}</span>
                            ))}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

<div className="grid grid-cols-3 gap-6">
    {/* Left: Context Panel */}
    <div className="col-span-1 space-y-4">
        {/* Selected Topic Display */}
        {selectedTopic && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Selected Topic</span>
                </div>
                <p className="text-sm text-green-800 font-medium">{selectedTopic.title}</p>
                <button
                    onClick={() => { setSelectedTopic(null); setTopic(''); }}
                    className="text-xs text-green-600 hover:text-green-700 mt-2"
                >
                    Change topic
                </button>
            </div>
        )}

        {/* Chat Box */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
            <div className="flex items-center gap-2 text-gray-700 font-medium border-b pb-2">
                <MessageSquare className="w-5 h-5" />
                <span>Chat with AI</span>
            </div>

            <div className="h-48 overflow-y-auto space-y-2 text-sm">
                {chatMessages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Add extra instructions</p>
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
                        disabled={!!selectedTopic}
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base disabled:bg-gray-100"
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
                    status.includes('Generating') || status.includes('Uploading') || status.includes('Analyzing') ? 'bg-blue-50 text-blue-700' :
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
            </div >
        </div >
    );
}
