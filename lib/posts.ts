import manifest from './generated-content.json';
import type {Locale} from './languages';

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

export function getAllPosts(locale:Locale='en'):BlogPost[]{return ((manifest.posts as Record<string,BlogPost[]>)[locale]||[]).map(p=>({...p}));}
export function getPostBySlug(slug:string,locale:Locale='en'):BlogPost|null{if(!/^[a-z0-9-]+$/.test(slug))return null;return getAllPosts(locale).find(p=>p.slug===slug)||null;}
