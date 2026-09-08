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

        // emails is now an array of { email, name, examDate?, daysUntilExam? }
        let sentCount = 0;
        const failed = [];

        const batchPayload = emails.map((recipient: any) => {
            const { email, name, examDate, daysUntilExam } = recipient;

            // Determine subject based on segment and urgency
            let subject = '50% Off FaMED Xmas Special 🎄';
            if (segment === 'exam_soon') {
                if (daysUntilExam !== null && daysUntilExam !== undefined && daysUntilExam <= 14) {
                    const firstName = name?.split(" ")[0] || "there";
                    subject = `🔔 Your Test is Around the Corner, ${firstName}!`;
                } else {
                    subject = 'Final Push for your Exam 🚀';
                }
            }

            return {
                from: 'FaMED-Vorbereitung <team@famed-vorbereitung.com>',
                to: email,
                subject,
                html: getEmailTemplate({
                    segment,
                    name: name || "Doctor",
                    examDate: examDate || null,
                    daysUntilExam: daysUntilExam ?? null
                })
            };
        });

        // Chunk into 50s to avoid rate limits
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
