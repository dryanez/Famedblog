import { NextResponse } from 'next/server';

// List of campaigns that should run automatically
const AUTOMATED_CAMPAIGNS = [
    'exam_urgency_14d',
    'exam_urgency_special_offer',
    'exam_urgency_7d',
    'exam_urgency_3d',
    'subscription_expiry',
    'welcome_day0'
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

        const results = [];

        // Run each automated campaign
        for (const campaignId of AUTOMATED_CAMPAIGNS) {
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
