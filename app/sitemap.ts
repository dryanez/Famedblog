import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://famedtestprep.com'
    const posts = getAllPosts()

    const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: (() => {
            try {
                const date = new Date(post.date)
                return isNaN(date.getTime()) ? new Date() : date
            } catch (e) {
                return new Date()
            }
        })(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }))

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/lead-magnet`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
    ]

    return [...staticRoutes, ...blogEntries]
}
