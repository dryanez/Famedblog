import { NextResponse } from 'next/server';

// Free image search using Unsplash API
// Get a free API key at: https://unsplash.com/developers

export async function POST(request: Request) {
    try {
        const { query, count = 2 } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // Use Unsplash Source for free images (no API key needed)
        // This returns random images matching the query
        const images = [];
        for (let i = 0; i < count; i++) {
            const seed = Date.now() + i; // Different seed for each image
            images.push({
                url: `https://source.unsplash.com/800x400/?${encodeURIComponent(query)}&sig=${seed}`,
                alt: query,
                credit: 'Unsplash'
            });
        }

        return NextResponse.json({
            success: true,
            images: images
        });

    } catch (error: any) {
        console.error('Image search error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
