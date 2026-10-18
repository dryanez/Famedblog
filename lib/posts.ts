import manifest from './generated-content.json';

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    updated?: string;
    readTime: string;
    category: string;
    content: string;
    excerpt: string;
    tags?: string[];
    status?: string;
}

export function getAllPosts(locale:'en'|'ar'='en'):BlogPost[]{return manifest.posts[locale].map(p=>({...p})) as BlogPost[];}
export function getPostBySlug(slug:string,locale:'en'|'ar'='en'):BlogPost|null{if(!/^[a-z0-9-]+$/.test(slug))return null;return getAllPosts(locale).find(p=>p.slug===slug)||null;}
