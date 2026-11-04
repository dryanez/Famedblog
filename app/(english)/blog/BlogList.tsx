'use client';

import { useState } from 'react';
import BlogCard from '@/components/BlogCard';
import { BlogPost } from '@/lib/posts';
import HeroGuideForm from '@/components/HeroGuideForm';
import {guideOffer} from '@/lib/guide-offer';
import type {Locale} from '@/lib/languages';

interface BlogListProps {
    initialPosts: BlogPost[];
    arabic?: boolean;
    locale?: Locale;
}

export default function BlogList({ initialPosts, arabic=false,locale }: BlogListProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All Posts');
    const lang:Locale=locale||(arabic?'ar':'en'),offer=guideOffer[lang];

    // Get unique categories from posts, ensuring they are strings
    const categories = ['All Posts', ...new Set(initialPosts.map(post => post.category).filter(Boolean))];

    // Filter out draft posts in production (optional logic)
    const publishedPosts = initialPosts.filter(post => post.status === 'published');

    const filteredPosts = selectedCategory === 'All Posts'
        ? publishedPosts
        : publishedPosts.filter(post => post.category === selectedCategory);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-slate-200 bg-[#f4f8fd] px-5 py-14 md:py-20">
                <div className="mx-auto max-w-6xl">
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-700">{offer.eyebrow}</p>
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
                        {arabic?'مدونة امتحان FaMED':locale==='es'?'Blog de preparación para FaMED':'FaMED Exam Blog'}
                    </h1>
                    <p className="mt-5 max-w-2xl text-xl leading-relaxed text-slate-600">
                        {arabic?'مقالات وأدلة وتدريبات للتحضير للتواصل الطبي باللغة الألمانية.':locale==='es'?'Artículos, guías y ejercicios para practicar comunicación médica en alemán.':'Articles, study guides and exercises for medical German communication.'}
                    </p>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
                {/* Categories */}
                <h2 className="sr-only">{arabic?'تصفّح حسب الموضوع':locale==='es'?'Explorar por tema':'Browse by category'}</h2>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            aria-pressed={selectedCategory === category}
                            className={`min-h-11 rounded-full px-5 text-sm font-semibold transition ${selectedCategory === category
                                    ? 'bg-blue-700 text-white shadow-md shadow-blue-700/25'
                                    : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:text-blue-700 hover:ring-blue-300'
                                }`}
                        >
                            {category==='All Posts'?(arabic?'جميع المقالات':locale==='es'?'Todos los artículos':'All Posts'):category}
                        </button>
                    ))}
                </div>

                {/* Blog Posts Grid */}
                <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post) => (
                        <BlogCard key={post.slug} {...post} arabic={arabic} locale={locale} />
                    ))}
                </div>

                {/* No results message */}
                {filteredPosts.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-lg text-slate-500">{arabic?'لا توجد مقالات.':locale==='es'?'No se encontraron artículos.':'No posts found.'}</p>
                    </div>
                )}
            </div>

            {/* Free guide signup */}
            <section className="bg-blue-800 px-5 py-16 text-white md:py-20">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:gap-16">
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold uppercase tracking-wider text-blue-200">{offer.free}</p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{offer.cta}</h2>
                    </div>
                    <div className="w-full max-w-xl flex-1"><HeroGuideForm locale={lang} id="blog" dark/></div>
                </div>
            </section>
        </div>
    );
}
