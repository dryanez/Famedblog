export type Locale = 'en' | 'ar' | 'es';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://famed-vorbereitung.com';
export const spanishRoutes = ['/', '/what-is-famed', '/lead-magnet', '/book', '/app'];
export function languageAlternates(path: string) {
 const base = path.replace(/^\/(ar|es)(?=\/|$)/,'') || '/';
 const languages: Record<string,string> = {en:siteUrl+base, ar:siteUrl+'/ar'+(base==='/'?'':base), 'x-default':siteUrl+base};
 if(spanishRoutes.includes(base)) languages.es=siteUrl+'/es'+(base==='/'?'':base);
 return {canonical: siteUrl+path, languages};
}
