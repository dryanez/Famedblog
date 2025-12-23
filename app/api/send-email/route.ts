import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getEmailTemplate } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { emails, segment } = await request.json();

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return NextResponse.json({ error: "No emails provided" }, { status: 400 });
        }

        // For this demo, we will simulate sending for "safety" unless a special flag is passed?
        // Or we just send them one by one. Resend has a rate limit.
        // For mass sending, batch is better.
        // Let's increment.

        // LIMITATION: Free tier is 100 emails/day.
        // If user has 150 emails, this might fail.
        // We should warn about this.

        let sentCount = 0;
        const failed = [];

        // Batch in groups of 10 to avoid hitting rate limits instantly?
        // Resend batch endpoint accepts up to 100 emails at once.

        // Construct the batch payload
        // We need the Name for each email to personalize.
        // The dashboard only sent emails list.
        // Let's update Dashboard to send { email, name } objects.
        // For now, if we only have email, we default name.

        // Actually, let's just send a generic email if we don't pass names, 
        // BUT the template uses name.
        // I will update the Dashboard to send `recipients: { email, name }[]`.

        // Assuming we update dashboard, let's handle the request assuming it sends objects.
        // If it sends strings, handle that too.

        // Let's pretend we receive { recipients: { email: string, name: string }[] }
        // BUT Dashboard.tsx currently sends: `emails: recipients.map(u => u.Email)`

        // I will FIX Dashboard.tsx in the next step to send full objects.
        // For now, let's write this to expect objects or fallback.

        // Temporarily, if we receive just emails, use "Doctor".

        const recipients = (typeof emails[0] === 'string')
            ? emails.map((e: string) => ({ email: e, name: "Doctor" }))
            : emails;

        // Use Resend Batch
        // resend.batch.send calls: https://resend.com/docs/api-reference/emails/batch-send

        const batchPayload = recipients.map((r: any) => ({
            from: 'FaMED-Vorbereitung <team@famed-vorbereitung.com>', // MUST confirm this sender
            to: r.email,
            subject: segment === 'exam_soon' ? 'Final Push for your Exam 🚀' : '50% Off FaMED Xmas Special 🎄',
            html: getEmailTemplate(segment, r.name)
        }));

        // Chunk into 50s
        const chunkSize = 50;
        for (let i = 0; i < batchPayload.length; i += chunkSize) {
            const chunk = batchPayload.slice(i, i + chunkSize);
            try {
                const { data, error } = await resend.batch.send(chunk);
                if (error) {
                    console.error("Batch error", error);
                    failed.push(...chunk.map((c: any) => c.to));
                } else {
                    sentCount += chunk.length;
                }
            } catch (e) {
                console.error("Batch exception", e);
                failed.push(...chunk.map((c: any) => c.to));
            }
        }

        return NextResponse.json({ success: true, count: sentCount, failed });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
