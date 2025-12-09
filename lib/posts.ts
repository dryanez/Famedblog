import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'blog/posts');

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    readTime: string;
    category: string;
    content: string;
    tags?: string[];
    status?: string;
}

export function getAllPosts(): BlogPost[] {
    // Create dir if not exists
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const matterResult = matter(fileContents);

            const content = matterResult.content;
            // Generate excerpt if not in frontmatter
            const excerpt = matterResult.data.excerpt || content.slice(0, 150).replace(/[#*`_]/g, '') + '...';

            return {
                slug,
                title: matterResult.data.title || 'Untitled',
                date: matterResult.data.date || 'No date',
                readTime: matterResult.data.readTime || '5 min',
                category: matterResult.data.category || 'General',
                content: content,
                excerpt: excerpt,
                tags: matterResult.data.tags || [],
                status: matterResult.data.status || 'draft',
                ...matterResult.data,
            } as BlogPost;
        });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getPostBySlug(slug: string): BlogPost | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);

        if (!fs.existsSync(fullPath)) {
            return null;
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            slug,
            title: matterResult.data.title,
            date: matterResult.data.date,
            readTime: matterResult.data.readTime,
            category: matterResult.data.category,
            content: matterResult.content,
            tags: matterResult.data.tags,
            status: matterResult.data.status,
            ...matterResult.data,
        } as BlogPost;
    } catch (error) {
        return null;
    }
}
