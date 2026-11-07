import type {Locale} from './languages';
const APP = 'https://famedtestprep.com';

/** Which free app exercise matches an article. All of these open without an account (guest mode). */
export function appPracticePath(slug:string){
 const s=slug.toLowerCase();
 if(/aufklaer/.test(s))return '/aufklaerung';
 if(/arztbrief|soap|dokumentation|konjunktiv/.test(s))return '/brief';
 if(/kardiologie|akutes-abdomen|faelle|differentialdiagnose|rollenspiel/.test(s))return '/medicalcases';
 if(/anamne|patientensprache|red-flags|b-symptoms|pain|neurolog|oncolog|traumatolog|fachbegriffe/.test(s))return '/anamnese';
 return '/dashboard';
}

/** Tag a link to the app so PostHog and the checkout attribute the visit to the blog article. */
function tag(url:URL,slug:string,locale:Locale,medium:string){
 url.searchParams.set('utm_source','blog');
 url.searchParams.set('utm_medium',medium);
 url.searchParams.set('utm_campaign','blog_to_app');
 url.searchParams.set('utm_content',slug);
 url.searchParams.set('utm_locale',locale);
 return url.toString();
}

/** Link straight into the app exercise for this article (used by the in-article practice box). */
export function appPracticeUrl(slug:string,locale:Locale){
 return tag(new URL(appPracticePath(slug),APP),slug,locale,'article_practice_box');
}

// Sales/landing pages that cold readers bounced off (Bundle/Upgrade: ~9% tried the app vs 100% from /dashboard).
const GENERIC=new Set(['','/','/home','/bundle','/upgrade','/pricing','/holidayspecial']);

/** Article links to famedtestprep.com: send generic/sales links into the matching exercise, keep specific app pages. */
export function articleDestination(href:string|undefined,slug:string,locale:Locale){
 if(!href)return href;
 try{
  const url=new URL(href);
  if(url.hostname!=='famedtestprep.com'&&url.hostname!=='www.famedtestprep.com')return href;
  if(GENERIC.has(url.pathname.toLowerCase().replace(/\/$/,''))){url.pathname=appPracticePath(slug);url.search='';}
  return tag(url,slug,locale,'article_link');
 }catch{return href;}
}
