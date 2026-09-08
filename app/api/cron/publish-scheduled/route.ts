import { NextResponse } from 'next/server';
import { publishScheduledPosts } from '@/lib/publishing';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Verify cron secret for security
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        const result = await publishScheduledPosts();

        if (result.error) {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            published: result.published.length,
            posts: result.published
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
