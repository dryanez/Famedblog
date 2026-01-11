import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { description, slug } = await request.json();

        if (!description) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        // Use Gemini's image generation (Imagen)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `Create a professional, educational image for a medical exam preparation blog post. ${description}. Style: clean, modern, medical education, infographic-like.`,
                    numberOfImages: 1,
                    aspectRatio: '16:9',
                    safetySettings: [{
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_ONLY_HIGH'
                    }]
                })
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Image generation failed');
        }

        const data = await response.json();

        if (!data.generatedImages || data.generatedImages.length === 0) {
            throw new Error('No images generated');
        }

        // Return base64 image data
        const imageData = data.generatedImages[0].imageBytes;
        const imageName = `${slug || 'blog'}-${Date.now()}.png`;

        return NextResponse.json({
            success: true,
            imageData: imageData, // base64
            imageName: imageName,
            imagePath: `/images/blog/${imageName}`
        });

    } catch (error: any) {
        console.error('Image generation error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to generate image',
            success: false
        }, { status: 500 });
    }
}
