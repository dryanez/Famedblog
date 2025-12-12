'use server';

import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitLead(formData: FormData) {
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string || 'Doctor'; // Default if not provided

    if (!email) {
        return { success: false, message: 'Email is required' };
    }

    try {
        // 1. Save to Supabase
        const { error: dbError } = await supabase
            .from('leads')
            .insert([
                {
                    email,
                    first_name: firstName,
                    source: 'website_lead_magnet'
                }
            ]);

        if (dbError) {
            // If error is unique constraint (already requested), we still send the email but don't fail
            if (dbError.code === '23505') {
                console.log('Email already exists in leads, sending guide anyway.');
            } else {
                console.error('Supabase error:', dbError);
                return { success: false, message: 'Failed to save lead. Please try again.' };
            }
        }

        // 2. Send Email via Resend
        if (process.env.RESEND_API_KEY) {
            const { error: emailError } = await resend.emails.send({
                from: 'FaMED Prep <team@famed-vorbereitung.com>', // Update with verify domain if needed, or use 'onboarding@resend.dev' for testing
                to: email,
                subject: 'Your 8-Week FaMED Study Plan 📚',
                html: `
          <h1>Hi ${firstName}!</h1>
          <p>Here is the 8-Week FaMED Study Plan you requested.</p>
          <p>This roadmap has helped hundreds of doctors pass their exam. We hope it helps you too!</p>
          <p><strong><a href="https://famed-vorbereitung.com/FAMED_8WEEK_CORRECTED_STUDY_PLAN.md">Click here to download the Study Plan</a></strong></p>
          <p>(Note: The link above connects to our latest version. Right click and 'Save As' if needed)</p>
          <br/>
          <p>Veil Erfolg,<br/>The FaMED Prep Team</p>
        `,
                // attachments: [ ... ] // Can add attachment if we have the file path or buffer
            });

            if (emailError) {
                console.error('Resend error:', emailError);
                // We don't fail the request if email fails, but we log it. 
                // In a real app we might want to tell the user.
                return { success: true, message: 'Signed up, but email sending failed. Please contact support.' };
            }
        } else {
            console.warn('RESEND_API_KEY is missing. Email not sent.');
        }

        return { success: true, message: 'Success! Check your email for the study plan.' };

    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, message: 'Something went wrong.' };
    }
}
