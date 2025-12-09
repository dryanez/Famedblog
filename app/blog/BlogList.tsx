'use client';

import { useState } from 'react';
import BlogCard from '@/components/BlogCard';
import { BlogPost } from '@/lib/posts';

interface BlogListProps {
    initialPosts: BlogPost[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All Posts');

    // Get unique categories from posts, ensuring they are strings
    const categories = ['All Posts', ...new Set(initialPosts.map(post => post.category).filter(Boolean))];

    // Filter out draft posts in production (optional logic)
    const publishedPosts = initialPosts.filter(post => post.status === 'published');

    const filteredPosts = selectedCategory === 'All Posts'
        ? publishedPosts
        : publishedPosts.filter(post => post.category === selectedCategory);

    return (
        <div className="py-16 bg-white min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-gray-900">
                        FAMED Exam Blog
                    </h1>
                    <p className="text-xl text-gray-700">
                        Expert tips, study guides, and proven strategies to help you pass the FAMED exam on your first try
                    </p>
                </div>

                {/* Categories */}
                <div className="mb-12 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Browse by Category</h2>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${selectedCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {filteredPosts.map((post) => (
                        <BlogCard key={post.slug} {...post} />
                    ))}
                </div>

                {/* No results message */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No posts found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
