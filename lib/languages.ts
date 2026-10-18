export type Locale = 'en' | 'ar';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://famed-vorbereitung.com';
export function languageAlternates(path: string) { return {canonical: siteUrl + path, languages: {en:siteUrl + path.replace(/^\/ar(?=\/|$)/,'').replace(/^$/, '/'),ar:siteUrl + '/ar' + path.replace(/^\/ar(?=\/|$)/,'').replace(/^\/$/,''),'x-default':siteUrl + path.replace(/^\/ar(?=\/|$)/,'').replace(/^$/, '/')}}; }
