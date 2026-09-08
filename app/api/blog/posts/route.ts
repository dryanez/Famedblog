import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const { slug, content, title, excerpt, tags, status, pdfUri, pdfName, selectedTopic } = await request.json();

        if (!slug || !content) {
            return NextResponse.json({ error: 'Slug and content are required' }, { status: 400 });
        }

        // Extract frontmatter to get title, excerpt, tags
        let parsedTitle = title;
        let parsedExcerpt = excerpt;
        let parsedTags = tags;

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
            const excerptMatch = frontmatter.match(/excerpt:\s*["']?([^"'\n]+)["']?/);
            const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);

            if (titleMatch) parsedTitle = titleMatch[1];
            if (excerptMatch) parsedExcerpt = excerptMatch[1];
            if (tagsMatch) {
                parsedTags = tagsMatch[1].split(',').map((t: string) => t.trim().replace(/["']/g, ''));
            }
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from('blog_posts')
            .insert([{
                slug,
                title: parsedTitle || slug,
                content,
                excerpt: parsedExcerpt,
                tags: parsedTags || ['FaMED', 'Preparation'],
                status: status || 'draft',
                pdf_uri: pdfUri,
                pdf_name: pdfName,
                selected_topic: selectedTopic
            }])
            .select()
            .single();

        if (error) {
            // If duplicate slug, try to update instead
            if (error.code === '23505') {
                const { data: updateData, error: updateError } = await supabase
                    .from('blog_posts')
                    .update({
                        title: parsedTitle || slug,
                        content,
                        excerpt: parsedExcerpt,
                        tags: parsedTags || ['FaMED', 'Preparation'],
                        updated_at: new Date().toISOString()
                    })
                    .eq('slug', slug)
                    .select()
                    .single();

                if (updateError) throw updateError;

                return NextResponse.json({
                    success: true,
                    path: `/blog/${slug}`,
                    post: updateData,
                    message: 'Post updated successfully'
                });
            }
            throw error;
        }

        return NextResponse.json({
            success: true,
            path: `/blog/${slug}`,
            post: data,
            message: 'Post saved successfully'
        });

    } catch (error: any) {
        console.error('Save post error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to save post',
            success: false
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            posts: data || []
        });
    } catch (error: any) {
        console.error('Get posts error:', error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}
