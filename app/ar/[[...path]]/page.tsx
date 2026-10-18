import {notFound} from 'next/navigation';import PublicPage,{publicMetadata} from '@/components/PublicPage';import {publicRoutes} from '@/lib/site-pages';
export function generateStaticParams(){return publicRoutes.map(p=>({path:p==='/'?[]:p.slice(1).split('/')}));}
export async function generateMetadata({params}:{params:Promise<{path?:string[]}>}){const route='/'+((await params).path||[]).join('/');return publicMetadata(route,'ar');}
export default async function Page({params}:{params:Promise<{path?:string[]}>}){const route='/'+((await params).path||[]).join('/');if(!publicRoutes.includes(route))notFound();return <PublicPage route={route} locale="ar"/>;}
