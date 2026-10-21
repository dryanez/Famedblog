import manifest from './generated-content.json';import type {Locale} from './languages';
export const publicRoutes=['/','/what-is-famed','/book','/app','/protokoll','/lead-magnet','/career','/resources/anamnese'];
export function pageKey(route:string){return route==='/'?'home':route.slice(1).replaceAll('/','-');}
export function getSitePage(route:string,locale:Locale='en'){return (manifest.pages[locale] as Record<string,{title:string;excerpt:string;content:string;updated?:string}>)[route]||null;}
