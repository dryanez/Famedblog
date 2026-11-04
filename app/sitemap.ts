import type {MetadataRoute} from 'next';
import {getAllPosts} from '@/lib/posts';
import {publicRoutes} from '@/lib/site-pages';
import {getSitePage} from '@/lib/site-pages';
import {siteUrl,locales,hasVersion,localePrefix,languageAlternates} from '@/lib/languages';
export default function sitemap():MetadataRoute.Sitemap {
 const routes=[...publicRoutes.filter(p=>!['/book','/protokoll'].includes(p)),'/blog',...getAllPosts().filter(p=>p.status==='published').map(p=>'/blog/'+p.slug)];
 return routes.flatMap(route=>{
  const post=route.startsWith('/blog/')?getAllPosts().find(p=>route==='/blog/'+p.slug):null;
  const alternates={languages:languageAlternates(route).languages};
  return locales.filter(locale=>hasVersion(locale,route)).map(locale=>{
   const updated=(locale==='es'?'2026-10-21':post?.updated||getSitePage(route,locale)?.updated||getSitePage(route)?.updated||'2026-10-21');
   return {url:siteUrl+localePrefix(locale)+(route==='/'?'':route),lastModified:new Date(updated),changeFrequency:'weekly' as const,priority:route==='/'?1:0.8,alternates};
  });
 });
}
