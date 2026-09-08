import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function publishScheduledPosts() {
    const now = new Date().toISOString();
    const results = {
        success: false,
        published: [] as string[],
        totalFound: 0,
        error: null as string | null
    };

    try {
        console.log('[Publishing] Checking for scheduled posts...');

        // Find posts that should be published
        const { data: postsToPublish, error: fetchError } = await supabase
            .from('blog_posts')
            .select('id, title, slug')
            .eq('status', 'scheduled')
            .lte('scheduled_date', now);

        if (fetchError) throw fetchError;

        results.totalFound = postsToPublish?.length || 0;

        if (!postsToPublish || postsToPublish.length === 0) {
            console.log('[Publishing] No posts to publish.');
            results.success = true;
            return results;
        }

        console.log(`[Publishing] Found ${postsToPublish.length} posts to publish.`);

        // Update posts to published
        for (const post of postsToPublish) {
            const { error: updateError } = await supabase
                .from('blog_posts')
                .update({
                    status: 'published',
                    published_date: now,
                    updated_at: now
                })
                .eq('id', post.id);

            if (updateError) {
                console.error(`[Publishing] Failed to publish post ${post.id}:`, updateError);
            } else {
                console.log(`[Publishing] Successfully published: ${post.title}`);
                results.published.push(post.title);
            }
        }

        results.success = true;
        return results;

    } catch (error: any) {
        console.error('[Publishing] Error:', error);
        results.error = error.message;
        return results;
    }
}
