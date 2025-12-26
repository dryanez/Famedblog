import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch all campaign automation settings
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('campaign_automation')
            .select('*');

        if (error) {
            // Table might not exist, return empty array with defaults
            console.log('[Campaign Settings] Error fetching settings:', error.message);
            return NextResponse.json({ settings: {} });
        }

        // Convert array to object for easy lookup
        const settings: Record<string, boolean> = {};
        (data || []).forEach((row: any) => {
            settings[row.campaign_id] = row.enabled;
        });

        return NextResponse.json({ settings });
    } catch (error: any) {
        console.error('[Campaign Settings] Error:', error);
        return NextResponse.json({ settings: {} });
    }
}

// POST: Update campaign enabled state
export async function POST(request: Request) {
    try {
        const { campaignId, enabled } = await request.json();

        if (!campaignId) {
            return NextResponse.json({ error: 'campaignId required' }, { status: 400 });
        }

        // Upsert the setting
        const { error } = await supabase
            .from('campaign_automation')
            .upsert({
                campaign_id: campaignId,
                enabled: enabled,
                updated_at: new Date().toISOString()
            }, { onConflict: 'campaign_id' });

        if (error) {
            console.error('[Campaign Settings] Upsert error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, campaignId, enabled });
    } catch (error: any) {
        console.error('[Campaign Settings] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
