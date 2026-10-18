'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
export default function BookPromoPopup() {
 const [open,setOpen]=useState(false);
 useEffect(()=>{try{if(localStorage.getItem('famed_book_offer_seen_v2'))return;}catch{return;}const timer=setTimeout(()=>setOpen(true),15000);return()=>clearTimeout(timer);},[]);
 const close=()=>{setOpen(false);try{localStorage.setItem('famed_book_offer_seen_v2','true');}catch{/* optional preference */}};
 if(!open)return null;
 return <aside aria-label="FaMED digitales Buch Angebot" className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl">
  <button aria-label="Buchangebot schließen" onClick={close} className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl text-slate-600 shadow">×</button>
  <Image unoptimized loading="eager" src="/images/products/book-cover.png" alt="FaMED Protokoll Buchcover" width={778} height={1100} className="h-52 w-full bg-slate-800 object-contain" />
  <div className="p-5">
   <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Das digitale FaMED-Fallbuch</p>
   <h2 className="mt-2 text-xl font-bold text-slate-900">FaMED Protokoll 2026</h2>
   <p className="mt-2 text-sm text-slate-600">Digitales Buch · Fälle und Redemittel.</p>
   <p className="mt-3 text-3xl font-bold text-blue-800">€19.99 <span className="text-sm font-normal text-slate-600">Buchangebot</span></p>
   <a href="https://famedtestprep.com/FamedProtokolle?utm_source=blog&utm_medium=popup&utm_campaign=book_only" className="mt-4 inline-block rounded-lg bg-blue-700 px-5 py-3 font-bold text-white">Digitales Buch ansehen →</a>
  </div>
 </aside>;
}
