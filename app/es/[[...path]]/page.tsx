import {notFound} from 'next/navigation';import PublicPage,{publicMetadata} from '@/components/PublicPage';import {spanishRoutes} from '@/lib/languages';

export function generateStaticParams(){return spanishRoutes.map(p=>({path:p==='/'?[]:p.slice(1).split('/')}));}
export async function generateMetadata({params}:{params:Promise<{path?:string[]}>}){const route='/'+((await params).path||[]).join('/');return publicMetadata(route,'es');}
export default async function Page({params}:{params:Promise<{path?:string[]}>}){const route='/'+((await params).path||[]).join('/');if(!spanishRoutes.includes(route)&&!['/book','/protokoll'].includes(route))notFound();return <PublicPage route={route} locale="es"/>;}
