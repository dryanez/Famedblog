'use client';
import {useEffect,useRef} from 'react';
export default function GuideDownload({url,label}:{url:string;label:string}){
 const link=useRef<HTMLAnchorElement>(null);
 useEffect(()=>{const key='famed-guide-auto:'+url;if(sessionStorage.getItem(key))return;const timer=setTimeout(()=>{sessionStorage.setItem(key,'1');link.current?.click();},600);return()=>clearTimeout(timer);},[url]);
 return <a ref={link} href={url} download className="mt-6 inline-block rounded-xl bg-blue-700 px-8 py-4 text-lg font-bold text-white shadow-sm hover:bg-blue-800">{label}</a>;
}
