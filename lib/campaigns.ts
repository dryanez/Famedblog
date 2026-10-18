import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
    getExamUrgency3Days,
    getWelcomeDay0,
    getSubscriptionExpiry,
    getExamUrgencySpecialOffer,
    getTextExamUrgency3Days,
    getTextWelcomeDay0,
    getTextSubscriptionExpiry,
    getTextExamUrgencySpecialOffer,
    getHolidaySpecial,
    getTextHolidaySpecial,
    getNewYearSpecial,
    getTextNewYearSpecial,
    getExamUrgency1WeekSpecial,
    getTextExamUrgency1WeekSpecial,
    getSiteBackOnline,
    getTextSiteBackOnline
} from '@/lib/campaign-templates';
import {
    getWelcomeBundlePromo, getTextWelcomeBundlePromo,
    getExamUrgency14Days, getTextExamUrgency14Days,
    getExamUrgency7Days, getTextExamUrgency7Days,
    getAccountBookOffer, getTextAccountBookOffer,
    getAccountMissingOut, getTextAccountMissingOut,
    getAccountWeeklyBundle, getTextAccountWeeklyBundle,
    getLeadAppOffer, getTextLeadAppOffer
} from '@/lib/campaign-templates-v3';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendCampaignOptions {
    campaignId: string;
    testEmail?: string;
    userIds?: string[];
    emails?: string[];
    specificUserId?: string;
    force?: boolean;
}

interface SendCampaignResult {
    success: boolean;
    sentCount: number;
    recipients?: any[];
    error?: string;
    debug?: any;
    data?: any;
}

// Helper function to get campaign content - checks DB first, then falls back to template
async function getCampaignContent(campaignId: string, templateFn: (data: any) => string, data: any): Promise<string> {
    // Campaign name mapping
    const campaignNameMap: Record<string, string> = {
        'holiday_special': 'Holiday Special',
        'new_year_special': 'New Year Special',
        'exam_urgency_special_offer': 'Exam Urgency Special Offer',
        'exam_urgency_1_week_special': '1 Week Special Offer',
        'site_back_online': 'Site Back Online',
        'welcome_bundle_promo': 'Welcome Bundle Promo',
        'exam_urgency_14d': 'Exam in 14 Days',
        'exam_urgency_7d': 'Exam in 7 Days',
        'exam_urgency_3d': 'Exam in 3 Days',
        'welcome_day0': 'Welcome Email',
        'subscription_expiry': 'Subscription Expiry'
    };

    const campaignName = campaignNameMap[campaignId];

    // Try to load saved content from database
    if (campaignName) {
        try {
            const { data: campaign } = await supabase
                .from('campaigns')
                .select('content')
                .eq('name', campaignName)
                .single();

            if (campaign?.content) {
                let content = campaign.content;
                Object.keys(data).forEach(key => {
                    const templateLiteralPattern = new RegExp(`\\$\\{data\\.${key}\\}`, 'g');
                    content = content.replace(templateLiteralPattern, String(data[key] || ''));
                    const customPlaceholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                    content = content.replace(customPlaceholder, String(data[key] || ''));
                });
                return content;
            }
        } catch (error) {
            console.log(`No saved content for ${campaignId}, using template`);
        }
    }

    return templateFn(data);
}

