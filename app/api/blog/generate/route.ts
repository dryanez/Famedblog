import { buildBlogEditorialPrompt } from '@/lib/blog-editorial-prompt';
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

        const prompt = buildBlogEditorialPrompt(
            { title: selectedTopic?.title || topic, angle: selectedTopic?.angle, keywords: selectedTopic?.keywords },
            today, famedContext, additionalContext || ''
        );

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
