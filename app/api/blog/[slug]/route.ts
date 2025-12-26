import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/posts';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'blog/posts');

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const post = getPostBySlug(params.slug);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ post });
    } catch (error: any) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const body = await request.json();
        const { title, category, date, status, content, tags, excerpt } = body;

        const filePath = path.join(postsDirectory, `${params.slug}.md`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Read existing file
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const matterData = matter(fileContents);

        // Update frontmatter
        const updatedFrontmatter = {
            ...matterData.data,
            title,
            category,
            date,
            status,
            tags: tags || [],
            excerpt: excerpt || matterData.data.excerpt,
        };

        // Rebuild markdown file with updated frontmatter and content
        const newContent = matter.stringify(content, updatedFrontmatter);

        // Write back to file
        fs.writeFileSync(filePath, newContent, 'utf8');

        return NextResponse.json({ success: true, message: 'Post updated successfully' });
    } catch (error: any) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
