import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        const { data: leads, error } = await supabaseAdmin
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching leads:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ leads: leads || [] });
    } catch (error: any) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch leads' }, { status: 500 });
    }
}
