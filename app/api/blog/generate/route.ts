import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { topic, additionalContext, fileUri, selectedTopic } = await request.json();

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic is required' },
                { status: 400 }
            );
        }

        console.log(`🤖 Generating blog post for topic: "${topic}"...`);

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

        const today = new Date().toISOString().split('T')[0];

        let prompt = `You are writing a blog post for FaMED-Vorbereitung.com, a German medical exam preparation site.

TOPIC: ${topic}

FAMED CONTEXT (USE THIS AS YOUR KNOWLEDGE BASE):
${famedContext || 'Use general FaMED exam knowledge'}

${additionalContext ? `\n${additionalContext}` : ''}

${selectedTopic ? `\nSELECTED ANGLE: ${selectedTopic.angle}\nTARGET KEYWORDS: ${selectedTopic.keywords?.join(', ')}` : ''}

IMPORTANT REQUIREMENTS:
- **Write the blog post body in ENGLISH** (not German)
- **KEEP all German medical phrases, interview questions, and clinical terminology in German** — this is for a German medical exam (FaMED/Fachsprachprüfung), so all example patient questions and medical German terms must remain in German
- When mentioning the "FaMED Protokoll Book", link it naturally: [FaMED Protokoll Book](https://famedtestprep.com/protokoll)
- When suggesting practice or simulation, link to the app: [FaMED App](https://famedtestprep.com)
- Include practical tips for exam preparation  
- Mention communication skills (Anamnese)
- Keep it under 1500 words
- Use markdown format with proper headings
- **ADD 1-2 IMAGE PLACEHOLDERS** throughout the post using this format:
  ![Description of helpful image here](/placeholder-image.jpg)
  Example: ![FaMED Anamnese Structure Diagram](/placeholder-image.jpg)
- Include frontmatter in this EXACT format (do NOT wrap in code fences):
---
title: "${selectedTopic?.title || topic}"
date: "${today}"
excerpt: "[Brief 1-2 sentence summary in English]"
tags: ["FaMED", "Preparation", "Other relevant tags"]
status: "draft"
---

**CRITICAL: Do NOT wrap the output in markdown code fences (\`\`\`markdown). Output the raw markdown directly, starting with the --- frontmatter delimiter.**

**CRITICAL: At the END of the blog post, add this exact Resources and CTA section with emojis:**

## Resources 📚

*   📖 FaMED Protocol Book: https://famedtestprep.com/famedprotokolle
*   💻 FaMED App & Simulation: https://famedtestprep.com
*   💬 Telegram Group: https://t.me/+vgtsHuqtwfk4MTJh

---

## Ready to Start? 🚀

📱 **[Download the FaMED App](https://famed-vorbereitung.com/app)** for instant access to simulate the test  
📚 **[Order the FaMED Protokoll 2026 Book](https://famed-vorbereitung.com/protokoll)** with all the cases  
👥 **Join our FaMED Study Community** for support and updates

**Viel Erfolg!** (Good luck!) 🍀

*Have questions about FaMED preparation? Leave a comment below or join our study group!*

---

Generate the complete blog post now, starting with the frontmatter.`;

        let content: string;

        if (fileUri) {
            // Use Gemini File API for PDF-based generation
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const result = await model.generateContent([
                {
                    fileData: {
                        mimeType: 'application/pdf',
                        fileUri: fileUri
                    }
                },
                { text: prompt }
            ]);

            content = result.response.text();
        } else {
            // Use Vercel AI SDK for text-based generation
            const { google } = await import('@ai-sdk/google');
            const { generateText } = await import('ai');

            const result = await generateText({
                model: google('gemini-2.5-flash'),
                prompt: prompt,
                temperature: 0.7,
            });

            content = result.text;
        }

        return NextResponse.json({
            success: true,
            topic: topic,
            content: content
        });

    } catch (error: any) {
        console.error('Generate API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
