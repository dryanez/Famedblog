import type {MetadataRoute} from 'next';
import {getAllPosts} from '@/lib/posts';
import {publicRoutes} from '@/lib/site-pages';
import {getSitePage} from '@/lib/site-pages';
import {siteUrl,hasSpanishVersion} from '@/lib/languages';
export default function sitemap():MetadataRoute.Sitemap {
 const routes=[...publicRoutes.filter(p=>!['/book','/protokoll'].includes(p)),'/blog',...getAllPosts().filter(p=>p.status==='published').map(p=>'/blog/'+p.slug)];
 return routes.flatMap(route=>{
  const en=siteUrl+(route==='/'?'':route),ar=siteUrl+'/ar'+(route==='/'?'':route),es=siteUrl+'/es'+(route==='/'?'':route);
  const post=route.startsWith('/blog/')?getAllPosts().find(p=>route==='/blog/'+p.slug):null;
  const updated=post?.updated||getSitePage(route)?.updated||'2026-10-21';
  const alternates={languages:{en,ar,...(hasSpanishVersion(route)?{es}:{}),'x-default':en}};
  return [{url:en,lastModified:new Date(updated),changeFrequency:'weekly' as const,priority:route==='/'?1:0.8,alternates},{url:ar,lastModified:new Date(updated),changeFrequency:'weekly' as const,priority:route==='/'?1:0.8,alternates},...(hasSpanishVersion(route)?[{url:es,lastModified:new Date('2026-10-21'),changeFrequency:'weekly' as const,priority:route==='/'?1:0.8,alternates}]:[])];
 });
}
