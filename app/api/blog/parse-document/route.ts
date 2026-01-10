import { NextResponse } from 'next/server';
// @ts-ignore - pdf-parse doesn't have types
import pdf from 'pdf-parse';

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

        // Handle different file types
        if (fileName.endsWith('.pdf')) {
            try {
                const pdfData = await pdf(buffer);
                extractedText = pdfData.text;
            } catch (e: any) {
                return NextResponse.json({
                    error: 'Failed to parse PDF',
                    details: e.message
                }, { status: 400 });
            }
        } else if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
            extractedText = buffer.toString('utf-8');
        } else if (fileName.endsWith('.docx')) {
            // For DOCX, we'd need mammoth.js - for now just return error
            return NextResponse.json({
                error: 'DOCX not yet supported. Please use PDF or TXT.'
            }, { status: 400 });
        } else {
            return NextResponse.json({
                error: `Unsupported file type: ${fileName}`
            }, { status: 400 });
        }

        // Truncate if too long (keep first 10000 chars to avoid token limits)
        const maxLength = 10000;
        if (extractedText.length > maxLength) {
            extractedText = extractedText.substring(0, maxLength) + '\n\n[... content truncated for length ...]';
        }

        return NextResponse.json({
            success: true,
            fileName: file.name,
            textLength: extractedText.length,
            content: extractedText
        });

    } catch (error: any) {
        console.error('Document parse error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
