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
    getTextHolidaySpecial,
    getNewYearSpecial,
    getTextNewYearSpecial,
    getExamUrgency1WeekSpecial,
    getTextExamUrgency1WeekSpecial,
    getWelcomeBundlePromo,
    getTextWelcomeBundlePromo,
    getSiteBackOnline,
    getTextSiteBackOnline
} from '@/lib/campaign-templates';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to get campaign content - checks DB first, then falls back to template
// Helper function to get campaign content - checks DB first, then falls back to template
async function getCampaignContent(campaignId: string, templateFn: (data: any) => string, data: any): Promise<string> {
    console.log(`[DEBUG] getCampaignContent: Starting for ${campaignId}`);

    // Create a timeout for this operation
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`getCampaignContent timed out for ${campaignId}`)), 5000);
    });

    const contentPromise = (async () => {
        // Campaign name mapping (same as in [id]/route.ts)
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
            console.log(`[DEBUG] getCampaignContent: SKIPPING DB FETCH for ${campaignName} (Debugging Hang)`);
            /* 
            try {
                console.log(`[DEBUG] getCampaignContent: Fetching from DB for ${campaignName}`);
                const { data: campaign, error } = await supabase
                    .from('campaigns')
                    .select('content')
                    .eq('name', campaignName)
                    .single();
                
                if (error) {
                    console.log(`[DEBUG] getCampaignContent: DB fetch error/empty for ${campaignName}: ${error.message}`);
                }

                if (campaign?.content) {
                    console.log(`📧 Using saved content for ${campaignId}`);
                    // Replace placeholders in saved content
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
            */
        }

        console.log(`[DEBUG] getCampaignContent: Using template function`);
        return templateFn(data);
    })();

    // Race against timeout
    return Promise.race([contentPromise, timeoutPromise]) as Promise<string>;
}

