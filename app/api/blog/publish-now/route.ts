import { NextResponse } from 'next/server';
import { publishScheduledPosts } from '@/lib/publishing';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        // In a real app, check for Admin session here
        // For now, valid since it's an internal tool

        const result = await publishScheduledPosts();

        if (result.error) {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            published: result.published.length,
            posts: result.published,
            message: result.published.length > 0
                ? `Published ${result.published.length} posts.`
                : 'No pending scheduled posts found.'
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
