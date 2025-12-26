import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
    try {
        const posts = getAllPosts();

        // Add metadata for admin view
        const postsWithMetadata = posts.map(post => ({
            slug: post.slug,
            title: post.title,
            date: post.date,
            category: post.category,
            status: post.status || 'draft',
            tags: post.tags || [],
            excerpt: post.excerpt,
            // Social media status - you can extend this later
            facebookPosted: false, // TODO: Track from logs
            telegramSent: false, // TODO: Track from logs
        }));

        return NextResponse.json({ posts: postsWithMetadata });
    } catch (error: any) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
