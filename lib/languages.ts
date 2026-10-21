// @ts-ignore Generated list contains public slugs only, safe for client navigation.
import {spanishSlugs} from './spanish-slugs.mjs';
export type Locale = 'en' | 'ar' | 'es';
export const siteUrl=process.env.NEXT_PUBLIC_SITE_URL||'https://famed-vorbereitung.com';
export const spanishRoutes=['/','/what-is-famed','/lead-magnet','/app','/career','/resources/anamnese'];
export function hasSpanishVersion(route:string){return spanishRoutes.includes(route)||route==='/blog'||spanishSlugs.some((slug:string)=>route==='/blog/'+slug);}
export function languageAlternates(path:string){
 const base=path.replace(/^\/(ar|es)(?=\/|$)/,'')||'/';
 const languages:Record<string,string>={en:siteUrl+base,ar:siteUrl+'/ar'+(base==='/'?'':base),'x-default':siteUrl+base};
 if(hasSpanishVersion(base))languages.es=siteUrl+'/es'+(base==='/'?'':base);
 return {canonical:siteUrl+path,languages};
}
