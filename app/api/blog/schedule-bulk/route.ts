import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const maxDuration = 300; // 5 minutes for generating 7 posts

export async function POST(request: Request) {
    try {
        const { topics, pdfUri, pdfName, startDate } = await request.json();

        if (!topics || !Array.isArray(topics) || topics.length === 0) {
            return NextResponse.json({ error: 'Topics array is required' }, { status: 400 });
        }

        const results = [];
        const baseDate = startDate ? new Date(startDate) : new Date();
        baseDate.setHours(9, 0, 0, 0); // Schedule for 9 AM

        // Load FAMED context
        let famedContext = '';
        try {
            const contextPath = path.join(process.cwd(), 'public', 'llms.txt');
            if (fs.existsSync(contextPath)) {
                famedContext = fs.readFileSync(contextPath, 'utf8');
            }
        } catch (e) {
            console.warn('Could not load FAMED context file');
        }

        for (let i = 0; i < topics.length; i++) {
            const topic = topics[i];
            const scheduledDate = new Date(baseDate);
            scheduledDate.setDate(scheduledDate.getDate() + i); // Add i days

            try {
                // Generate blog post content
                const content = await generateBlogPost(topic, famedContext, pdfUri);

                // Create slug
                const slug = topic.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');

                // Save to Supabase
                const { data, error } = await supabase
                    .from('blog_posts')
                    .insert([{
                        slug,
                        title: topic.title,
                        content,
                        excerpt: topic.angle,
                        tags: ['FaMED', 'Preparation', ...topic.keywords.slice(0, 3)],
                        status: 'scheduled',
                        scheduled_date: scheduledDate.toISOString(),
                        pdf_uri: pdfUri,
                        pdf_name: pdfName,
                        selected_topic: topic
                    }])
                    .select()
                    .single();

                if (error) throw error;

                results.push({
                    success: true,
                    topic: topic.title,
                    scheduledDate: scheduledDate.toISOString(),
                    post: data
                });

            } catch (error: any) {
                console.error(`Failed to schedule topic ${i}:`, error);
                results.push({
                    success: false,
                    topic: topic.title,
                    error: error.message
                });
            }
        }

        const successCount = results.filter(r => r.success).length;

        return NextResponse.json({
            success: true,
            scheduled: successCount,
            total: topics.length,
            results
        });

    } catch (error: any) {
        console.error('Bulk schedule error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to schedule posts',
            success: false
        }, { status: 500 });
    }
}

async function generateBlogPost(topic: any, famedContext: string, pdfUri?: string): Promise<string> {
    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are writing a blog post for FaMED-Vorbereitung.com, a German medical exam preparation site.

TOPIC: ${topic.title}

ANGLE: ${topic.angle}
KEYWORDS: ${topic.keywords.join(', ')}

FAMED CONTEXT (USE THIS AS YOUR KNOWLEDGE BASE):
${famedContext || 'Use general FaMED exam knowledge'}

IMPORTANT REQUIREMENTS:
- **Write in ENGLISH** (not German)
- When mentioning the "FaMED Protokoll Book", link it naturally: [FaMED Protokoll Book](https://famedtestprep.com/protokoll)
- When suggesting practice or simulation, link to the app: [FaMED App](https://famedtestprep.com)
- Include practical tips for exam preparation  
- Mention communication skills (Anamnese)
- Keep it under 1500 words
- Use markdown format with proper headings
- **ADD 1-2 IMAGE PLACEHOLDERS** throughout the post using this format:
  ![Description of helpful image here](/placeholder-image.jpg)
- Include frontmatter in this EXACT format:
---
title: "${topic.title}"
date: "${today}"
excerpt: "${topic.angle}"
tags: ["FaMED", "Preparation", ${topic.keywords.slice(0, 3).map((k: string) => `"${k}"`).join(', ')}]
status: "draft"
---

**CRITICAL: At the END of the blog post, add this exact CTA section:**

---

## Ready to Start?

📱 **[Download the FaMED App](https://famedtestprep.com)** for instant access to simulate the test  
📚 **[Order the FaMED Protokoll 2026 Book](https://famedtestprep.com/protokoll)** with all the cases  
👥 **Join our FaMED Study Community** for support and updates

**Viel Erfolg!** (Good luck!)

*Have questions about FaMED preparation? Leave a comment below or join our study group!*

---

Generate the complete blog post now, starting with the frontmatter.`;

    if (pdfUri) {
        // Use Gemini File API for PDF-based generation
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: 'application/pdf',
                    fileUri: pdfUri
                }
            },
            { text: prompt }
        ]);

        return result.response.text();
    } else {
        // Use Vercel AI SDK for text-based generation
        const { google } = await import('@ai-sdk/google');
        const { generateText } = await import('ai');

        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: prompt,
            temperature: 0.7,
        });

        return result.text;
    }
}
