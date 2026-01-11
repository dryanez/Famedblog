import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(request: Request) {
    try {
        const { description, slug } = await request.json();

        if (!description) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        // Extract keywords from description for better image search
        const keywords = description
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(' ')
            .filter(word => word.length > 3)
            .slice(0, 3)
            .join(',');

        const query = keywords || 'medical education';
        const seed = Date.now();

        // Use Unsplash Source for free, reliable images
        const imageUrl = `https://source.unsplash.com/800x400/?${encodeURIComponent(query)}&sig=${seed}`;

        // Generate a unique filename
        const imageName = `${slug || 'blog'}-${seed}.jpg`;
        const imagePath = `/images/blog/${imageName}`;

        return NextResponse.json({
            success: true,
            imageUrl: imageUrl,
            imageName: imageName,
            imagePath: imagePath,
            description: description
        });

    } catch (error: any) {
        console.error('Image generation error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to generate image',
            success: false
        }, { status: 500 });
    }
}
