import GuideReadyPage from '@/components/GuideReadyPage';
import type {Metadata} from 'next';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'FaMED Prep · Guide download',robots:{index:false,follow:false},referrer:'no-referrer'};
export default function Page({searchParams}:{searchParams:Promise<{token?:string;email?:string}>}){return <GuideReadyPage locale="tr" searchParams={searchParams}/>;}
