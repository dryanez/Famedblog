import { NextResponse } from 'next/server';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { writeFile, unlink } from 'fs/promises';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

        console.log('[PDF Upload] Uploading to Gemini File API...');
        const uploadResult = await fileManager.uploadFile(tempFilePath, {
            mimeType: 'application/pdf',
            displayName: file.name,
        });

        console.log('[PDF Upload] Gemini upload successful:', uploadResult.file.uri);

        // Save to database DIRECTLY (not via fetch)
        console.log('[PDF Upload] Saving to Supabase uploaded_documents table...');
        const { data: docData, error: docError } = await supabase
            .from('uploaded_documents')
            .insert([{
                file_name: file.name,
                file_uri: uploadResult.file.uri,
                mime_type: uploadResult.file.mimeType || 'application/pdf'
            }])
            .select()
            .single();

        if (docError) {
            console.error('[PDF Upload] Supabase save FAILED:', docError);
        } else {
            console.log('[PDF Upload] Supabase save SUCCESS:', docData);
        }

        // Clean up temp file
        await unlink(tempFilePath);
        tempFilePath = null;

        return NextResponse.json({
            success: true,
            fileName: file.name,
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
            savedToLibrary: !docError
        });

    } catch (error: any) {
        console.error('[PDF Upload] ERROR:', error);

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