export async function POST(request: Request) {
    try {
        const { campaignId, testEmail, userIds, emails, specificUserId, force } = await request.json();

        console.log('🔍 Campaign send request:', { campaignId, testEmail, hasUserIds: !!userIds, hasEmails: !!emails, specificUserId, force });

        let users: any[] = [];
        let fetchError = null;
        let targetUsers: any[] = [];
        let emailTemplate: (params: any) => string;
        let textTemplate: (params: any) => string;
        let subjectLine = '';

        console.log('[DEBUG] Step 1: Request parsed');

        // Optimization: Fetch strategy based on mode
        if (specificUserId) {
            console.log('[DEBUG] Step 2: Fetching specific user');

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', specificUserId)
                .single();

            console.log('[DEBUG] Step 2.1: Specific user fetch result:', { success: !!data, error: error?.message });

            if (error || !data) {
                console.error('❌ User not found:', error);
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            // Check if already sent (unless force is true)
            if (!force) {
                const { data: sentRecord } = await supabase
                    .from('campaign_sends')
                    .select('id')
                    .eq('campaign_id', campaignId)
                    .eq('user_id', specificUserId)
                    .single();

                if (sentRecord) {
                    return NextResponse.json({
                        error: 'Campaign already sent to this user. Use force=true to resend.'
                    }, { status: 400 });
                }
            }

            users = [data];
            targetUsers = users;

            // Set templates based on campaign type
            switch (campaignId) {
                case 'exam_urgency_14d':
                    emailTemplate = getExamUrgency14Days;
                    textTemplate = getTextExamUrgency14Days;
                    subjectLine = '⚠️ Your Exam is in 14 Days!';
                    break;
                case 'exam_urgency_special_offer':
                    emailTemplate = getExamUrgencySpecialOffer;
                    textTemplate = getTextExamUrgencySpecialOffer;
                    subjectLine = '🔥 Last Chance: €17.99 Special Offer';
                    break;
                case 'exam_urgency_1_week_special':
                    emailTemplate = getExamUrgency1WeekSpecial;
                    textTemplate = getTextExamUrgency1WeekSpecial;
                    subjectLine = '🚨 Final Week Special Offer';
                    break;
                case 'welcome_bundle_promo':
                    emailTemplate = getWelcomeBundlePromo;
                    textTemplate = getTextWelcomeBundlePromo;
                    subjectLine = '🎁 Welcome to FaMED - Special Offer';
                    break;
                case 'site_back_online':
                    emailTemplate = getSiteBackOnline;
                    textTemplate = getTextSiteBackOnline;
                    subjectLine = "We're Back Online!";
                    break;
                default:
                    emailTemplate = getWelcomeDay0;
                    textTemplate = getTextWelcomeDay0;
                    subjectLine = '👋 Welcome to FaMED!';
                    break;
            }
            fetchError = null;

        } else if (userIds && Array.isArray(userIds) && userIds.length > 0) {
            console.log('📧 Optimized Fetch: Fetching specific users', userIds.length);
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .in('id', userIds);
            users = data || [];
            fetchError = error;
        } else if ((!emails || emails.length === 0) && !testEmail) {
            // Automated/Bulk Mode: Fetch all (limit 5000)
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .range(0, 4999);
            users = data || [];
            fetchError = error;
        }

        if (fetchError) {
            console.error('❌ User fetch error:', fetchError);
            return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
        }

        const now = new Date();

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
                { id: 'exam_urgency_special_offer', t: getExamUrgencySpecialOffer, tt: getTextExamUrgencySpecialOffer, s: '🔥 Last Chance: €17.99 Special Offer' },
                { id: 'exam_urgency_7d', t: getExamUrgency7Days, tt: getTextExamUrgency7Days, s: '🚨 Test: Exam in 7 Days' },
                { id: 'exam_urgency_3d', t: getExamUrgency3Days, tt: getTextExamUrgency3Days, s: '⏰ Test: 72 Hours Until Exam' },
                { id: 'welcome_day0', t: getWelcomeDay0, tt: getTextWelcomeDay0, s: '👋 Test: Welcome to FaMED' },
                { id: 'subscription_expiry', t: getSubscriptionExpiry, tt: getTextSubscriptionExpiry, s: '🔔 Test: Subscription Expiry' },
                { id: 'holiday_special', t: getHolidaySpecial, tt: getTextHolidaySpecial, s: '🎄 Test: Holiday Special' },
                { id: 'new_year_special', t: getNewYearSpecial, tt: getTextNewYearSpecial, s: '🎉 Test: Happy New Year Special' },
                { id: 'exam_urgency_1_week_special', t: getExamUrgency1WeekSpecial, tt: getTextExamUrgency1WeekSpecial, s: '🚨 Test: 1 Week Special' },
                { id: 'welcome_bundle_promo', t: getWelcomeBundlePromo, tt: getTextWelcomeBundlePromo, s: '🎁 Test: Welcome Bundle Promo' },
                { id: 'site_back_online', t: getSiteBackOnline, tt: getTextSiteBackOnline, s: "We're Back Online!" },
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
        } else if (emails && Array.isArray(emails) && emails.length > 0) {
            console.log('📧 DIRECT EMAIL MODE: Sending to', emails.length, 'email addresses');
            console.log('📧 Emails:', emails);

            // Auto-fix incomplete email addresses (e.g., @gmail -> @gmail.com)
            const fixedEmails = emails.map((email: string) => {
                // Fix common incomplete domains
                if (email.endsWith('@gmail')) return email + '.com';
                if (email.endsWith('@yahoo')) return email + '.com';
                if (email.endsWith('@hotmail')) return email + '.com';
                return email;
            });

            // Validate emails
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const validEmails = fixedEmails.filter((email: string) => emailRegex.test(email));
            const invalidEmails = fixedEmails.filter((email: string) => !emailRegex.test(email));

            if (invalidEmails.length > 0) {
                console.warn('⚠️ Filtered out invalid emails:', invalidEmails);
            }

            if (validEmails.length === 0) {
                return NextResponse.json({
                    error: 'No valid email addresses provided'
                }, { status: 400 });
            }

            targetUsers = validEmails.map((email: string) => ({
                id: null,
                email: email,
                full_name: email.split('@')[0],
                exam_date: null,
                account_type: 'lead',
                created_date: now.toISOString()
            }));

            switch (campaignId) {
                case 'welcome_bundle_promo':
                    emailTemplate = getWelcomeBundlePromo;
                    textTemplate = getTextWelcomeBundlePromo;
                    subjectLine = '🎁 Welcome! Get the Complete FaMED Bundle';
                    break;
                case 'new_year_special':
                    emailTemplate = getNewYearSpecial;
                    textTemplate = getTextNewYearSpecial;
                    subjectLine = '🎉 HAPPY NEW YEAR! Start 2026 Right - Pass Your FaMED Exam!';
                    break;
                case 'holiday_special':
                    emailTemplate = getHolidaySpecial;
                    textTemplate = getTextHolidaySpecial;
                    subjectLine = '🎄 Holiday Special: 50% Off + Free Book! 🎁';
                    break;
                case 'exam_urgency_1_week_special':
                    emailTemplate = getExamUrgency1WeekSpecial;
                    textTemplate = getTextExamUrgency1WeekSpecial;
                    subjectLine = '🚨 1 Week Left! Last Chance to Pass 🚨';
                    break;
                case 'site_back_online':
                    emailTemplate = getSiteBackOnline;
                    textTemplate = getTextSiteBackOnline;
                    subjectLine = "We're Back Online!";
                    break;
                default:
                    emailTemplate = getWelcomeDay0;
                    textTemplate = getTextWelcomeDay0;
                    subjectLine = '👋 Welcome to FaMED Prep!';
                    break;
            }
        } else if (userIds && Array.isArray(userIds) && userIds.length > 0) {
            // MANUAL SELECTION MODE: Use specified user IDs
            targetUsers = users.filter(u => userIds.includes(String(u.id)));

            // Set templates based on campaign type
            switch (campaignId) {
                case 'exam_urgency_14d':
                    emailTemplate = getExamUrgency14Days;
                    textTemplate = getTextExamUrgency14Days;
                    subjectLine = '⚠️ Your Exam is in 14 Days!';
                    break;
                case 'exam_urgency_special_offer':
                    emailTemplate = getExamUrgencySpecialOffer;
                    textTemplate = getTextExamUrgencySpecialOffer;
                    subjectLine = '🔥 Special Offer: Last Minute Rescue Pack (€19.99)';
                    break;
                case 'exam_urgency_1_week_special':
                    emailTemplate = getExamUrgency1WeekSpecial;
                    textTemplate = getTextExamUrgency1WeekSpecial;
                    subjectLine = '🚨 1 Week Left! Last Chance to Pass 🚨';
                    break;
                case 'exam_urgency_7d':
                    emailTemplate = getExamUrgency7Days;
                    textTemplate = getTextExamUrgency7Days;
                    subjectLine = '🚨 Final Week! Your Exam is This Week';
                    break;
                case 'exam_urgency_3d':
                    emailTemplate = getExamUrgency3Days;
                    textTemplate = getTextExamUrgency3Days;
                    subjectLine = '⏰ 72 Hours Until Your FaMED Exam';
                    break;
                case 'welcome_day0':
                    emailTemplate = getWelcomeDay0;
                    textTemplate = getTextWelcomeDay0;
                    subjectLine = '👋 Welcome to FaMED Prep!';
                    break;
                case 'subscription_expiry':
                    emailTemplate = getSubscriptionExpiry;
                    textTemplate = getTextSubscriptionExpiry;
                    subjectLine = '🔔 Your Premium Access Expires Soon';
                    break;
                case 'welcome_bundle_promo':
                    emailTemplate = getWelcomeBundlePromo;
                    textTemplate = getTextWelcomeBundlePromo;
                    subjectLine = '🎁 Welcome! Get the Complete FaMED Bundle';
                    break;
                case 'holiday_special':
                    const { data: holidayOverride } = await supabase
                        .from('campaigns')
                        .select('content')
                        .eq('name', 'Holiday Special')
                        .single();

                    if (holidayOverride?.content) {
                        emailTemplate = () => holidayOverride.content;
                    } else {
                        emailTemplate = getHolidaySpecial;
                    }
                    textTemplate = getTextHolidaySpecial;
                    subjectLine = '🎄 Holiday Special: 50% Off + Free Book! 🎁';
                    break;
                case 'new_year_special':
                    emailTemplate = getNewYearSpecial;
                    textTemplate = getTextNewYearSpecial;
                    subjectLine = '🎉 HAPPY NEW YEAR! Start 2026 Right - Pass Your FaMED Exam!';
                    break;
                case 'site_back_online':
                    emailTemplate = getSiteBackOnline;
                    textTemplate = getTextSiteBackOnline;
                    subjectLine = "We're Back Online!";
                    break;
                default:
                    // Check for custom campaign
                    const { data: customCampaign } = await supabase
                        .from('campaigns')
                        .select('*')
                        .eq('id', campaignId)
                        .single();

                    if (customCampaign) {
                        subjectLine = `Update: ${customCampaign.name}`;
                        emailTemplate = () => customCampaign.content;
                        textTemplate = (data) => `Please enable HTML to view this email.`;
                    } else {
                        return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 });
                    }
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

                case 'exam_urgency_1_week_special':
                    // Target free users with exam in ≤ 7 days
                    targetUsers = users.filter(u => {
                        if (!u.exam_date || u.account_type?.startsWith('paid')) return false;
                        const examDate = new Date(u.exam_date);
                        const daysUntil = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                        return daysUntil >= 0 && daysUntil <= 7;
                    });
                    emailTemplate = getExamUrgency1WeekSpecial;
                    textTemplate = getTextExamUrgency1WeekSpecial;
                    subjectLine = '🚨 1 Week Left! Last Chance to Pass 🚨';
                    break;

                case 'holiday_special':
                    // Check if there is a custom override in the database
                    const { data: holidayOverride } = await supabase
                        .from('campaigns')
                        .select('content')
                        .eq('name', 'Holiday Special')
                        .single();

                    // Target all free users (not paid)
                    console.log('[HOLIDAY_SPECIAL] Total users fetched:', users?.length);
                    console.log('[HOLIDAY_SPECIAL] Sample user account_types:', users?.slice(0, 5).map(u => ({ email: u.email, account_type: u.account_type })));
                    targetUsers = users.filter(u => !u.account_type?.startsWith('paid'));
                    console.log('[HOLIDAY_SPECIAL] Users after filtering (non-paid):', targetUsers.length);

                    if (holidayOverride?.content) {
                        emailTemplate = () => holidayOverride.content;
                    } else {
                        emailTemplate = getHolidaySpecial;
                    }

                    textTemplate = getTextHolidaySpecial; // We only allow editing HTML for now
                    subjectLine = '🎄 Holiday Special: 50% Off + Free Book! 🎁';
                    break;

                case 'new_year_special':
                    // Target all free users (not paid)
                    console.log('[NEW_YEAR_SPECIAL] Total users fetched:', users?.length);
                    console.log('[NEW_YEAR_SPECIAL] Sample user account_types:', users?.slice(0, 5).map(u => ({ email: u.email, account_type: u.account_type })));
                    targetUsers = users.filter(u => !u.account_type?.startsWith('paid'));
                    console.log('[NEW_YEAR_SPECIAL] Users after filtering (non-paid):', targetUsers.length);
                    console.log('[NEW_YEAR_SPECIAL] Sample filtered users:', targetUsers.slice(0, 3).map(u => ({ email: u.email, account_type: u.account_type })));
                    emailTemplate = getNewYearSpecial;
                    textTemplate = getTextNewYearSpecial;
                    subjectLine = '🎉 HAPPY NEW YEAR! Start 2026 Right - Pass Your FaMED Exam!';
                    break;

                case 'welcome_bundle_promo':
                    // Target: signed up in last 7 days AND not paid
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    targetUsers = users.filter(u => {
                        if (u.account_type?.startsWith('paid')) return false;
                        // Check if created_date is within last 7 days
                        if (!u.created_date) return false;
                        const createdDate = new Date(u.created_date);
                        return createdDate >= sevenDaysAgo;
                    });
                    emailTemplate = getWelcomeBundlePromo;
                    textTemplate = getTextWelcomeBundlePromo;
                    subjectLine = '🎁 Welcome! Get the Complete FaMED Bundle';
                    break;

                case 'site_back_online':
                    // Target: all non-paid users
                    targetUsers = users.filter(u => !u.account_type?.startsWith('paid'));
                    emailTemplate = getSiteBackOnline;
                    textTemplate = getTextSiteBackOnline;
                    subjectLine = "We're Back Online!";
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
        // Skip deduplication for test emails AND manual user/email selection
        const isManualSelection = (userIds && userIds.length > 0) || (emails && emails.length > 0);

        if (!testEmail && !isManualSelection) { // Skip deduplication for test emails and manual selections
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
        const emailsToSend = await Promise.all(targetUsers.map(async (user) => {
            const daysUntilExam = user.exam_date
                ? Math.ceil((new Date(user.exam_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                : null;

            // Helper function to replace placeholders
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

            // Use helper function to get content (checks DB first, then template)
            const htmlContent = await getCampaignContent(campaignId, emailTemplate, templateData);

            const textContent = textTemplate({
                userName: user.full_name || 'there',
                userEmail: user.email,
                examDate: user.exam_date,
                daysUntilExam,
                planExpiry: user.plan_expiry,
                accountType: user.account_type
            });

            return {
                from: 'FaMED-Vorbereitung <team@famed-vorbereitung.com>',
                to: user.email,
                subject: subjectLine,
                html: htmlContent,
                text: textContent
            };
        }));

        console.log('📧 About to send emails:', {
            targetUsersCount: targetUsers.length,
            emailsToSendCount: emailsToSend.length,
            firstEmail: emailsToSend[0] ? { to: emailsToSend[0].to, subject: emailsToSend[0].subject } : 'none'
        });

        // Send emails using Resend batch API (max 100 per batch)
        const BATCH_SIZE = 100;
        let totalSent = 0;
        const allResults: any[] = [];

        for (let i = 0; i < emailsToSend.length; i += BATCH_SIZE) {
            const chunk = emailsToSend.slice(i, i + BATCH_SIZE);
            console.log(`Sending batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(emailsToSend.length / BATCH_SIZE)} (${chunk.length} emails)`);
            console.log('Sending via Resend API key:', process.env.RESEND_API_KEY ? 'Present' : 'MISSING');

            let sendResult, sendError;
            try {
                console.log(`[DEBUG] Step 5.${i}: Attempting to call Resend API via raw fetch...`);

                const response = await fetch('https://api.resend.com/emails/batch', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(chunk)
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(`[DEBUG] Step 5.${i}: Resend API SUCCESS via fetch`);
                    sendResult = data;
                } else {
                    const errorText = await response.text();
                    console.error(`[DEBUG] Step 5.${i}: Resend API FAILED via fetch: ${response.status} ${errorText}`);
                    sendError = { message: errorText, status: response.status };
                }

            } catch (e: any) {
                console.error(`❌ CRITICAL: Raw fetch to Resend API threw exception in batch ${Math.floor(i / BATCH_SIZE) + 1}:`, e);
                sendError = e;
            }

            if (sendError) {
                console.error(`❌ Resend error in batch ${Math.floor(i / BATCH_SIZE) + 1}:`, sendError);
                // Continue with other batches even if one fails
                continue;
            }

            console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1} sent successfully. Result:`, JSON.stringify(sendResult, null, 2));

            if (sendResult?.data) {
                // Collect results for logging
                if (Array.isArray(sendResult.data)) {
                    allResults.push(...sendResult.data);
                } else {
                    allResults.push(sendResult.data);
                }
            } else {
                console.warn('⚠️ Send result success but no data returned:', sendResult);
            }

            totalSent += chunk.length;
            if (sendResult?.data) {
                allResults.push(...sendResult.data);
            }
        }

        console.log(`Successfully sent ${totalSent} out of ${emailsToSend.length} emails`);

        if (totalSent === 0) {
            return NextResponse.json({
                error: 'Failed to send any emails'
            }, { status: 500 });
        }

        // Log sent emails to database
        const logs = emailsToSend.map((email, index) => {
            // Map results from batched sending
            const resendId = allResults?.[index]?.id;
            const user = targetUsers[index];

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

        // Log to campaign_logs table
        const { error: logError } = await supabase
            .from('campaign_logs')
            .insert(logs);

        if (logError) {
            console.error('Failed to log campaign sends:', logError);
            // We don't fail the request since emails were sent
        }

        // ALSO log to campaign_sends table for tracking "already sent" status
        const sendRecords = emailsToSend.map((email, index) => {
            const user = targetUsers[index];
            return {
                campaign_id: campaignId,
                user_id: user?.id || null,
                sent_at: new Date().toISOString()
            };
        });

        const { error: sendsError } = await supabase
            .from('campaign_sends')
            .insert(sendRecords);

        if (sendsError) {
            console.error('Failed to record campaign sends:', sendsError);
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
            })),
            debug: {
                allResults,
                apiKeyPresent: !!process.env.RESEND_API_KEY
            }
        });

    } catch (error: any) {
        console.error('Campaign send error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 });
    }
}
