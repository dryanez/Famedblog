import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with user's API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { content, campaignId } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are an expert email marketing copywriter specializing in educational SaaS products for medical professionals.

I have an email campaign for FaMED Prep (a German medical exam preparation platform). Please refine and improve the email content while maintaining the HTML structure.

**Goals:**
- Increase urgency and emotional appeal
- Improve clarity and readability
- Keep the same HTML structure and styling
- Make the CTA (call-to-action) more compelling
- Ensure the tone is professional but warm
- Keep all links and formatting intact

**Current Email HTML:**
${content}

**Instructions:**
1. Return ONLY the improved HTML (no explanations)
2. Keep the exact same structure and CSS classes
3. Improve the copy for better conversions
4. Don't change any URLs or email addresses
5. Make it more persuasive and action-oriented`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const refinedContent = response.text();

        return NextResponse.json({
            success: true,
            refinedContent: refinedContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim()
        });

    } catch (error: any) {
        console.error('Gemini API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to refine content' },
            { status: 500 }
        );
    }
}
