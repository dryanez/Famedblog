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

        console.log('[CRON] Starting daily campaign execution at', new Date().toISOString());

        // Fetch enabled state for all campaigns
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: settingsData } = await supabase
            .from('campaign_automation')
            .select('campaign_id, enabled');

        // Convert to lookup object (default to true if not found)
        const enabledMap: Record<string, boolean> = {};
        (settingsData || []).forEach((row: any) => {
            enabledMap[row.campaign_id] = row.enabled;
        });

        const results = [];

        // Run each automated campaign IF enabled
        for (const campaignId of AUTOMATED_CAMPAIGNS) {
            // Check if enabled (default to true if not in settings table)
            const isEnabled = enabledMap[campaignId] !== false;

            if (!isEnabled) {
                console.log(`[CRON] Skipping disabled campaign: ${campaignId}`);
                results.push({
                    campaignId,
                    success: true,
                    sentCount: 0,
                    message: 'Skipped (disabled)',
                    skipped: true
                });
                continue;
            }

            try {
                console.log(`[CRON] Processing campaign: ${campaignId}`);

                // Call the send API for this campaign
                const sendResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/campaigns/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ campaignId })
                });

                const sendData = await sendResponse.json();

                results.push({
                    campaignId,
                    success: sendResponse.ok,
                    sentCount: sendData.sentCount || 0,
                    message: sendData.message,
                    error: sendResponse.ok ? null : sendData.error
                });

                console.log(`[CRON] ${campaignId}: ${sendData.sentCount || 0} emails sent`);

            } catch (error: any) {
                console.error(`[CRON] Error processing ${campaignId}:`, error);
                results.push({
                    campaignId,
                    success: false,
                    sentCount: 0,
                    error: error.message
                });
            }
        }

        const totalSent = results.reduce((sum, r) => sum + r.sentCount, 0);

        console.log(`[CRON] Daily execution complete. Total emails sent: ${totalSent}`);

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            totalSent,
            results
        });

    } catch (error: any) {
        console.error('[CRON] Fatal error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
