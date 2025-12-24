interface EmailTemplateParams {
    segment: "exam_soon" | "sleeping" | "active" | "all" | "paid";
    name: string;
    examDate?: string | null;
    daysUntilExam?: number | null;
}

export function getEmailTemplate({ segment, name, examDate, daysUntilExam }: EmailTemplateParams): string {
    const firstName = name.split(" ")[0] || "Doctor";

    const baseStyle = `
        font-family: sans-serif; 
        color: #333; 
        line-height: 1.6;
        max-width: 600px;
        margin: 0 auto;
    `;

    // Common offer
    const offer = `
        <div style="background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0;">
            <h2 style="color: #db2777; margin: 0 0 10px 0;">🎄 Xmas Special: 50% OFF</h2>
            <p style="margin: 0 0 15px 0;">Use code <strong>XMAS50</strong> at checkout.</p>
            <a href="https://famed-vorbereitung.com/pricing" style="display: inline-block; background: #db2777; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Claim Offer</a>
        </div>
    `;

    if (segment === "exam_soon") {
        // Check if exam is within 2 weeks (14 days)
        const isVeryUrgent = daysUntilExam !== null && daysUntilExam !== undefined && daysUntilExam <= 14;

        if (isVeryUrgent) {
            // Special messaging for exams < 2 weeks
            return `
                <div style="${baseStyle}">
                    <h1>🔔 Hey ${firstName}, Your Test is Around the Corner!</h1>
                    <p style="font-size: 18px; font-weight: 600; color: #d97706; background: #fef3c7; padding: 12px; border-radius: 8px; text-align: center;">
                        Your exam is on <strong>${examDate}</strong> — just ${daysUntilExam} day${daysUntilExam === 1 ? '' : 's'} away! ⏰
                    </p>
                    <p>You are the <strong>perfect student</strong> to make the most of these final days. As your test approaches, it's crucial that you practice <strong>exactly how the test will be on the real day</strong>.</p>
                    <p>That's why we highly recommend our <strong>1-on-1 Computer Simulations</strong> 💻 — they replicate the real exam environment so you can walk in with confidence and zero surprises.</p>
                    <p>To support your final push, here's a special boost:</p>
                    ${offer}
                    <p style="margin-top: 30px;">You've got this, ${firstName}! Go crush it! 🚀</p>
                    <p>The FaMED Team</p>
                </div>
            `;
        } else {
            // Regular exam soon message (within 90 days but > 2 weeks)
            const examInfo = examDate ? `<p style="font-size: 16px; background: #fef3c7; padding: 10px; border-radius: 8px; text-align: center;">Your exam is scheduled for <strong>${examDate}</strong>${daysUntilExam ? ` (${daysUntilExam} days away)` : ''}.</p>` : '';

            return `
                <div style="${baseStyle}">
                    <h1>Final Push, ${firstName}! 🚀</h1>
                    ${examInfo}
                    <p>We noticed your exam is coming up soon. The final weeks are crucial for solidifying your knowledge and building confidence.</p>
                    <p>To help you maximize your preparation, we're giving you a massive boost:</p>
                    ${offer}
                    <p>Good luck with your preparation!</p>
                    <p>The FaMED Team</p>
                </div>
            `;
        }
    }

    if (segment === "sleeping") {
        return `
            <div style="${baseStyle}">
                <h1>It's been a while, ${firstName} 👋</h1>
                <p>We noticed you haven't been active lately. Life as a doctor is busy, we get it.</p>
                <p>But your goals are still waiting. If you've been waiting for a sign to restart, this is it.</p>
                ${offer}
                <p>Hope to see you back!</p>
                <p>The FaMED Team</p>
            </div>
        `;
    }

    // Default / Active
    return `
        <div style="${baseStyle}">
            <h1>Keep it up, ${firstName}! 💪</h1>
            <p>You're doing great with your preparation.</p>
            <p>To celebrate your dedication (and the holidays), here is a special gift.</p>
            ${offer}
            <p>Happy Holidays!</p>
            <p>The FaMED Team</p>
        </div>
    `;
}
