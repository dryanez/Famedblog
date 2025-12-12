import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    // Try to insert a test row to verify DB connection & permissions
    const { data, error: dbError } = await supabase
        .from('leads')
        .insert([{
            email: `healthcheck_${Date.now()}@test.com`,
            first_name: 'SystemCheck',
            source: 'health_check_endpoint'
        }])
        .select();

    return NextResponse.json({
        status: 'ok',
        env: {
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Defined' : '❌ MISSING',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Defined' : '❌ MISSING',
            RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ Defined' : '❌ MISSING',
        },
        database: {
            status: dbError ? '❌ FAILED' : '✅ CONNECTED',
            message: dbError ? dbError.message : 'Write successful',
            code: dbError ? dbError.code : '200'
        },
        timestamp: new Date().toISOString()
    });
}
