'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitLead(formData: FormData) {
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string || 'Doctor';
    const examDate = formData.get('examDate') as string;
    const germanLevel = formData.get('germanLevel') as string;

    // --- DEBUG LOGGING START ---
    console.log('--- Lead Submission Debug ---');
    console.log('1. Checking Environment Variables:');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Defined' : '❌ MISSING');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Defined' : '❌ MISSING');
    console.log('   - RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Defined' : '❌ MISSING');
    console.log('2. Submission Data:', { email, firstName, examDate, germanLevel });
    // --- DEBUG LOGGING END ---

    if (!email || !examDate || !germanLevel) {
        return { success: false, message: 'Email, exam date, and German level are required' };
    }

    try {
        // 1. Save to leads table (keeping original structure)
        let isExistingLead = false;
        const { error: dbError } = await supabaseAdmin
            .from('leads')
            .insert([
                {
                    email,
                    first_name: firstName,
                    exam_date: examDate,
                    german_level: germanLevel,
                    source: 'website_lead_magnet'
                }
            ]);

        if (dbError) {
            // If error is unique constraint (email already exists), still send the email
            if (dbError.code === '23505') {
                console.log('✉️  Email already exists in leads table - sending guide anyway to:', email);
                isExistingLead = true;
            } else {
                console.error('❌ Supabase insert error:', dbError);
                // Don't fail completely - still try to send email
                isExistingLead = false;
            }
        } else {
            console.log('✅ New lead saved to leads table:', email);
        }

        // 2. Send Email via Resend
        if (process.env.RESEND_API_KEY) {
            console.log('📧 Attempting to send email via Resend to:', email);

            const { error: emailError } = await resend.emails.send({
                from: 'FaMED-Vorbereitung <team@famed-vorbereitung.com>',
                to: email,
                subject: 'Your 8-Week FaMED Study Plan 📚',
                headers: {
                    'List-Unsubscribe': '<mailto:team@famed-vorbereitung.com?subject=unsubscribe>',
                    'Reply-To': 'team@famed-vorbereitung.com',
                    'X-Entity-Ref-ID': `lead-${email}`
                },
                html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your FaMED Study Plan</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f9fc; color: #333333;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #2563eb;">
                <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED-Vorbereitung" style="height: 50px; width: auto; max-width: 100%;">
            </td>
        </tr>

        <!-- Main Content -->
        <tr>
            <td style="padding: 40px;">
                <h2 style="color: #1f2937; margin-top: 0;">Hi ${firstName}!</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Here is the <strong>8-Week FaMED Study Plan</strong> you requested. This roadmap has helped hundreds of doctors pass their exam, and we're excited for it to help you too!
                </p>
                
                <!-- Primary Action: Download Button -->
                <div style="margin: 30px 0; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://famed-vorbereitung.com'}/2026%20Protokol%20Famed.pdf" 
                       style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                       Download Study Plan (PDF) →
                    </a>
                    <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">(Right click and 'Save As' if the link opens in browser)</p>
                </div>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                <!-- Community Section -->
                <h3 style="color: #1f2937; margin-bottom: 15px;">🚀 Join the Community</h3>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Don't study alone! Join our private Telegram group with 500+ other doctors preparing for the FaMED exam. Share cases, ask questions, and get support.
                </p>
                <div style="margin-top: 20px; text-align: left;">
                    <a href="https://t.me/+vgtsHuqtwfk4MTJh" 
                       style="color: #0891b2; text-decoration: none; font-weight: bold; font-size: 16px;">
                       Join Telegram Group →
                    </a>
                </div>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                <!-- Upsell Section: The Book -->
                <div style="background-color: #f0f9ff; border-radius: 8px; padding: 25px; border: 1px solid #bae6fd;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="width: 35%; vertical-align: top; padding-right: 20px;">
                                <img src="https://famed-vorbereitung.com/book%20mockup%20website%20german%20(1).png" 
                                     alt="FaMED Protokoll Book" 
                                     style="width: 100%; max-width: 180px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
                            </td>
                            <td style="width: 65%; vertical-align: top;">
                                <h3 style="color: #0369a1; margin-top: 0; margin-bottom: 12px;">Want the Complete Package?</h3>
                                <p style="font-size: 15px; line-height: 1.5; color: #334155; margin-bottom: 12px;">
                                    The Study Plan tells you <em>when</em> to study. The <strong>FaMED Protokoll Book</strong> tells you <em>what</em> to study.
                                </p>
                                <ul style="padding-left: 20px; color: #475569; font-size: 14px; margin: 12px 0;">
                                    <li style="margin-bottom: 5px;">All 76 Official Cases covered</li>
                                    <li style="margin-bottom: 5px;">Perfect Communication Scripts</li>
                                    <li style="margin-bottom: 5px;">Examination Frameworks</li>
                                </ul>
                                <div style="margin-top: 16px;">
                                    <a href="https://famed-vorbereitung.com/book" 
                                       style="background-color: #0284c7; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; display: inline-block;">
                                       Get the Book (€19.99) →
                                    </a>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <p style="margin-top: 30px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Viel Erfolg,<br>
                    <strong>The FaMED-Vorbereitung Team</strong>
                </p>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f3f4f6; font-size: 12px; color: #6b7280;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} FaMED-Vorbereitung. All rights reserved.</p>
                <p style="margin: 5px 0;">You received this email because you signed up for our study resources.</p>
            </td>
        </tr>
    </table>
</body>
</html>
                `,
            });

            if (emailError) {
                console.error('❌ Resend error:', emailError);
                // For existing leads, we don't fail - they already got it before
                if (isExistingLead) {
                    return {
                        success: true,
                        message: 'You\'ve already signed up! Check your email (including spam) for the study plan.'
                    };
                }
                // For new leads with email failure, inform them
                return {
                    success: false,
                    message: 'Signed up, but email sending failed. Please contact support@famed-vorbereitung.com'
                };
            }

            console.log('✅ Email sent successfully to:', email);
        } else {
            console.warn('⚠️  RESEND_API_KEY is missing. Email not sent.');
            return {
                success: false,
                message: 'Email service not configured. Please contact support.'
            };
        }

        return {
            success: true,
            message: isExistingLead
                ? 'You\'ve already signed up! Check your email for the study plan.'
                : 'Success! Check your email for the study plan.'
        };

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        return { success: false, message: 'Something went wrong.' };
    }
}
