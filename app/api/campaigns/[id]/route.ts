import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // In Next.js 15+ params is a Promise
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Campaign deleted successfully' });

    } catch (error: any) {
        console.error('Delete handler error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // In Next.js 15+ params is a Promise
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { htmlContent } = body;

        if (!id || !htmlContent) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { error } = await supabase
            .from('campaigns')
            .update({ content: htmlContent })
            .eq('id', id);

        if (error) {
            console.error('Update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Campaign updated successfully' });

    } catch (error: any) {
        console.error('Update handler error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
