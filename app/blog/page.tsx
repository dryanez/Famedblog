import {languageAlternates} from '@/lib/languages';
import { getAllPosts } from '@/lib/posts';
import BlogList from './BlogList';

export const metadata = {
    title: 'FaMED Exam Blog | Study Tips & Guides',
    alternates:languageAlternates('/blog'),
    description: 'Expert tips, study guides, and proven strategies to help you pass the FAMED exam on your first try.',
};

export const revalidate = 0;

export default function BlogPage() {
    const posts = getAllPosts().filter(p=>p.status==='published');
    return <BlogList initialPosts={posts} />;
}
