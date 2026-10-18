import BlogArticle, {articleMetadata} from '@/components/BlogArticle';
import {getAllPosts} from '@/lib/posts';
export function generateStaticParams(){return getAllPosts('ar').filter(p=>p.status==='published').map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){return articleMetadata((await params).slug,'ar');}
export default async function Page({params}:{params:Promise<{slug:string}>}){return <BlogArticle slug={(await params).slug} locale="ar" />;}
