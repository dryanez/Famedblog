import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        console.log('[Documents GET] Fetching from uploaded_documents...');

        const { data, error } = await supabase
            .from('uploaded_documents')
            .select('*')
            .order('uploaded_at', { ascending: false });

        if (error) {
            console.error('[Documents GET] Supabase error:', error);
            throw error;
        }

        console.log('[Documents GET] Found documents:', data?.length || 0);

        return NextResponse.json({
            success: true,
            documents: data || []
        });
    } catch (error: any) {
        console.error('[Documents GET] ERROR:', error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { fileName, fileUri, mimeType } = await request.json();

        const { data, error } = await supabase
            .from('uploaded_documents')
            .insert([{
                file_name: fileName,
                file_uri: fileUri,
                mime_type: mimeType || 'application/pdf'
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            document: data
        });
    } catch (error: any) {
        console.error('Save document error:', error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        const { error } = await supabase
            .from('uploaded_documents')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({
            success: true
        });
    } catch (error: any) {
        console.error('Delete document error:', error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}