export async function processCampaignSend(options: SendCampaignOptions): Promise<SendCampaignResult> {
    const { campaignId, testEmail, userIds, emails, specificUserId, force } = options;
    console.log('🔍 Processing campaign send:', { campaignId, testEmail, hasUserIds: !!userIds, hasEmails: !!emails, specificUserId, force });

    let users: any[] = [];
    let targetUsers: any[] = [];
    let emailTemplate: (params: any) => string;
    let textTemplate: (params: any) => string;
    let subjectLine = '';

    // Strategy based on inputs
    if (specificUserId) {
        // Single user mode (often for resending/testing internally)
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', specificUserId)
            .single();

        if (error || !data) {
            return { success: false, sentCount: 0, error: 'User not found' };
        }

        // Check if already sent (unless force is true)
        if (!force) {
            const { data: sentRec } = await supabase
                .from('campaign_sends')
                .select('id')
                .eq('campaign_id', campaignId)
                .eq('user_id', specificUserId)
                .single();

            if (sentRec) {
                return { success: false, sentCount: 0, error: 'Campaign already sent to this user. Use force=true to resend.' };
            }
        }

        users = [data];
        targetUsers = users;

        // Determine template
        const templateInfo = getTemplateForCampaign(campaignId);
        if (!templateInfo) return { success: false, sentCount: 0, error: `Unknown campaign ID: ${campaignId}` };

        emailTemplate = templateInfo.emailTemplate;
        textTemplate = templateInfo.textTemplate;
        subjectLine = templateInfo.subjectLine;

    } else if (userIds && Array.isArray(userIds) && userIds.length > 0) {
        // Specific List of User IDs
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .in('id', userIds);

        if (error) return { success: false, sentCount: 0, error: 'Failed to fetch users' };
        users = data || [];

        // For manual selection, we usually target those users specifically
        targetUsers = users;
        // Setup templates
        const templateInfo = getTemplateForCampaign(campaignId);
        // Fallback for custom campaigns logic if templateInfo is null logic handled later?
        // Actually the original code had complex logic inside the 'else'.
        // Let's simplify: if it triggers a standard campaign, use standard logic.
        if (templateInfo) {
            emailTemplate = templateInfo.emailTemplate;
            textTemplate = templateInfo.textTemplate;
            subjectLine = templateInfo.subjectLine;
        } else {
            // Try valid custom campaign
            const custom = await getCustomCampaign(campaignId);
            if (custom) {
                subjectLine = `Update: ${custom.name}`;
                emailTemplate = () => custom.content;
                textTemplate = () => 'Please enable HTML to view this email.';
            } else {
                return { success: false, sentCount: 0, error: 'Invalid campaign ID' };
            }
        }

    } else if ((!emails || emails.length === 0) && !testEmail) {
        // Automated/Bulk Mode: Fetch all eligible users
        // Limit 5000 for safety
        const { data, error } = await supabase.from('users').select('*').range(0, 4999);
        if (error) return { success: false, sentCount: 0, error: 'Failed to fetch users' };
        users = data || [];

        // Blog-funnel campaigns go to leads (study-plan downloads), skipping anyone who already bought
        if (campaignId.startsWith('lead_')) {
            const { data: leads } = await supabase.from('leads').select('email, first_name, created_at').range(0, 4999);
            const owners = new Set(users.filter(u => u.account_type !== 'free' || u.has_book_access).map(u => String(u.email || '').toLowerCase()));
            users = (leads || [])
                .filter(l => l.email && !owners.has(String(l.email).toLowerCase()))
                .map(l => ({ id: null, email: l.email, full_name: l.first_name || 'Doctor', created_date: l.created_at, account_type: 'lead' }));
        }

        // Apply filtering logic based on campaignId
        const filtering = filterUsersForCampaign(users, campaignId);
        targetUsers = filtering.targetUsers;

        // Use templates from filtering or fetch custom
        if (filtering.templateInfo) {
            emailTemplate = filtering.templateInfo.emailTemplate;
            textTemplate = filtering.templateInfo.textTemplate;
            subjectLine = filtering.templateInfo.subjectLine;
        } else {
            // Check custom
            const custom = await getCustomCampaign(campaignId);
            if (custom) {
                targetUsers = users; // Send to all if no specific logic defined for custom?
                // Original logic for custom in 'default' block just returned error or custom content
                subjectLine = `Update: ${custom.name}`;
                emailTemplate = () => custom.content;
                textTemplate = () => 'Please enable HTML to view this email.';
            } else {
                return { success: false, sentCount: 0, error: 'Invalid campaign ID' };
            }
        }
    } else if (emails && emails.length > 0) {
        // Direct Email Mode
        targetUsers = emails.map(email => ({
            id: null,
            email,
            full_name: email.split('@')[0],
            exam_date: null,
            account_type: 'lead'
        }));

        const templateInfo = getTemplateForCampaign(campaignId);
        if (templateInfo) {
            emailTemplate = templateInfo.emailTemplate;
            textTemplate = templateInfo.textTemplate;
            subjectLine = templateInfo.subjectLine;
        } else {
            return { success: false, sentCount: 0, error: 'Campaign template not found for direct email' };
        }
    } else if (testEmail) {
        // Test Email
        targetUsers = [{
            id: null,
            email: testEmail,
            full_name: 'Test Recipient',
            exam_date: new Date().toISOString(),
            account_type: 'free'
        }];

        // Attempt to find template or custom
        const templateInfo = getTemplateForCampaign(campaignId);
        if (templateInfo) {
            emailTemplate = templateInfo.emailTemplate;
            textTemplate = templateInfo.textTemplate;
            subjectLine = `[TEST] ${templateInfo.subjectLine}`;
        } else {
            const custom = await getCustomCampaign(campaignId);
            if (custom) {
                subjectLine = `[TEST] ${custom.name}`;
                emailTemplate = () => custom.content;
                textTemplate = () => 'Test email content.';
            } else {
                return { success: false, sentCount: 0, error: 'Invalid campaign ID' };
            }
        }
    }

    // Cool-down for the account/bundle emails: skip anyone who already got ANY campaign email in the last 5 days
    if (!testEmail && !force && (campaignId.startsWith('account_') || campaignId.startsWith('lead_'))) {
        const since = new Date(Date.now() - 5 * 86400000).toISOString();
        const { data: recentLogs } = await supabase.from('campaign_logs').select('user_id, user_email').gte('sent_at', since);
        if (recentLogs && recentLogs.length > 0) {
            const recentSet = new Set([...recentLogs.map(l => l.user_id).filter(Boolean), ...recentLogs.map(l => l.user_email)]);
            targetUsers = targetUsers.filter(u => !recentSet.has(u.id) && !recentSet.has(u.email));
        }
    }

    // Deduplication
    if (!testEmail && !force && !(emails && emails.length > 0)) {
        const { data: existingLogs } = await supabase
            .from('campaign_logs')
            .select('user_id, user_email')
            .eq('campaign_id', campaignId);

        if (existingLogs && existingLogs.length > 0) {
            const sentSet = new Set([
                ...existingLogs.map(l => l.user_id).filter(Boolean),
                ...existingLogs.map(l => l.user_email)
            ]);
            targetUsers = targetUsers.filter(u => !sentSet.has(u.id) && !sentSet.has(u.email));
        }
    }

    if (targetUsers.length === 0) {
        return { success: true, sentCount: 0, recipients: [], error: 'No eligible users found to send to.' };
    }

    // Generation & Sending
    const emailsToSend = await Promise.all(targetUsers.map(async (user) => {
        const templateData = {
            userName: user.full_name || 'Future Doctor',
            firstName: user.full_name ? user.full_name.split(' ')[0] : 'Future Doctor',
            examDate: user.exam_date ? new Date(user.exam_date).toLocaleDateString('de-DE') : 'upcoming exam',
            year: new Date().getFullYear(),
            data: user // Pass full user object for flexible templates
        };

        const htmlContent = await getCampaignContent(campaignId, emailTemplate, templateData);

        return {
            from: 'FaMED-Vorbereitung <team@famed-vorbereitung.com>',
            to: [user.email],
            subject: subjectLine,
            html: htmlContent,
            text: textTemplate(templateData)
        };
    }));

    // Batch Send
    const BATCH_SIZE = 100;
    let totalSent = 0;
    const allResults: any[] = [];

    for (let i = 0; i < emailsToSend.length; i += BATCH_SIZE) {
        const chunk = emailsToSend.slice(i, i + BATCH_SIZE);
        try {
            const { data, error } = await resend.batch.send(chunk);

            if (error) {
                console.error('Resend Batch Error:', error);
                continue;
            }

            if (data) {
                allResults.push(...data.data);
                totalSent += chunk.length;
            }
        } catch (e) {
            console.error('Resend Execution Error:', e);
        }
    }

    // Logging
    if (totalSent > 0) {
        const logs = emailsToSend.map((email, index) => ({
            campaign_id: campaignId,
            user_email: email.to[0],
            user_id: targetUsers[index].id || null,
            status: 'sent',
            resend_email_id: allResults[index]?.id,
            metadata: { subject: email.subject, sent_at: new Date().toISOString(), is_test: !!testEmail }
        }));

        await supabase.from('campaign_logs').insert(logs);

        // Log sends for deduplication
        const sends = logs.map(l => ({
            campaign_id: l.campaign_id,
            user_id: l.user_id,
            sent_at: new Date().toISOString()
        }));
        // Filter out null user_ids before inserting to campaign_sends if that table requires user_id
        // (Assuming campaign_sends is for user-based verification)
        const validSends = sends.filter(s => s.user_id);
        if (validSends.length > 0) {
            await supabase.from('campaign_sends').insert(validSends);
        }
    }

    return {
        success: totalSent > 0,
        sentCount: totalSent,
        recipients: targetUsers.map(u => ({ name: u.full_name, email: u.email }))
    };
}


