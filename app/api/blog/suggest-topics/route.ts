import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60;

interface TopicSuggestion {
    title: string;
    angle: string;
    keywords: string[];
    searchVolume: 'High' | 'Medium' | 'Low';
}

export async function POST(request: Request) {
    try {
        const { fileUri } = await request.json();

        if (!fileUri) {
            return NextResponse.json({ error: 'File URI is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Analyze this PDF document and suggest 6-8 SEO-optimized blog post ideas for FaMED-Vorbereitung.com (a German medical exam prep site).

For each idea, provide in JSON format:
{
  "topics": [
    {
      "title": "SEO-friendly title in ENGLISH",
      "angle": "What makes this unique/interesting (in ENGLISH)",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "searchVolume": "High" | "Medium" | "Low"
    }
  ]
}

Focus on topics that:
- Help medical students prepare for the FaMED exam
- Are searchable on Google
- Can be created from this document's content
- Use practical, actionable angles
- **Write ALL titles and descriptions in ENGLISH**

Return ONLY valid JSON, no markdown formatting.`;

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: 'application/pdf',
                    fileUri: fileUri
                }
            },
            { text: prompt }
        ]);

        const responseText = result.response.text();

        // Parse JSON response
        let topics: TopicSuggestion[];
        try {
            const parsed = JSON.parse(responseText);
            topics = parsed.topics || [];
        } catch (e) {
            // Try to extract JSON from markdown code blocks
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[1]);
                topics = parsed.topics || [];
            } else {
                throw new Error('Failed to parse AI response as JSON');
            }
        }

        return NextResponse.json({
            success: true,
            topics: topics
        });

    } catch (error: any) {
        console.error('Topic suggestion error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to generate topic suggestions',
            success: false
        }, { status: 500 });
    }
}
