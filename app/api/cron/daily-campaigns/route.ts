import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processCampaignSend } from '@/lib/campaigns';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// List of campaigns that CAN run automatically
const AUTOMATED_CAMPAIGNS = [
    'exam_urgency_14d',
    'exam_urgency_special_offer',
    'exam_urgency_7d',
    'exam_urgency_3d',
    'subscription_expiry',
    'welcome_day0',
    'welcome_bundle_promo'
];

export async function GET(request: Request) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('[CRON] Starting daily campaign check...');

        // 1. Fetch enabled settings from DB
        const { data: settingsData, error: settingsError } = await supabase
            .from('campaign_automation')
            .select('*');

        if (settingsError) {
            console.error('[CRON] Failed to fetch settings:', settingsError);
            throw settingsError;
        }

        // Convert to map: campaign_id -> enabled
        const enabledSettings: Record<string, boolean> = {};
        (settingsData || []).forEach((row: any) => {
            enabledSettings[row.campaign_id] = row.enabled;
        });

        const results = [];
        let totalSent = 0;

        // 2. Iterate through automated campaigns
        for (const campaignId of AUTOMATED_CAMPAIGNS) {
            // Check if enabled (default to TRUE if not in DB, assuming opt-out model, 
            // OR default to TRUE for standard campaigns as per UI logic which says "enabledCampaigns[id] !== false")
            const isEnabled = enabledSettings[campaignId] !== false;

            if (!isEnabled) {
                console.log(`[CRON] Skipping ${campaignId} (Disabled)`);
                results.push({ campaignId, status: 'disabled' });
                continue;
            }

            console.log(`[CRON] Processing ${campaignId}...`);

            try {
                // Call shared processing logic
                const result = await processCampaignSend({
                    campaignId,
                    force: false // Respect duplication rules!
                });

                results.push({
                    campaignId,
                    status: result.success ? 'sent' : 'skipped/error',
                    count: result.sentCount,
                    error: result.error
                });

                if (result.success) {
                    totalSent += result.sentCount;
                }

            } catch (err: any) {
                console.error(`[CRON] Error processing ${campaignId}:`, err);
                results.push({ campaignId, status: 'error', error: err.message });
            }
        }

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
