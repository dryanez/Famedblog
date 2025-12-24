import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error('RESEND_WEBHOOK_SECRET is not set');
        return new Response('Webhook secret not configured', { status: 500 });
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: any;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as any;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        });
    }

    // Handle the webhooks
    const eventType = evt.type;
    console.log(`Webhook received: ${eventType}`);

    if (eventType === 'email.opened' || eventType === 'email.clicked' || eventType === 'email.delivered') {
        const { email_id } = evt.data;
        let status = 'sent';
        if (eventType === 'email.opened') status = 'opened';
        else if (eventType === 'email.clicked') status = 'clicked';
        else if (eventType === 'email.delivered') status = 'delivered';

        // Update the log in our database
        const { error } = await supabase
            .from('campaign_logs')
            .update({ status })
            .eq('resend_email_id', email_id);

        if (error) {
            console.error('Failed to update campaign log:', error);
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
    }

    return NextResponse.json({ success: true });
}
