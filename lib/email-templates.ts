export function getEmailTemplate(segment: "exam_soon" | "sleeping" | "active" | "all", name: string) {
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
        return `
            <div style="${baseStyle}">
                <h1>Final Push, ${firstName}? 🚀</h1>
                <p>We noticed your exam is coming up soon. The final weeks are crucial.</p>
                <p>To help you maximize your preparation, we're giving you a massive boost.</p>
                ${offer}
                <p>Good luck!</p>
                <p>The FaMED Team</p>
            </div>
        `;
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
            <p>Frohe Weihnachten!</p>
            <p>The FaMED Team</p>
        </div>
    `;
}
