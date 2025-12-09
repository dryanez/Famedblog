import { getAllPosts } from '@/lib/posts';
import BlogList from './BlogList';

export const metadata = {
    title: 'FAMED Exam Blog | Study Tips & Guides',
    description: 'Expert tips, study guides, and proven strategies to help you pass the FAMED exam on your first try.',
};

export default function BlogPage() {
    const posts = getAllPosts();
    return <BlogList initialPosts={posts} />;
}
