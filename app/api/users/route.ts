import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_date', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ users: data || [] });
    } catch (err) {
        console.error('Server error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
