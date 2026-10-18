'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
// @ts-ignore Pure shared module is covered by Node tests.
import {discoverySource} from '@/lib/discovery-source.mjs';
/** Anonymous aggregate events; no cookies, identifiers or full referrers are sent. */
export default function DiscoveryTracker(){
 const path=usePathname();
 useEffect(()=>{
  if(navigator.doNotTrack==='1'||Reflect.get(navigator,'globalPrivacyControl')===true)return;
  const source=discoverySource(document.referrer);const played=new WeakSet();
  const send=(event:string)=>{void fetch('/api/discovery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path,source,event}),keepalive:true,credentials:'omit'}).catch(()=>{});};
  send('page_view');
  const click=(e:MouseEvent)=>{const a=(e.target as Element)?.closest?.('a');if(!a)return;let url;try{url=new URL(a.href);}catch{return;}
   if(url.hostname==='www.paypal.com'&&url.pathname==='/ncp/payment/DQCLR47JB5DXU')send('book_click');
   else if(url.hostname==='famedtestprep.com')send('app_click');
  };
  const play=(e:Event)=>{if(e.target instanceof HTMLVideoElement&&!played.has(e.target)){played.add(e.target);send('video_play');}};
  document.addEventListener('click',click);document.addEventListener('play',play,true);
  return()=>{document.removeEventListener('click',click);document.removeEventListener('play',play,true);};
 },[path]);return null;
}
