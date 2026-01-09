import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const { campaignId } = await request.json();

        if (!campaignId) {
            return NextResponse.json(
                { error: 'Campaign ID is required' },
                { status: 400 }
            );
        }

        console.log(`📋 Previewing recipients for campaign: ${campaignId}`);

        // Fetch all users
        const { data: allUsers, error: usersError } = await supabaseAdmin
            .from('users')
            .select('id, email, name, exam_date, account_type, created_at');

        if (usersError) {
            console.error('Error fetching users:', usersError);
            return NextResponse.json(
                { error: 'Failed to fetch users' },
                { status: 500 }
            );
        }

        // Filter users based on campaign criteria
        let targetUsers: any[] = [];
        const today = new Date();

        switch (campaignId) {
            case 'exam_urgency_14d':
                // Exam in exactly 14 days, free account
                targetUsers = allUsers.filter(user => {
                    if (!user.exam_date || user.account_type !== 'free') return false;
                    const examDate = new Date(user.exam_date);
                    const daysUntil = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return daysUntil === 14;
                });
                break;

            case 'exam_urgency_special_offer':
                // Exam in 7-14 days, free account
                targetUsers = allUsers.filter(user => {
                    if (!user.exam_date || user.account_type !== 'free') return false;
                    const examDate = new Date(user.exam_date);
                    const daysUntil = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return daysUntil >= 7 && daysUntil <= 14;
                });
                break;

            case 'exam_urgency_1_week_special':
                // Exam in < 7 days, free account
                targetUsers = allUsers.filter(user => {
                    if (!user.exam_date || user.account_type !== 'free') return false;
                    const examDate = new Date(user.exam_date);
                    const daysUntil = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return daysUntil > 0 && daysUntil < 7;
                });
                break;

            case 'holiday_special':
            case 'new_year_special':
            case 'site_back_online':
                // All non-paid users
                targetUsers = allUsers.filter(user => user.account_type === 'free');
                break;

            case 'welcome_bundle_promo':
                // New users (last 7 days), not paid
                const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                targetUsers = allUsers.filter(user => {
                    if (user.account_type !== 'free') return false;
                    const createdAt = new Date(user.created_at);
                    return createdAt >= sevenDaysAgo;
                });
                break;

            default:
                return NextResponse.json(
                    { error: 'Unknown campaign type' },
                    { status: 400 }
                );
        }

        // Check which users have already been sent this campaign
        const { data: sentRecords, error: sentError } = await supabaseAdmin
            .from('campaign_sends')
            .select('user_id')
            .eq('campaign_id', campaignId);

        if (sentError) {
            console.error('Error checking sent records:', sentError);
        }

        const sentUserIds = new Set(sentRecords?.map(r => r.user_id) || []);

        // Add "already_sent" flag and calculate days until exam
        const usersWithStatus = targetUsers.map(user => {
            let daysUntilExam = null;
            if (user.exam_date) {
                const examDate = new Date(user.exam_date);
                daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            }

            return {
                id: user.id,
                email: user.email,
                name: user.name || 'Unknown',
                exam_date: user.exam_date,
                days_until_exam: daysUntilExam,
                account_type: user.account_type,
                already_sent: sentUserIds.has(user.id)
            };
        });

        const alreadySentCount = usersWithStatus.filter(u => u.already_sent).length;

        console.log(`✅ Found ${usersWithStatus.length} matching users (${alreadySentCount} already sent)`);

        return NextResponse.json({
            campaignId,
            totalMatches: usersWithStatus.length,
            alreadySent: alreadySentCount,
            notSent: usersWithStatus.length - alreadySentCount,
            users: usersWithStatus
        });

    } catch (error: any) {
        console.error('Preview recipients error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to preview recipients' },
            { status: 500 }
        );
    }
}
