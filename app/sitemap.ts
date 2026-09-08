import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://famed-vorbereitung.com';
    
    // Filter to only genuine published posts (exclude drafts and thin placeholder posts)
    const publishedPosts = getAllPosts().filter((post) => {
        const isPublished = post.status === 'published';
        const isPlaceholder = 
            post.content.includes('quota was temporarily exceeded') ||
            post.content.includes('placeholder draft');
        return isPublished && !isPlaceholder;
    });

    const blogEntries: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: (() => {
            try {
                const date = new Date(post.date);
                return isNaN(date.getTime()) ? new Date('2026-09-08') : date;
            } catch {
                return new Date('2026-09-08');
            }
        })(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date('2026-09-08'),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date('2026-09-08'),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/what-is-famed`,
            lastModified: new Date('2026-09-08'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/lead-magnet`,
            lastModified: new Date('2026-09-08'),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/career`,
            lastModified: new Date('2026-09-08'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/book`,
            lastModified: new Date('2026-09-08'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/protokoll`,
            lastModified: new Date('2026-09-08'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/app`,
            lastModified: new Date('2026-09-08'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/resources/anamnese`,
            lastModified: new Date('2026-09-08'),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    return [...staticRoutes, ...blogEntries];
}
