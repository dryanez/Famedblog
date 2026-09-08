import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
    try {
        const posts = getAllPosts();
        return NextResponse.json({
            success: true,
            posts: posts.map(post => ({
                slug: post.slug,
                title: post.title,
                date: post.date,
                category: post.category || 'General',
                status: post.status || 'published',
                tags: post.tags || [],
                excerpt: post.excerpt || '',
                facebookPosted: false,
                telegramSent: false,
            }))
        });
    } catch (error: any) {
        console.error('Get markdown posts error:', error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}
