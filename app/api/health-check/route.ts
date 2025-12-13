import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const testEmail = searchParams.get('test_email');

    // 1. DB Write Test
    const { error: insertError } = await supabaseAdmin
        .from('leads')
        .insert([{
            email: `healthcheck_admin_${Date.now()}@test.com`,
            first_name: 'SystemCheck_Admin',
            source: 'health_check_endpoint_admin'
        }]);

    // 2. DB Read Test (Count)
    const { count, error: countError } = await supabaseAdmin
        .from('leads')
        .select('*', { count: 'exact', head: true });

    // 3. Email Test (if requested)
    let emailStatus = 'Skipped (add ?test_email=your@email.com)';
    if (testEmail) {
        try {
            const { error } = await resend.emails.send({
                from: 'FaMED Prep <team@famed-vorbereitung.com>', // Match production sender
                to: testEmail,
                subject: 'FaMED System Check: Email Test 🟢',
                html: '<h1>System Check Passed</h1><p>Resend is working correctly.</p>'
            });
            emailStatus = error ? `❌ Failed: ${error.message}` : `✅ Sent to ${testEmail}`;
        } catch (e: any) {
            emailStatus = `❌ Exception: ${e.message}`;
        }
    }

    return NextResponse.json({
        status: 'ok',
        env: {
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Defined' : '❌ MISSING',
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Defined' : '❌ MISSING',
            RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ Defined' : '❌ MISSING',
        },
        database: {
            write: insertError ? `❌ FAILED: ${insertError.message}` : '✅ Success',
            read_count: countError ? `❌ FAILED: ${countError.message}` : count,
        },
        email_test: emailStatus,
        timestamp: new Date().toISOString()
    });
}
