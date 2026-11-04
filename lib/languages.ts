// @ts-ignore Generated list contains public slugs only, safe for client navigation.
import {spanishSlugs} from './spanish-slugs.mjs';
export type Locale = 'en' | 'ar' | 'es' | 'ru' | 'fr' | 'tr';
export const locales:Locale[]=['en','ar','es','ru','fr','tr'];
export const localeNames:Record<Locale,string>={en:'English',ar:'العربية',es:'Español',ru:'Русский',fr:'Français',tr:'Türkçe'};
export const ogLocales:Record<Locale,string>={en:'en_US',ar:'ar_AR',es:'es_ES',ru:'ru_RU',fr:'fr_FR',tr:'tr_TR'};
export const siteUrl=process.env.NEXT_PUBLIC_SITE_URL||'https://famed-vorbereitung.com';
export const spanishRoutes=['/','/what-is-famed','/lead-magnet','/app','/career','/resources/anamnese'];
/** Russian, French and Turkish have the main pages only; their articles and study guide are still English. */
export const pageOnlyLocales:Locale[]=['ru','fr','tr'];
export const pageOnlyRoutes=spanishRoutes;
export const localePattern=/^\/(ar|es|ru|fr|tr)(?=\/|$)/;
export function hasSpanishVersion(route:string){return spanishRoutes.includes(route)||route==='/blog'||spanishSlugs.some((slug:string)=>route==='/blog/'+slug);}
export function hasVersion(locale:Locale,route:string){
 if(locale==='en'||locale==='ar')return true;
 if(locale==='es')return hasSpanishVersion(route);
 return pageOnlyRoutes.includes(route);
}
export const localePrefix=(locale:Locale)=>locale==='en'?'':'/'+locale;
/** Articles live in en/ar/es; page-only languages link to the English articles. */
export const blogLocale=(locale:Locale):Locale=>pageOnlyLocales.includes(locale)?'en':locale;
/** The study guide PDF and its emails exist in en/ar/es only. */
export const guideLocale=(locale:Locale):'en'|'ar'|'es'=>pageOnlyLocales.includes(locale)?'en':locale as 'en'|'ar'|'es';
export function localeOf(path:string):Locale{return (path.match(localePattern)?.[1] as Locale)||'en';}
export function languageAlternates(path:string){
 const base=path.replace(localePattern,'')||'/';
 const languages:Record<string,string>={};
 for(const locale of locales)if(locale!=='en'&&hasVersion(locale,base))languages[locale]=siteUrl+localePrefix(locale)+(base==='/'?'':base);
 languages.en=siteUrl+base;languages['x-default']=siteUrl+base;
 return {canonical:siteUrl+path,languages};
}
