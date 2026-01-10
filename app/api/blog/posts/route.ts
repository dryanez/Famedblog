import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'blog/posts');

export async function POST(request: Request) {
    try {
        const { slug, content } = await request.json();

        if (!slug || !content) {
            return NextResponse.json(
                { error: 'Slug and content are required' },
                { status: 400 }
            );
        }

        // Ensure directory exists
        if (!fs.existsSync(POSTS_DIR)) {
            fs.mkdirSync(POSTS_DIR, { recursive: true });
        }

        // Validate slug for safety
        const safeSlug = slug.replace(/[^a-zA-Z0-9-]/g, '');
        const filePath = path.join(POSTS_DIR, `${safeSlug}.md`);

        // Write file
        fs.writeFileSync(filePath, content, 'utf8');

        return NextResponse.json({
            success: true,
            message: 'Post saved successfully',
            slug: safeSlug,
            path: filePath
        });

    } catch (error: any) {
        console.error('Save post error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save post' },
            { status: 500 }
        );
    }
}
