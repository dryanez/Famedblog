// Email campaign templates with dynamic content injection

interface CampaignEmailParams {
    userName: string;
    userEmail: string;
    examDate?: string;
    daysUntilExam?: number;
    planExpiry?: string;
    accountType?: string;
}

/**
 * TIER 1: EXAM URGENCY CAMPAIGNS
 * Triggered automatically for users with exams in < 14 days who haven't paid
 */

export function getExamUrgency14Days({ userName, examDate, daysUntilExam }: CampaignEmailParams): string {
    const firstName = userName.split(" ")[0] || "there";

    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #333;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">⚠️ Your Exam is in ${daysUntilExam} Days!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 18px; margin-top: 0;">Hi ${firstName},</p>
                
                <p>Your FaMED exam is scheduled for <strong>${examDate}</strong> — that's just <strong>${daysUntilExam} days away</strong>!</p>
                
                <p>I wanted to personally reach out because students who use our <strong>premium practice materials</strong> in the final 2 weeks see an average <strong>23% improvement</strong> in their scores.</p>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
                    <p style="margin: 0; font-weight: 600; color: #92400e;">🎯 Here's what you get with Premium:</p>
                    <ul style="margin: 10px 0 0 20px; color: #92400e;">
                        <li>1,000+ exam-style questions</li>
                        <li>Detailed explanations in German</li>
                        <li>Progress tracking & weak area analysis</li>
                        <li>Exam simulation mode</li>
                    </ul>
                </div>
                
                <p><strong>Special offer for you:</strong> Get 30% off any plan to help you ace your exam!</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://famed-vorbereitung.com/pricing?code=EXAM14" style="display: inline-block; background: #f59e0b; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">Get Premium Now (30% Off)</a>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
                    This offer expires in 48 hours or when your exam date passes.
                </p>
                
                <p>Best of luck with your preparation!</p>
                <p style="margin-bottom: 0;">The FaMED Team</p>
            </div>
        </div>
    `;
}

export function getExamUrgency7Days({ userName, examDate }: CampaignEmailParams): string {
    const firstName = userName.split(" ")[0] || "there";

    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #333;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🚨 Final Week! Your Exam is This ${getWeekday(examDate)}</h1>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 18px; margin-top: 0;">Hi ${firstName},</p>
                
                <p><strong>This is it.</strong> Your FaMED exam is in just <strong>7 days</strong>.</p>
                
                <p>The next week is <em>critical</em>. This is when focused, targeted practice makes the biggest difference.</p>
                
                <p>You are the <strong>perfect student</strong> to make the most of these final days. As your test approaches, it's crucial that you practice <strong>exactly how the test will be on the real day</strong>.</p>
                
                <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 25px 0; border-radius: 4px;">
                    <p style="margin: 0; font-weight: 600; color: #991b1b;">💻 Our 1-on-1 Computer Simulations:</p>
                    <ul style="margin: 10px 0 0 20px; color: #991b1b;">
                        <li>Replicate the real exam environment</li>
                        <li>Timed practice under exam conditions</li>
                        <li>Instant feedback on weak areas</li>
                        <li>Build confidence & reduce anxiety</li>
                    </ul>
                </div>
                
                <p><strong>FINAL WEEK SPECIAL:</strong> 40% off Premium — our biggest discount ever!</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://famed-vorbereitung.com/pricing?code=FINALWEEK" style="display: inline-block; background: #dc2626; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">Unlock Full Access (40% Off)</a>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
                    ⏰ This offer expires in 24 hours
                </p>
                
                <p>You've got this, ${firstName}! Go crush it! 🚀</p>
                <p style="margin-bottom: 0;">The FaMED Team</p>
            </div>
        </div>
    `;
}

