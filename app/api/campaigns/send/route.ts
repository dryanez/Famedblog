import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
    getExamUrgency14Days,
    getExamUrgency7Days,
    getExamUrgency3Days,
    getWelcomeDay0,
    getSubscriptionExpiry,
    getExamUrgencySpecialOffer,
    getTextExamUrgency14Days,
    getTextExamUrgency7Days,
    getTextExamUrgency3Days,
    getTextWelcomeDay0,
    getTextSubscriptionExpiry,
    getTextExamUrgencySpecialOffer,
    getHolidaySpecial,
    getTextHolidaySpecial
} from '@/lib/campaign-templates';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { campaignId, testEmail } = await request.json();

        // Fetch all users
        const { data: users, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
        }

        const now = new Date();
        let targetUsers: any[] = [];

        let emailTemplate: (params: any) => string;
        let textTemplate: (params: any) => string;
        let subjectLine = '';

        if (testEmail) {
            targetUsers = [{
                id: null,
                email: testEmail,
                full_name: 'Test Recipient',
                exam_date: now.toISOString(), // Sample data
                account_type: 'free',
                created_date: now.toISOString()
            }];
            emailTemplate = campaignId === 'subscription_expiry' ? getSubscriptionExpiry : getExamUrgency14Days; // Default template for test
            // Try to find if campaignId matches a default template
            const found = [
                { id: 'exam_urgency_14d', t: getExamUrgency14Days, tt: getTextExamUrgency14Days, s: '⚠️ Test: Exam in 14 Days' },
                { id: 'exam_urgency_special_offer', t: getExamUrgencySpecialOffer, tt: getTextExamUrgencySpecialOffer, s: '🔥 Test: Special Offer ($19.99)' },
                { id: 'exam_urgency_7d', t: getExamUrgency7Days, tt: getTextExamUrgency7Days, s: '🚨 Test: Exam in 7 Days' },
                { id: 'exam_urgency_3d', t: getExamUrgency3Days, tt: getTextExamUrgency3Days, s: '⏰ Test: 72 Hours Until Exam' },
                { id: 'welcome_day0', t: getWelcomeDay0, tt: getTextWelcomeDay0, s: '👋 Test: Welcome to FaMED' },
                { id: 'subscription_expiry', t: getSubscriptionExpiry, tt: getTextSubscriptionExpiry, s: '🔔 Test: Subscription Expiry' },
                { id: 'holiday_special', t: getHolidaySpecial, tt: getTextHolidaySpecial, s: '🎄 Test: Holiday Special' },
            ].find(t => t.id === campaignId);

            if (found) {
                emailTemplate = found.t;
                textTemplate = found.tt;
                subjectLine = found.s;
            } else {
                // It's likely a custom campaign
                subjectLine = `Test: Action Required - ${campaignId}`;
                textTemplate = (data) => `This is a test email for campaign ${campaignId}.`;
                // We will fetch the custom campaign content later in the loop if needed
                // But current loop uses emailTemplate(params)
            }
        } else {
            // Filter users based on campaign type
            switch (campaignId) {
                case 'exam_urgency_14d':
                    targetUsers = users.filter(u => {
                        if (!u.exam_date || u.account_type !== 'free') return false;
                        const examDate = new Date(u.exam_date);
                        const daysUntil = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                        return daysUntil >= 12 && daysUntil <= 16;
                    });
                    emailTemplate = getExamUrgency14Days;
                    textTemplate = getTextExamUrgency14Days;
                    subjectLine = '⚠️ Your Exam is in 14 Days!';
                    break;

                case 'exam_urgency_special_offer':
                    targetUsers = users.filter(u => {
                        if (!u.exam_date || u.account_type !== 'free') return false;
                        const examDate = new Date(u.exam_date);
                        const daysUntil = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                        return daysUntil >= 7 && daysUntil <= 15; // 1-2 weeks
                    });
                    emailTemplate = getExamUrgencySpecialOffer;
                    textTemplate = getTextExamUrgencySpecialOffer;
                    subjectLine = '🔥 Special Offer: Last Minute Rescue Pack (€19.99)';
                    break;

                case 'exam_urgency_7d':
                    targetUsers = users.filter(u => {
                        if (!u.exam_date || u.account_type !== 'free') return false;
                        const examDate = new Date(u.exam_date);
                        const daysUntil = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                        return daysUntil >= 6 && daysUntil <= 8;
                    });
                    emailTemplate = getExamUrgency7Days;
                    textTemplate = getTextExamUrgency7Days;
                    subjectLine = '🚨 Final Week! Your Exam is This Week';
                    break;

                case 'exam_urgency_3d':
                    targetUsers = users.filter(u => {
                        if (!u.exam_date || u.account_type !== 'free') return false;
                        const examDate = new Date(u.exam_date);
                        const daysUntil = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                        return daysUntil >= 2 && daysUntil <= 4;
                    });
                    emailTemplate = getExamUrgency3Days;
                    textTemplate = getTextExamUrgency3Days;
                    subjectLine = '⏰ 72 Hours Until Your FaMED Exam';
                    break;

                case 'welcome_day0':
                    // For demo: send to users created in last 7 days
                    targetUsers = users.filter(u => {
                        const createdDate = new Date(u.created_date);
                        const daysSinceSignup = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
                        return daysSinceSignup <= 7;
                    });
                    emailTemplate = getWelcomeDay0;
                    textTemplate = getTextWelcomeDay0;
                    subjectLine = '👋 Welcome to FaMED Prep!';
                    break;

                case 'subscription_expiry':
                    targetUsers = users.filter(u => {
                        if (!u.plan_expiry || !u.account_type?.startsWith('paid')) return false;
                        const expiryDate = new Date(u.plan_expiry);
                        const daysUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                        return daysUntilExpiry >= 6 && daysUntilExpiry <= 8;
                    });
                    emailTemplate = getSubscriptionExpiry;
                    textTemplate = getTextSubscriptionExpiry;
                    subjectLine = '🔔 Your Premium Access Expires Soon';
                    break;

                case 'no_exam_set':
                    targetUsers = users.filter(u => !u.exam_date && u.account_type === 'free');
                    emailTemplate = getWelcomeDay0; // Reusing welcome for now
                    textTemplate = getTextWelcomeDay0;
                    subjectLine = '📅 Set Your Exam Date & Get a Personalized Study Plan';
                    break;

                case 'holiday_special':
                    // Check if there is a custom override in the database
                    const { data: holidayOverride } = await supabase
                        .from('campaigns')
                        .select('content')
                        .eq('name', 'Holiday Special')
                        .single();

                    // Target all free users (not paid)
                    targetUsers = users.filter(u => !u.account_type?.startsWith('paid'));

                    if (holidayOverride?.content) {
                        emailTemplate = () => holidayOverride.content;
                    } else {
                        emailTemplate = getHolidaySpecial;
                    }

                    textTemplate = getTextHolidaySpecial; // We only allow editing HTML for now
                    subjectLine = '🎄 Holiday Special: 50% Off + Free Book! 🎁';
                    break;

                default:
                    // Check if it's a custom campaign in Supabase
                    const { data: customCampaign } = await supabase
                        .from('campaigns')
                        .select('*')
                        .eq('id', campaignId)
                        .single();

                    if (customCampaign) {
                        targetUsers = users; // Fallback to all users if no criteria, but usually we handle criteria in metadata
                        subjectLine = `Update: ${customCampaign.name}`;
                        emailTemplate = () => customCampaign.content;
                        textTemplate = (data) => `Please enable HTML to view this email.`; // Fallback for custom
                    } else {
                        return NextResponse.json({ error: 'Invalid campaign ID or campaign not found' }, { status: 400 });
                    }
            }
        }

        // **DEDUPLICATION: Fetch users who already received this campaign**
        if (!testEmail) { // Skip deduplication for test emails
            const { data: existingLogs, error: logError } = await supabase
                .from('campaign_logs')
                .select('user_id, user_email')
                .eq('campaign_id', campaignId);

            if (logError) {
                console.error('Error fetching campaign logs for deduplication:', logError);
            } else if (existingLogs && existingLogs.length > 0) {
                // Create a Set of user IDs and emails who already received this campaign
                const sentUserIds = new Set(existingLogs.map(log => log.user_id).filter(Boolean));
                const sentEmails = new Set(existingLogs.map(log => log.user_email));

                const beforeCount = targetUsers.length;

                // Filter out users who already received this campaign
                targetUsers = targetUsers.filter(user => {
                    // Check both user ID and email to handle cases where user_id might be null
                    const alreadySent = sentUserIds.has(user.id) || sentEmails.has(user.email);
                    return !alreadySent;
                });

                const dedupedCount = beforeCount - targetUsers.length;
                if (dedupedCount > 0) {
                    console.log(`[DEDUPLICATION] Filtered out ${dedupedCount} users who already received campaign ${campaignId}`);
                }
            }
        }

        if (targetUsers.length === 0) {
            return NextResponse.json({
                success: true,
                sentCount: 0,
                message: testEmail
                    ? 'No users match the campaign criteria'
                    : 'No new users to send to - all eligible users have already received this campaign'
            });
        }

        // Prepare emails for all eligible users
        const emailsToSend = targetUsers.map(user => {
            const daysUntilExam = user.exam_date
                ? Math.ceil((new Date(user.exam_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                : undefined;

            // Function to replace placeholders in stored content
            const replacePlaceholders = (content: string, data: any) => {
                let text = content;
                const replacements: Record<string, string | undefined> = {
                    '{{userName}}': data.userName,
                    '{{userEmail}}': data.userEmail,
                    '{{examDate}}': data.examDate ? new Date(data.examDate).toLocaleDateString('de-DE') : '',
                    '{{daysUntilExam}}': data.daysUntilExam?.toString(),
                    '{{planExpiry}}': data.planExpiry ? new Date(data.planExpiry).toLocaleDateString('de-DE') : '',
                    '{{accountType}}': data.accountType
                };

                Object.entries(replacements).forEach(([key, value]) => {
                    text = text.replace(new RegExp(key, 'g'), value || '');
                });
                return text;
            };

            const templateData = {
                userName: user.full_name || 'there',
                userEmail: user.email,
                examDate: user.exam_date,
                daysUntilExam,
                planExpiry: user.plan_expiry,
                accountType: user.account_type
            };

            // Generate HTML content (handling both function and string templates)
            let htmlContent = '';
            // Check if emailTemplate is a function that returns a string (standard templates)
            // OR if it wraps a stored string (custom campaigns)
            try {
                const result = emailTemplate(templateData);
                // If the result contains placeholders, replace them (for custom saved campaigns)
                htmlContent = replacePlaceholders(result, templateData);
            } catch (e) {
                // Should not happen, but safe fallback
                console.error('Template generation error', e);
                htmlContent = '<div>Error generating email content</div>';
            }

            const textContent = textTemplate({
                userName: user.full_name || 'there',
                userEmail: user.email,
                examDate: user.exam_date,
                daysUntilExam,
                planExpiry: user.plan_expiry,
                accountType: user.account_type
            });

            return {
                from: 'FaMED Prep <noreply@famed-vorbereitung.com>',
                to: user.email,
                reply_to: 'support@famed-vorbereitung.com',
                subject: subjectLine,
                html: htmlContent,
                text: textContent,
                headers: {
                    'X-Entity-Ref-ID': campaignId,
                    'List-Unsubscribe': '<mailto:unsubscribe@famed-vorbereitung.com>'
                },
                // Disable tracking to improve deliverability
                open_tracking: false,
                click_tracking: false
            };
        });

        // Send emails using Resend batch API
        const { data: sendResult, error: sendError } = await resend.batch.send(emailsToSend);

        if (sendError) {
            console.error('Resend error:', sendError);
            return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
        }

        // Log sent emails to database
        const logs = emailsToSend.map((email, index) => {
            // We don't have the exact Resend ID for each email in batch unless we map the response
            // Resend batch response returns an array of data/ids
            const resendId = sendResult?.data?.[index]?.id;
            // Find the user correctly. 'emailsToSend' was mapped from 'targetUsers.slice'
            // So the index matches 'targetUsers' (the sliced version)
            const user = targetUsers[index]; // Note: targetUsers was not sliced in the variable, but used in map
            // Wait, emailsToSend = targetUsers.slice(0, 50).map... so indices 0-49 of targetUsers correspond.

            return {
                campaign_id: campaignId,
                user_email: email.to,
                user_id: user.id || null, // null for test emails
                status: 'sent',
                resend_email_id: resendId,
                metadata: {
                    subject: email.subject,
                    sent_at: new Date().toISOString(),
                    is_test: !!testEmail
                }
            };
        });

        const { error: logError } = await supabase
            .from('campaign_logs')
            .insert(logs);

        if (logError) {
            console.error('Failed to log campaign sends:', logError);
            // We don't fail the request since emails were sent
        }

        return NextResponse.json({
            success: true,
            sentCount: emailsToSend.length,
            totalEligible: targetUsers.length,
            message: `Successfully sent ${emailsToSend.length} emails`,
            recipients: targetUsers.map(u => ({
                email: u.email,
                name: u.full_name,
                accountType: u.account_type
            }))
        });

    } catch (error: any) {
        console.error('Campaign send error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 });
    }
}
