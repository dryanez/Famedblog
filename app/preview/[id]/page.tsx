'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { marked } from 'marked';

interface PreviewData {
    slug: string;
    content: string;
}

export default function PreviewPage() {
    const params = useParams();
    const [preview, setPreview] = useState<PreviewData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const response = await fetch(`/api/preview/${params.id}`);

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to load preview');
                }

                const result = await response.json();
                setPreview(result.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchPreview();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading preview...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview Not Available</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Draft Banner */}
            <div className="bg-yellow-500 text-white py-3 px-4 text-center font-semibold sticky top-0 z-50 shadow-md">
                🔒 DRAFT PREVIEW - Not publicly visible
            </div>

            {/* Content */}
            <article className="max-w-4xl mx-auto px-4 py-12 bg-white mt-8 rounded-lg shadow-lg">
                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(preview?.content || '') }}
                />
            </article>

            {/* Footer Note */}
            <div className="text-center py-8 text-sm text-gray-500">
                This is a temporary preview. Link expires in 24 hours.
            </div>
        </div>
    );
}
