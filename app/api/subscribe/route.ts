import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, name } = await request.json();

        console.log('New subscriber:', { email, name, timestamp: new Date().toISOString() });

        // OPTION 1: RESEND (Recommended - Easiest Setup)
        // 1. Sign up at https://resend.com (Free: 100 emails/day)
        // 2. Get your API key
        // 3. Add RESEND_API_KEY to .env.local
        // 4. Install: npm install resend

        if (process.env.RESEND_API_KEY) {
            try {
                const resendResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: 'FAMED Test Prep <onboarding@resend.dev>', // Change to your verified domain
                        to: email,
                        subject: '🎉 Your FREE FAMED 8-Week Study Plan is Ready!',
                        html: `
                            <h1>Welcome to FAMED Test Prep, ${name}!</h1>
                            <p>Thank you for downloading our comprehensive 8-week FAMED study plan.</p>
                            <p><strong>Your study plan covers:</strong></p>
                            <ul>
                                <li>All 76 official FAMED cases</li>
                                <li>Day-by-day breakdown</li>
                                <li>Anamnese, Aufklärung, Arzt-Arzt, and Brief strategies</li>
                                <li>Top 10 mistakes to avoid</li>
                            </ul>
                            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://famed-vorbereitung.com'}/2026%20Protokol%20Famed.pdf" style="background-color: #0066CC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Download Your Guide</a></p>
                            <p>Need more help? Check out our <a href="https://famedtestprep.com/blog">blog</a> for expert tips and strategies.</p>
                            <p>Good luck with your preparation!</p>
                            <p>Best regards,<br>FAMED Test Prep Team</p>
                        `,
                    }),
                });

                if (resendResponse.ok) {
                    console.log('✅ Email sent via Resend');
                }
            } catch (error) {
                console.error('Resend error:', error);
            }
        }

        // OPTION 2: MAILCHIMP (Most Popular)
        // 1. Sign up at https://mailchimp.com (Free: 500 contacts)
        // 2. Create an audience/list
        // 3. Get API key from Account > Extras > API keys
        // 4. Add to .env.local: MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID

        if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
            try {
                const datacenter = process.env.MAILCHIMP_API_KEY.split('-')[1];
                const mailchimpResponse = await fetch(
                    `https://${datacenter}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email_address: email,
                            status: 'subscribed',
                            merge_fields: {
                                FNAME: name.split(' ')[0],
                                LNAME: name.split(' ').slice(1).join(' ') || '',
                            },
                            tags: ['Lead Magnet', '8-Week Study Plan'],
                        }),
                    }
                );

                if (mailchimpResponse.ok) {
                    console.log('✅ Contact added to Mailchimp');
                }
            } catch (error) {
                console.error('Mailchimp error:', error);
            }
        }

        // OPTION 3: MAKE.COM / ZAPIER WEBHOOK (No-Code Automation)
        // 1. Create a scenario in Make.com or Zap in Zapier
        // 2. Add Webhook trigger
        // 3. Copy webhook URL
        // 4. Add to .env.local: WEBHOOK_URL

        if (process.env.WEBHOOK_URL) {
            try {
                await fetch(process.env.WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        name,
                        timestamp: new Date().toISOString(),
                        source: 'lead-magnet',
                        product: '8-week-study-plan',
                    }),
                });
                console.log('✅ Webhook triggered');
            } catch (error) {
                console.error('Webhook error:', error);
            }
        }

        // OPTION 4: GOOGLE SHEETS (Simple Tracking)
        // Use Make.com or Zapier to save to Google Sheets

        return NextResponse.json({
            success: true,
            message: 'Thank you for subscribing!'
        });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json({
            error: 'Failed to subscribe. Please try again.'
        }, { status: 500 });
    }
}
