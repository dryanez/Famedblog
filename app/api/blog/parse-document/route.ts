import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const fileName = file.name.toLowerCase();
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let extractedText = '';

        // Only support text-based files (PDF parsing doesn't work in serverless)
        if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
            extractedText = buffer.toString('utf-8');
        } else {
            return NextResponse.json({
                error: 'Only TXT and MD files are supported. Please convert your document to plain text first.',
                success: false
            }, { status: 400 });
        }

        // Truncate if too long
        const maxLength = 10000;
        if (extractedText.length > maxLength) {
            extractedText = extractedText.substring(0, maxLength) + '\n\n[... truncated for length ...]';
        }

        return NextResponse.json({
            success: true,
            fileName: file.name,
            textLength: extractedText.length,
            content: extractedText
        });

    } catch (error: any) {
        console.error('Document parse error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to parse document',
            success: false
        }, { status: 500 });
    }
}
