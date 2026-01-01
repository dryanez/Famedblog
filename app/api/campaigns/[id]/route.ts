import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const campaignName = id === 'holiday_special' ? 'Holiday Special' : `Campaign ${id}`;

        const { data: campaign, error } = await supabase
            .from('campaigns')
            .select('content')
            .eq('name', campaignName)
            .single();

        if (error || !campaign) {
            return NextResponse.json({ content: null }, { status: 404 });
        }

        return NextResponse.json({ content: campaign.content });

    } catch (error: any) {
        console.error('GET handler error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // In Next.js 15+ params is a Promise
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
        }

        // Use supabaseAdmin to bypass RLS
        const { error } = await supabaseAdmin
            .from('campaigns')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Campaign deleted successfully' });

    } catch (error: any) {
        console.error('Delete handler error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // In Next.js 15+ params is a Promise
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { htmlContent } = body;

        console.log('PATCH request for campaign:', id);
        console.log('Content length:', htmlContent?.length);

        if (!id || !htmlContent) {
            console.error('Missing fields - id:', !!id, 'htmlContent:', !!htmlContent);
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }


        // For default campaigns like 'holiday_special', we need to find or create by name
        // since the DB uses UUID for id, not the campaign identifier
        const campaignName = id === 'holiday_special' ? 'Holiday Special' : `Campaign ${id}`;

        // First, try to find an existing campaign with this name
        const { data: existingCampaign } = await supabase
            .from('campaigns')
            .select('id')
            .eq('name', campaignName)
            .single();

        console.log('Existing campaign found:', !!existingCampaign);

        if (existingCampaign) {
            // Update existing campaign
            const { error } = await supabase
                .from('campaigns')
                .update({
                    content: htmlContent,
                    metadata: { lastModified: new Date().toISOString() }
                })
                .eq('id', existingCampaign.id);

            if (error) {
                console.error('Update error:', error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        } else {
            // Create new campaign
            const { error } = await supabase
                .from('campaigns')
                .insert({
                    name: campaignName,
                    content: htmlContent,
                    status: 'draft',
                    target_audience: 'Default',
                    goal: 'Engagement',
                    tone: 'Professional',
                    metadata: { campaignId: id, lastModified: new Date().toISOString() }
                });

            if (error) {
                console.error('Insert error:', error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, message: 'Campaign saved successfully' });

    } catch (error: any) {
        console.error('Update handler error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