// --- Helpers ---

function getTemplateForCampaign(campaignId: string) {
    const templates: Record<string, any> = {
        'exam_urgency_14d': { emailTemplate: getExamUrgency14Days, textTemplate: getTextExamUrgency14Days, subjectLine: 'Two weeks to your exam: 2 weeks of full app access' },
        'exam_urgency_special_offer': { emailTemplate: getExamUrgencySpecialOffer, textTemplate: getTextExamUrgencySpecialOffer, subjectLine: '🔥 Last Chance: €17.99 Special Offer' },
        'exam_urgency_7d': { emailTemplate: getExamUrgency7Days, textTemplate: getTextExamUrgency7Days, subjectLine: 'Final week: sit the real exam, every day' },
        'exam_urgency_1_week_special': { emailTemplate: getExamUrgency1WeekSpecial, textTemplate: getTextExamUrgency1WeekSpecial, subjectLine: '🚨 Final Week Special Offer' },
        'exam_urgency_3d': { emailTemplate: getExamUrgency3Days, textTemplate: getTextExamUrgency3Days, subjectLine: '⏰ 72 Hours Until Your FaMED Exam' },
        'welcome_day0': { emailTemplate: getWelcomeDay0, textTemplate: getTextWelcomeDay0, subjectLine: '👋 Welcome to FaMED!' },
        'subscription_expiry': { emailTemplate: getSubscriptionExpiry, textTemplate: getTextSubscriptionExpiry, subjectLine: '🔔 Your Premium Access Expires Soon' },
        'welcome_bundle_promo': { emailTemplate: getWelcomeBundlePromo, textTemplate: getTextWelcomeBundlePromo, subjectLine: 'Pass the FaMED exam with the Book + App Bundle' },
        'lead_app_offer': { emailTemplate: getLeadAppOffer, textTemplate: getTextLeadAppOffer, subjectLine: 'Walk into exam day having already done it out loud' },
        'account_book_offer': { emailTemplate: getAccountBookOffer, textTemplate: getTextAccountBookOffer, subjectLine: 'Welcome to FaMED: the book that shows how the exam runs' },
        'account_missing_out': { emailTemplate: getAccountMissingOut, textTemplate: getTextAccountMissingOut, subjectLine: "Here's what you're missing" },
        'account_weekly_bundle_1': { emailTemplate: getAccountWeeklyBundle, textTemplate: getTextAccountWeeklyBundle, subjectLine: 'Still half price: the Book + App Bundle' },
        'account_weekly_bundle_2': { emailTemplate: getAccountWeeklyBundle, textTemplate: getTextAccountWeeklyBundle, subjectLine: 'Still half price: the Book + App Bundle' },
        'account_weekly_bundle_3': { emailTemplate: getAccountWeeklyBundle, textTemplate: getTextAccountWeeklyBundle, subjectLine: 'Still half price: the Book + App Bundle' },
        'account_weekly_bundle_4': { emailTemplate: getAccountWeeklyBundle, textTemplate: getTextAccountWeeklyBundle, subjectLine: 'Still half price: the Book + App Bundle' },
        'account_weekly_bundle_5': { emailTemplate: getAccountWeeklyBundle, textTemplate: getTextAccountWeeklyBundle, subjectLine: 'Still half price: the Book + App Bundle' },
        'account_weekly_bundle_6': { emailTemplate: getAccountWeeklyBundle, textTemplate: getTextAccountWeeklyBundle, subjectLine: 'Still half price: the Book + App Bundle' },
        'site_back_online': { emailTemplate: getSiteBackOnline, textTemplate: getTextSiteBackOnline, subjectLine: "We're Back Online!" },
        'holiday_special': { emailTemplate: getHolidaySpecial, textTemplate: getTextHolidaySpecial, subjectLine: '🎄 Holiday Special' },
        'new_year_special': { emailTemplate: getNewYearSpecial, textTemplate: getTextNewYearSpecial, subjectLine: '🎉 Happy New Year!' }
    };
    return templates[campaignId];
}

