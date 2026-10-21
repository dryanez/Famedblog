'use client';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import { useEffect, useState } from 'react';
export default function BookPromoPopup() {
 const pathname = usePathname();
 const arabic = pathname.startsWith('/ar'); const spanish=pathname.startsWith('/es');
 const route = pathname.replace(/^\/(ar|es)(?=\/|$)/, '');
 const appPage = route === '/app' || route === '/blog/famed-prep-app-so-funktionierts';
 const [open,setOpen]=useState(false);
 useEffect(()=>{if(appPage)return;try{if(localStorage.getItem('famed_book_offer_seen_v2'))return;}catch{return;}const timer=setTimeout(()=>setOpen(true),15000);return()=>clearTimeout(timer);},[appPage]);
 const close=()=>{setOpen(false);try{localStorage.setItem('famed_book_offer_seen_v2','true');}catch{/* optional preference */}};
 if(appPage||!open)return null;
 return <aside aria-label="FaMED digital book offer" className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl">
  <button aria-label={arabic?'إغلاق عرض الكتاب':spanish?'Cerrar oferta del libro':'Close book offer'} onClick={close} className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl text-slate-600 shadow">×</button>
  <Image unoptimized loading="eager" src="/images/products/book-cover.png" alt="FaMED Protokoll 2026 book cover" width={778} height={1100} className="h-52 w-full bg-slate-800 object-contain" />
  <div className="p-5">
   <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{arabic?'كتاب FaMED الرقمي للحالات':spanish?'El libro digital de casos FaMED':'The digital FaMED case book'}</p>
   <h2 className="mt-2 text-xl font-bold text-slate-900">FaMED Protokoll 2026</h2>
   <p className="mt-2 text-sm text-slate-600">{arabic?'كتاب رقمي · حالات وعبارات مفيدة.':spanish?'Libro digital en alemán · Casos y expresiones útiles.':'Digital book · Cases and useful phrases.'}</p>
   <p className="mt-3 text-3xl font-bold text-blue-800">€19.99 <span className="text-sm font-normal text-slate-600">{arabic?'عرض الكتاب':spanish?'Oferta del libro':'Book offer'}</span></p>
   <a href="https://www.paypal.com/ncp/payment/DQCLR47JB5DXU?utm_source=blog&utm_medium=popup&utm_campaign=book_only" className="mt-4 inline-block rounded-lg bg-blue-700 px-5 py-3 font-bold text-white">{arabic?'اشترِ الكتاب الرقمي':spanish?'Ver libro digital →':'View digital book →'}</a>
  </div>
 </aside>;
}
