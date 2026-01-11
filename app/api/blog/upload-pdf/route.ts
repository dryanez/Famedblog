import { NextResponse } from 'next/server';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export const maxDuration = 60;

export async function POST(request: Request) {
    let tempFilePath: string | null = null;

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const fileName = file.name.toLowerCase();

        if (!fileName.endsWith('.pdf')) {
            return NextResponse.json({
                error: 'Only PDF files are supported for AI analysis'
            }, { status: 400 });
        }

        // Save file temporarily
        const buffer = Buffer.from(await file.arrayBuffer());
        tempFilePath = path.join('/tmp', `upload-${Date.now()}.pdf`);
        await writeFile(tempFilePath, buffer);

        // Upload to Gemini File API using GoogleAIFileManager
        const fileManager = new GoogleAIFileManager(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

        console.log('Uploading to Gemini File API...');
        const uploadResult = await fileManager.uploadFile(tempFilePath, {
            mimeType: 'application/pdf',
            displayName: file.name,
        });

        console.log('Upload successful:', uploadResult.file.uri);

        // Clean up temp file
        await unlink(tempFilePath);
        tempFilePath = null;

        return NextResponse.json({
            success: true,
            fileName: file.name,
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
        });

    } catch (error: any) {
        console.error('PDF upload error:', error);

        // Clean up temp file on error
        if (tempFilePath) {
            try {
                await unlink(tempFilePath);
            } catch (e) {
                // Ignore cleanup errors
            }
        }

        return NextResponse.json({
            error: error.message || 'Failed to upload PDF',
            success: false
        }, { status: 500 });
    }
}
