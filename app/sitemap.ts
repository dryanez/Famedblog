import type {MetadataRoute} from 'next';
import {getAllPosts} from '@/lib/posts';
import {publicRoutes} from '@/lib/site-pages';
import {siteUrl,spanishRoutes} from '@/lib/languages';
export default function sitemap():MetadataRoute.Sitemap {
 const routes=[...publicRoutes,'/blog',...getAllPosts().filter(p=>p.status==='published').map(p=>'/blog/'+p.slug)];
 const arabic=new Set(getAllPosts('ar').filter(p=>p.status==='published').map(p=>'/blog/'+p.slug));
 return routes.flatMap(route=>{
  const hasArabic=!route.startsWith('/blog/')||arabic.has(route);
  const en=siteUrl+(route==='/'?'':route);const ar=siteUrl+'/ar'+(route==='/'?'':route);
  const post=route.startsWith('/blog/')?getAllPosts().find(p=>route==='/blog/'+p.slug):null;
  const updated=post?.updated||'2026-10-19';
  const es=siteUrl+'/es'+(route==='/'?'':route);
  const alternates={languages:{en,...(hasArabic?{ar}:{}),...(spanishRoutes.includes(route)?{es}:{}),'x-default':en}};
  return [...(spanishRoutes.includes(route)?[{url:es,lastModified:new Date('2026-10-21'),changeFrequency:'weekly' as const,priority:route==='/'?1:0.8,alternates}]:[]),{url:en,lastModified:new Date(updated),changeFrequency:'weekly' as const,priority:route==='/'?1:0.8,alternates},...(hasArabic?[{url:ar,lastModified:new Date(updated),changeFrequency:'weekly' as const,priority:route==='/'?1:0.8,alternates}]:[])];
 });
}