async function getCustomCampaign(id: string) {
    const { data } = await supabase.from('campaigns').select('*').eq('id', id).single();
    return data;
}

function filterUsersForCampaign(users: any[], campaignId: string) {
    const now = new Date();
    let targetUsers: any[] = [];
    const templateInfo = getTemplateForCampaign(campaignId);

    switch (campaignId) {
        case 'exam_urgency_14d':
            targetUsers = users.filter(u => {
                if (!u.exam_date || u.account_type !== 'free') return false;
                const daysUntil = (new Date(u.exam_date).getTime() - now.getTime()) / (86400000);
                return daysUntil >= 12 && daysUntil <= 16;
            });
            break;

        case 'exam_urgency_special_offer':
            targetUsers = users.filter(u => {
                if (!u.exam_date || u.account_type !== 'free') return false;
                const daysUntil = (new Date(u.exam_date).getTime() - now.getTime()) / (86400000);
                return daysUntil >= 7 && daysUntil <= 15;
            });
            break;

        case 'exam_urgency_7d':
            targetUsers = users.filter(u => {
                if (!u.exam_date || u.account_type !== 'free') return false;
                const daysUntil = (new Date(u.exam_date).getTime() - now.getTime()) / (86400000);
                return daysUntil >= 6 && daysUntil <= 8;
            });
            break;

        case 'exam_urgency_3d':
            targetUsers = users.filter(u => {
                if (!u.exam_date || u.account_type !== 'free') return false;
                const daysUntil = (new Date(u.exam_date).getTime() - now.getTime()) / (86400000);
                return daysUntil >= 2 && daysUntil <= 4;
            });
            break;

        case 'welcome_day0':
            targetUsers = users.filter(u => {
                const daysSince = (now.getTime() - new Date(u.created_date).getTime()) / 86400000;
                return daysSince <= 7; // demo logic
            });
            break;

        case 'subscription_expiry':
            targetUsers = users.filter(u => {
                if (!u.plan_expiry || !u.account_type?.startsWith('paid')) return false;
                const daysUntil = (new Date(u.plan_expiry).getTime() - now.getTime()) / 86400000;
                return daysUntil >= 6 && daysUntil <= 8;
            });
            break;

        case 'welcome_bundle_promo':
            targetUsers = users.filter(u => {
                if (u.account_type?.startsWith('paid') || !u.created_date) return false;
                const daysSince = (now.getTime() - new Date(u.created_date).getTime()) / 86400000;
                return daysSince <= 7;
            });
            break;

        case 'account_book_offer':
        case 'account_missing_out':
        case 'account_weekly_bundle_1':
        case 'account_weekly_bundle_2':
        case 'account_weekly_bundle_3':
        case 'account_weekly_bundle_4':
        case 'account_weekly_bundle_5':
        case 'account_weekly_bundle_6': {
            // Free accounts only (not paid, no book yet). Each week-window is its own campaign id, so the
            // once-per-campaign dedupe makes the weekly bundle email go out once a week, until the
            // exam is close (then the 14-day and 7-day countdown emails take over).
            const windows: Record<string, [number, number]> = {
                account_book_offer: [1, 3], account_missing_out: [5, 7],
                account_weekly_bundle_1: [12, 19], account_weekly_bundle_2: [19, 26], account_weekly_bundle_3: [26, 33],
                account_weekly_bundle_4: [33, 40], account_weekly_bundle_5: [40, 47], account_weekly_bundle_6: [47, 54]
            };
            const [from, to] = windows[campaignId];
            targetUsers = users.filter(u => {
                if (!u.email || !u.created_date || u.role === 'admin') return false;
                if (u.account_type !== 'free' || u.has_book_access) return false;
                const daysSince = (now.getTime() - new Date(u.created_date).getTime()) / 86400000;
                if (daysSince < from || daysSince >= to) return false;
                if (u.exam_date) {
                    const daysUntil = (new Date(u.exam_date).getTime() - now.getTime()) / 86400000;
                    if (daysUntil < 16) return false;
                }
                return true;
            });
            break;
        }

        case 'lead_app_offer':
            targetUsers = users.filter(u => {
                if (!u.email || !u.created_date) return false;
                const daysSince = (now.getTime() - new Date(u.created_date).getTime()) / 86400000;
                return daysSince >= 1 && daysSince < 3;
            });
            break;

        case 'holiday_special':
        case 'new_year_special':
        case 'site_back_online':
            targetUsers = users.filter(u => !u.account_type?.startsWith('paid'));
            break;

        default:
            // Custom campaigns: return all if likely intended for bulk, but usually filtered manually.
            // For automated generic custom, maybe no filtering?
            targetUsers = [];
    }

    return { targetUsers, templateInfo };
}
