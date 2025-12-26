"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Save, Eye } from 'lucide-react';

interface BlogPost {
    slug: string;
    title: string;
    date: string;
    category: string;
    status: string;
    tags: string[];
    content: string;
    excerpt?: string;
}

export default function EditPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/blog/${slug}`);
            const data = await res.json();
            setPost(data.post);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!post) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/blog/${slug}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(post)
            });

            if (res.ok) {
                alert('Post saved successfully!');
            } else {
                const data = await res.json();
                alert('Failed to save: ' + data.error);
            }
        } catch (error) {
            alert('Error saving post');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <p className="text-gray-500">Loading post...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <p className="text-red-600">Post not found</p>
                <Link href="/admin/blog" className="text-blue-600 hover:underline">Back to posts</Link>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Link
                href="/admin/blog"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Blog Posts</span>
            </Link>

            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Post</h1>
                    <p className="text-gray-600 mt-2">{post.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                    >
                        <Eye className="w-4 h-4" />
                        {showPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg transition-all disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                {/* Meta Information */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={post.title}
                            onChange={(e) => setPost({ ...post, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <input
                            type="text"
                            value={post.category}
                            onChange={(e) => setPost({ ...post, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={post.date}
                            onChange={(e) => setPost({ ...post, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={post.status}
                            onChange={(e) => setPost({ ...post, status: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                    </div>
                </div>

                {/* Content Editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown)</label>
                    {showPreview ? (
                        <div className="prose max-w-none p-6 border border-gray-200 rounded-lg bg-gray-50 min-h-[500px]">
                            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
                        </div>
                    ) : (
                        <textarea
                            value={post.content}
                            onChange={(e) => setPost({ ...post, content: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm min-h-[500px]"
                            placeholder="Write your post content in Markdown..."
                        />
                    )}
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                    <input
                        type="text"
                        value={post.tags?.join(', ') || ''}
                        onChange={(e) => setPost({ ...post, tags: e.target.value.split(',').map(t => t.trim()) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="exam prep, study tips, medical german"
                    />
                </div>
            </div>
        </div>
    );
}
