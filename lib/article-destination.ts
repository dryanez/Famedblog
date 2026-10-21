/** Carry only a public article slug and language to the existing app purchase session. */
export function articleDestination(href:string|undefined,slug:string,locale:'en'|'ar'|'es'){
 if(!href)return href;try{const url=new URL(href);if(url.hostname!=='famedtestprep.com')return href;url.searchParams.set('utm_source','blog');url.searchParams.set('utm_content',slug);url.searchParams.set('utm_locale',locale);return url.toString();}catch{return href;}
}
