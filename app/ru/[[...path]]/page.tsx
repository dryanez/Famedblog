import {notFound} from 'next/navigation';import PublicPage,{publicMetadata} from '@/components/PublicPage';import {pageOnlyRoutes} from '@/lib/languages';
// Main pages only; articles and the study guide are linked in English.
export function generateStaticParams(){return pageOnlyRoutes.map(p=>({path:p==='/'?[]:p.slice(1).split('/')}));}
export async function generateMetadata({params}:{params:Promise<{path?:string[]}>}){const route='/'+((await params).path||[]).join('/');return publicMetadata(route,'ru');}
export default async function Page({params}:{params:Promise<{path?:string[]}>}){const route='/'+((await params).path||[]).join('/');if(!pageOnlyRoutes.includes(route))notFound();return <PublicPage route={route} locale="ru"/>;}
