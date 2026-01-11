import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        const { data: post, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !post) {
            return NextResponse.json({
                error: 'Post not found',
                success: false
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            post
        });
    } catch (error: any) {
        console.error('Get post error:', error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;
        const body = await request.json();

        const { data, error } = await supabase
            .from('blog_posts')
            .update({
                title: body.title,
                content: body.content,
                excerpt: body.excerpt,
                tags: body.tags,
                status: body.status,
                scheduled_date: body.scheduled_date,
                updated_at: new Date().toISOString()
            })
            .eq('slug', slug)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            post: data
        });
    } catch (error: any) {
        console.error('Update post error:', error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('slug', slug);

        if (error) throw error;

        return NextResponse.json({
            success: true
        });
    } catch (error: any) {
        console.error('Delete post error:', error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}
