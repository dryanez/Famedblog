import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export const maxDuration = 60;

export async function POST(request: Request) {
    const { description, slug } = await request.json();

    if (!description) {
        return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    try {
        // Use Gemini's Imagen API for image generation
        const prompt = `Create a professional, educational image for a medical exam preparation blog. ${description}. Style: clean, modern, medical education, professional, high quality.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instances: [{
                        prompt: prompt
                    }],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: '16:9'
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Imagen API error:', errorText);
            throw new Error('Image generation failed');
        }

        const data = await response.json();

        if (!data.predictions || data.predictions.length === 0) {
            throw new Error('No images generated');
        }

        // Get base64 image
        const imageBase64 = data.predictions[0].bytesBase64Encoded;
        const imageBuffer = Buffer.from(imageBase64, 'base64');

        // Save to public/images/blog
        const imageName = `${slug || 'blog'}-${Date.now()}.png`;
        const publicPath = path.join(process.cwd(), 'public', 'images', 'blog', imageName);

        await writeFile(publicPath, imageBuffer);

        return NextResponse.json({
            success: true,
            imageName: imageName,
            imagePath: `/images/blog/${imageName}`,
            description: description
        });

    } catch (error: any) {
        console.error('Image generation error:', error);

        // Fallback to Unsplash if Imagen fails
        const keywords = description
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(' ')
            .filter((word: string) => word.length > 3)
            .slice(0, 3)
            .join(',');

        const query = keywords || 'medical education';
        const seed = Date.now();
        const imageUrl = `https://source.unsplash.com/800x400/?${encodeURIComponent(query)}&sig=${seed}`;
        const imageName = `${slug || 'blog'}-${seed}.jpg`;

        return NextResponse.json({
            success: true,
            imageUrl: imageUrl,
            imageName: imageName,
            imagePath: imageUrl,
            description: description
        });
    }
}
