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

        // Handle different file types
        if (fileName.endsWith('.pdf')) {
            try {
                // Use require for pdf-parse as it doesn't have proper ESM support
                const pdfParse = require('pdf-parse');
                const pdfData = await pdfParse(buffer);
                extractedText = pdfData.text;

                if (!extractedText || extractedText.trim().length === 0) {
                    return NextResponse.json({
                        error: 'PDF has no extractable text (might be scanned images only). Try a TXT file instead.',
                        success: false
                    }, { status: 400 });
                }
            } catch (e: any) {
                console.error('PDF parse error:', e);
                return NextResponse.json({
                    error: `PDF parsing failed: ${e.message}. Try a TXT file instead.`,
                    success: false
                }, { status: 400 });
            }
        } else if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
            extractedText = buffer.toString('utf-8');
        } else if (fileName.endsWith('.docx')) {
            return NextResponse.json({
                error: 'DOCX not supported. Please convert to PDF or TXT first.',
                success: false
            }, { status: 400 });
        } else {
            return NextResponse.json({
                error: 'Unsupported file type. Use PDF, TXT, or MD files.',
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
            error: error.message || 'Failed to parse document. Try a TXT file.',
            success: false
        }, { status: 500 });
    }
}
