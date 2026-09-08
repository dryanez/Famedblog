import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Fetch campaign logs for this user
        const { data: logs, error } = await supabase
            .from('campaign_logs')
            .select('*')
            .eq('user_id', id)
            .order('sent_at', { ascending: false });

        if (error) {
            console.error('Error fetching campaign logs:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ logs: logs || [] });

    } catch (error: any) {
        console.error('GET handler error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
