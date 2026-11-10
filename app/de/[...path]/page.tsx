import {notFound} from 'next/navigation';import PublicPage,{publicMetadata} from '@/components/PublicPage';import {pageOnlyRoutes} from '@/lib/languages';
// German main pages (the homepage is app/de/page.tsx; articles are under /de/blog).
export function generateStaticParams(){return pageOnlyRoutes.filter(p=>p!=='/').map(p=>({path:p.slice(1).split('/')}));}
export async function generateMetadata({params}:{params:Promise<{path:string[]}>}){const route='/'+(await params).path.join('/');return publicMetadata(route,'de');}
export default async function Page({params}:{params:Promise<{path:string[]}>}){const route='/'+(await params).path.join('/');if(route==='/'||!pageOnlyRoutes.includes(route))notFound();return <PublicPage route={route} locale="de"/>;}
