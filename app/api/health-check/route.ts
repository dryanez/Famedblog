
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    // Try to insert a test row to verify DB connection & permissions
    const { data, error: dbError } = await supabaseAdmin
        .from('leads')
        .insert([{
            email: `healthcheck_admin_${Date.now()}@test.com`,
            first_name: 'SystemCheck_Admin',
            source: 'health_check_endpoint_admin'
        }])
        .select();

    return NextResponse.json({
        status: 'ok',
        env: {
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Defined' : '❌ MISSING',
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Defined' : '❌ MISSING',
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
