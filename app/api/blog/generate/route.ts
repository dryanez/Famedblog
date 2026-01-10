import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import fs from 'fs';
import path from 'path';

export const maxDuration = 60; // Allow up to 60s for generation

export async function POST(request: Request) {
    try {
        const { topic, additionalContext } = await request.json();

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic is required' },
                { status: 400 }
            );
        }

        console.log(`🤖 Generating blog post for topic: "${topic}"...`);

        // Load FAMED context from public/llms.txt
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

        const prompt = `You are writing a blog post for FaMED-Vorbereitung.com, a German medical licensing exam preparation site.

TOPIC: ${topic}

FAMED CONTEXT (USE THIS AS YOUR KNOWLEDGE BASE):
${famedContext || 'Use general FaMED exam knowledge'}

${additionalContext ? `\n${additionalContext}` : ''}

IMPORTANT REQUIREMENTS:
- Write in German
- Reference the "FaMED Protokoll Book" when giving advice
- Include practical tips for exam preparation  
- Mention communication skills (Anamnese)
- Keep it under 1500 words
- Use markdown format with proper headings
- **ADD 1-2 IMAGE PLACEHOLDERS** throughout the post using this format:
  ![Description of helpful image here](/placeholder-image.jpg)
  Example: ![FaMED Anamnese Struktur Diagram](/images/anamnese-structure.jpg)
- Include frontmatter in this EXACT format:
---
title: "[Your title in German]"
date: "${today}"
excerpt: "[Brief 1-2 sentence summary]"
tags: ["FaMED", "Preparation", "Other relevant tags"]
status: "draft"
---

Generate the complete blog post now, starting with the frontmatter.`;

        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: prompt,
            temperature: 0.7,
        });

        const content = result.text;

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
