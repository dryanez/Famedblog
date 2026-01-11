import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Verify cron secret for security
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        const now = new Date().toISOString();

        // Find posts that should be published
        const { data: postsToPublish, error: fetchError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'scheduled')
            .lte('scheduled_date', now);

        if (fetchError) throw fetchError;

        if (!postsToPublish || postsToPublish.length === 0) {
            return NextResponse.json({
                success: true,
                published: 0,
                message: 'No posts to publish'
            });
        }

        // Update posts to published
        const publishedIds = [];
        for (const post of postsToPublish) {
            const { error: updateError } = await supabase
                .from('blog_posts')
                .update({
                    status: 'published',
                    published_date: now
                })
                .eq('id', post.id);

            if (!updateError) {
                publishedIds.push(post.id);
            }
        }

        console.log(`Published ${publishedIds.length} posts:`, publishedIds);

        return NextResponse.json({
            success: true,
            published: publishedIds.length,
            total: postsToPublish.length,
            posts: postsToPublish.map(p => ({ id: p.id, title: p.title, slug: p.slug }))
        });

    } catch (error: any) {
        console.error('Auto-publish cron error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
