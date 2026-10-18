import {getAllPosts} from '@/lib/posts';import BlogList from '@/app/blog/BlogList';import {languageAlternates} from '@/lib/languages';
export const metadata={title:'مدونة FaMED: مقالات وأدلة التحضير',description:'مقالات وتدريبات للتحضير للتواصل الطبي باللغة الألمانية.',alternates:languageAlternates('/ar/blog')};
export default function Page(){return <BlogList initialPosts={getAllPosts('ar').filter(p=>p.status==='published')} arabic/>;}