export function getExamUrgency3Days({ userName, examDate }: CampaignEmailParams): string {
    const firstName = userName.split(" ")[0] || "there";

    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #333;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">⏰ 72 Hours Until Your FaMED Exam</h1>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 18px; margin-top: 0;">Hi ${firstName},</p>
                
                <p>In <strong>3 days</strong>, you'll be sitting your FaMED exam.</p>
                
                <p>Right now, every hour of focused practice counts. This is your absolute last chance to:</p>
                
                <ul style="line-height: 1.8;">
                    <li>Fill knowledge gaps</li>
                    <li>Practice under timed conditions</li>
                    <li>Build exam-day confidence</li>
                </ul>
                
                <div style="background: #ede9fe; border: 2px solid #7c3aed; padding: 20px; margin: 25px 0; border-radius: 8px; text-align: center;">
                    <p style="margin: 0 0 15px 0; font-size: 20px; font-weight: bold; color: #5b21b6;">🎁 LAST CHANCE: 50% Off Premium</p>
                    <p style="margin: 0; color: #5b21b6;">Full access for the next 72 hours</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://famed-vorbereitung.com/pricing?code=LASTCHANCE" style="display: inline-block; background: #7c3aed; color: white; text-decoration: none; padding: 18px 36px; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3);">Get Premium Now</a>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 30px 0;">
                    This is your final opportunity. Offer expires when your exam starts.
                </p>
                
                <p>Walk into that exam room with confidence.</p>
                <p style="margin-bottom: 0;">— The FaMED Team</p>
            </div>
        </div>
    `;
}

/**
 * TIER 1: WELCOME SEQUENCE CAMPAIGNS
 * Triggered automatically for new signups
 */

export function getWelcomeDay0({ userName }: CampaignEmailParams): string {
    const firstName = userName.split(" ")[0] || "there";

    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #333;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">👋 Welcome to FaMED Prep!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 18px; margin-top: 0;">Hi ${firstName},</p>
                
                <p>Welcome to FaMED Prep! We're thrilled to have you here.</p>
                
                <p>Thousands of medical professionals have used our platform to pass their FaMED exam and start practicing medicine in Germany. Now it's your turn.</p>
                
                <div style="background: #dbeafe; padding: 20px; margin: 25px 0; border-radius: 8px;">
                    <p style="margin: 0 0 10px 0; font-weight: 600; color: #1e40af;">🎯 Quick Start Guide:</p>
                    <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
                        <li>Set your exam date (helps us personalize your study plan)</li>
                        <li>Complete your German level assessment</li>
                        <li>Start with 10 practice questions today</li>
                    </ol>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://famed-vorbereitung.com/dashboard" style="display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold;">Get Started Now</a>
                </div>
                
                <p style="font-size: 14px; color: #6b7280;">
                    Over the next few days, I'll send you tips and strategies from doctors who've successfully passed the FaMED exam. Stay tuned!
                </p>
                
                <p>Let's do this!</p>
                <p style="margin-bottom: 0;">The FaMED Team</p>
            </div>
        </div>
    `;
}

// Helper function to get weekday name
function getWeekday(dateString?: string): string {
    if (!dateString) return "week";
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    return days[date.getDay()];
}

/**
 * TIER 1: SUBSCRIPTION EXPIRY REMINDER
 * Triggered 7 days before plan expires
 */

export function getSubscriptionExpiry({ userName, planExpiry, accountType }: CampaignEmailParams): string {
    const firstName = userName.split(" ")[0] || "there";
    const planName = accountType === 'paid_1m' ? '1-Month' : accountType === 'paid_3m' ? '3-Month' : 'Premium';

    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #333;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🔔 Your Premium Access Expires Soon</h1>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #f3f4f6; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 18px; margin-top: 0;">Hi ${firstName},</p>
                
                <p>Your <strong>${planName} Premium plan</strong> will expire on <strong>${planExpiry}</strong> — that's in just 7 days.</p>
                
                <p>Don't lose your progress! When your subscription expires, you'll lose access to:</p>
                
                <ul style="line-height: 1.8;">
                    <li>All premium practice questions</li>
                    <li>Your progress tracking & analytics</li>
                    <li>Exam simulation mode</li>
                    <li>Detailed explanations & study materials</li>
                </ul>
                
                <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 25px 0; border-radius: 4px;">
                    <p style="margin: 0; font-weight: 600; color: #065f46;">💚 Renew now and get 15% off your next month!</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://famed-vorbereitung.com/pricing?renew=true" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">Renew My Subscription</a>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; text-align: center;">
                    Keep up the great work. You're making progress every day!
                </p>
                
                <p style="margin-bottom: 0;">The FaMED Team</p>
            </div>
        </div>
    `;
}
