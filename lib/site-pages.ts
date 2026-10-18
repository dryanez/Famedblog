import fs from 'fs';import path from 'path';import matter from 'gray-matter';import type {Locale} from './languages';
export const publicRoutes=['/','/what-is-famed','/book','/app','/protokoll','/lead-magnet','/career','/resources/anamnese'];
export function pageKey(route:string){return route==='/'?'home':route.slice(1).replaceAll('/','-');}
export function getSitePage(route:string,locale:Locale='en'){if(!publicRoutes.includes(route))return null;const f=path.join(process.cwd(),'content/pages',locale,pageKey(route)+'.md');if(!fs.existsSync(f))return null;const v=matter(fs.readFileSync(f,'utf8'));return {title:String(v.data.title),excerpt:String(v.data.excerpt),content:v.content};}
