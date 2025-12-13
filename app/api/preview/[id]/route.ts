import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface PreviewData {
    post_slug: string;
    content: string;
    created_at: string;
    expires_at: string;
}

const PREVIEW_STORAGE = path.join(process.cwd(), 'preview_drafts.json');

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: previewId } = await params;

        // Load preview storage
        if (!fs.existsSync(PREVIEW_STORAGE)) {
            return NextResponse.json({ error: 'Preview not found' }, { status: 404 });
        }

        const storage: Record<string, PreviewData> = JSON.parse(
            fs.readFileSync(PREVIEW_STORAGE, 'utf-8')
        );

        const preview = storage[previewId];

        if (!preview) {
            return NextResponse.json({ error: 'Preview not found' }, { status: 404 });
        }

        // Check if expired
        if (new Date() > new Date(preview.expires_at)) {
            delete storage[previewId];
            fs.writeFileSync(PREVIEW_STORAGE, JSON.stringify(storage, null, 2));
            return NextResponse.json({ error: 'Preview expired' }, { status: 410 });
        }

        return NextResponse.json({
            success: true,
            data: {
                slug: preview.post_slug,
                content: preview.content
            }
        });
    } catch (error) {
        console.error('Preview API error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
