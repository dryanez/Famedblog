import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// List of campaigns that CAN run automatically (if enabled)
const AUTOMATED_CAMPAIGNS = [
    'exam_urgency_14d',
    'exam_urgency_special_offer',
    'exam_urgency_7d',
    'exam_urgency_3d',
    'subscription_expiry',
    'welcome_day0',
    'holiday_special'
];

export async function GET(request: Request) {
    try {
        // Verify this is a legitimate cron request
        const authHeader = request.headers.get('authorization');

        // Vercel Cron sends a special authorization header
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('[CRON] Daily campaigns are currently DISABLED');

        // AUTOMATED CAMPAIGNS DISABLED - Return early
        // This prevents exam urgency emails from being sent automatically
        // To re-enable, comment out this return statement
        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            totalSent: 0,
            message: 'Automated campaigns disabled',
            results: []
        });

        // Below code is unreachable while disabled
        // Uncomment the return above to re-enable automated campaigns

    } catch (error: any) {
        console.error('[CRON] Fatal error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
