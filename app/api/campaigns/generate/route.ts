import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getExamUrgency14Days } from '@/lib/campaign-templates';
import { supabase } from '@/lib/supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { campaignName, targetAudience, campaignGoal, tone } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        // Get an example template to show Gemini the style
        const exampleTemplate = getExamUrgency14Days({
            userName: "Dr. Maria Schmidt",
            userEmail: "maria.schmidt@example.com",
            examDate: "2026-01-15",
            daysUntilExam: 14,
            planExpiry: undefined,
            accountType: "free"
        });

        const prompt = `You are an expert email marketing copywriter for FaMED Prep, a German medical exam preparation platform for doctors.

**Task:** Create a complete HTML email campaign.

**Campaign Details:**
- Name: ${campaignName}
- Target Audience: ${targetAudience}
- Campaign Goal: ${campaignGoal}
- Tone: ${tone || 'Professional but warm'}

**CRITICAL: Use this EXACT HTML structure and styling:**
Here's an example template you MUST follow:
${exampleTemplate}

**Requirements:**
1. Keep the EXACT same HTML structure (div containers, classes, inline styles)
2. Keep the gradient header style (linear-gradient)
3. Keep the same color scheme and design elements
4. Use the same layout: header, body content, highlighted boxes, CTA button, footer
5. Use variables like {{name}}, {{exam_date}}, {{days_until_exam}} for personalization
6. The CTA button must link to https://famed-vorbereitung.com/pricing with appropriate discount code
7. Make it compelling and conversion-focused
8. Maximum 600px width
9. Mobile-responsive inline styles

**Important Variables to Include:**
- {{name}} - User's name
- {{exam_date}} - Their exam date (if applicable)
- {{days_until_exam}} - Days until exam (if applicable)

**Output ONLY the complete HTML email. No explanations, no markdown code blocks, just pure HTML.**`;

        let generatedHtml = '';
        let errors: string[] = [];

        // Try Gemini 2.0 Flash first
        try {
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
                generationConfig: {
                    temperature: 0.9,
                    topP: 0.95,
                }
            });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            generatedHtml = response.text();
        } catch (error: any) {
            errors.push(`Flash 2.0 error: ${error.message}`);

            // Fallback to Gemini 2.5 Flash (latest recommended model)
            try {
                const fallbackModel = genAI.getGenerativeModel({
                    model: 'gemini-2.5-flash',
                    generationConfig: {
                        temperature: 0.9,
                        topP: 0.95,
                    }
                });
                const result = await fallbackModel.generateContent(prompt);
                const response = await result.response;
                generatedHtml = response.text();
            } catch (fallbackError: any) {
                errors.push(`Flash 2.5 error: ${fallbackError.message}`);
                throw new Error(`All models failed: ${errors.join(', ')}`);
            }
        }

        // Clean up any markdown artifacts
        generatedHtml = generatedHtml
            .replace(/```html\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        // Save to Supabase
        const { data: savedCampaign, error: dbError } = await supabase
            .from('campaigns')
            .insert({
                name: campaignName,
                target_audience: targetAudience,
                goal: campaignGoal,
                tone: tone,
                content: generatedHtml,
                status: 'draft',
                metadata: { generatedBy: 'gemini' }
            })
            .select()
            .single();

        if (dbError) {
            console.error('Failed to save campaign:', dbError);
            // We don't fail the request, but we include a warning
            return NextResponse.json({
                success: true,
                html: generatedHtml,
                campaignName,
                targetAudience,
                warning: 'Campaign generated but failed to save to database'
            });
        }

        return NextResponse.json({
            success: true,
            id: savedCampaign.id,
            html: generatedHtml,
            campaignName,
            targetAudience
        });

    } catch (error: any) {
        console.error('Campaign generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate campaign' },
            { status: 500 }
        );
    }
}
