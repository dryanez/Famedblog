'use client';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {X} from 'lucide-react';
import BookCheckout from './BookCheckout';
import {localeOf,localePattern,type Locale} from '@/lib/languages';
// Book offer popup (owner request, 4 November): only on blog articles, once the reader is 60% through the article text, at most once a week.
const SEEN='famed-book-popup',WEEK=7*864e5,READ=0.6;
export const bookOffer:Record<Locale,{badge:string;eyebrow:string;cases:string;text:string;close:string}>={
 en:{badge:'50% off',eyebrow:'Limited offer',cases:'All current cases seen on the exam',text:'The digital case book in German: cases, useful phrases and conversation structures for Anamnese, Aufklärung, Arzt–Arzt and Arztbrief.',close:'Close'},
 ar:{badge:'خصم 50%',eyebrow:'عرض محدود',cases:'جميع الحالات الحالية التي ظهرت في الامتحان',text:'كتاب الحالات الرقمي بالألمانية: حالات وعبارات مفيدة وبنية المحادثة لـ Anamnese وAufklärung وArzt–Arzt وArztbrief.',close:'إغلاق'},
 es:{badge:'50 % de descuento',eyebrow:'Oferta limitada',cases:'Todos los casos actuales vistos en el examen',text:'El libro digital de casos en alemán: casos, frases útiles y estructuras de conversación para Anamnese, Aufklärung, Arzt–Arzt y Arztbrief.',close:'Cerrar'},
 ru:{badge:'Скидка 50%',eyebrow:'Ограниченное предложение',cases:'Все актуальные случаи с экзамена',text:'Электронная книга на немецком: клинические случаи, полезные фразы и структура разговора для Anamnese, Aufklärung, Arzt–Arzt и Arztbrief.',close:'Закрыть'},
 fr:{badge:'-50 %',eyebrow:'Offre limitée',cases:'Tous les cas actuels vus à l’examen',text:'Le livre numérique de cas en allemand : cas, expressions utiles et structures d’entretien pour Anamnese, Aufklärung, Arzt–Arzt et Arztbrief.',close:'Fermer'},
 tr:{badge:'%50 indirim',eyebrow:'Sınırlı teklif',cases:'Sınavda görülen tüm güncel vakalar',text:'Almanca dijital vaka kitabı: Anamnese, Aufklärung, Arzt–Arzt ve Arztbrief için vakalar, faydalı ifadeler ve görüşme yapıları.',close:'Kapat'},
};
export default function BookPromoPopup(){
 const path=usePathname(),locale=localeOf(path),c=bookOffer[locale],base=path.replace(localePattern,'')||'/';
 const [open,setOpen]=useState(false);
 useEffect(()=>{
  if(!/^\/blog\/[^/]+$/.test(base))return;
  try{if(Date.now()-Number(localStorage.getItem(SEEN)||0)<WEEK)return;}catch{}
  const onScroll=()=>{
   const article=document.querySelector('.prose');if(!article)return;
   const box=article.getBoundingClientRect();
   if((innerHeight-box.top)/box.height<READ)return;
   window.removeEventListener('scroll',onScroll);setOpen(true);try{localStorage.setItem(SEEN,String(Date.now()));}catch{}
  };
  window.addEventListener('scroll',onScroll,{passive:true});
  return()=>window.removeEventListener('scroll',onScroll);
 },[base]);
 useEffect(()=>{
  if(!open)return;
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false);};window.addEventListener('keydown',onKey);
  return()=>window.removeEventListener('keydown',onKey);
 },[open]);
 if(!open)return null;
 return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/60 p-3 sm:items-center sm:p-6" onClick={e=>{if(e.target===e.currentTarget)setOpen(false);}}>
  <div role="dialog" aria-modal="true" aria-labelledby="book-offer-title" dir={locale==='ar'?'rtl':'ltr'} className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
   <button type="button" onClick={()=>setOpen(false)} aria-label={c.close} className="absolute end-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-600 hover:bg-slate-100"><X aria-hidden="true" className="h-5 w-5"/></button>
   <div className="grid sm:grid-cols-[220px_minmax(0,1fr)]">
    <div className="relative flex items-center justify-center bg-[#f4f8fd] px-6 pb-4 pt-8 sm:py-10">
     {/* eslint-disable-next-line @next/next/no-img-element */}
     <img src="/images/products/book-cover.png" alt="FaMED Protokoll 2026" width={778} height={1100} className="w-28 -rotate-3 rounded-sm shadow-2xl shadow-slate-900/30 sm:w-40"/>
     <span className="absolute start-4 top-4 rounded-full bg-[#ed574b] px-3 py-1.5 text-sm font-extrabold text-white shadow-lg">{c.badge}</span>
    </div>
    <div className="p-6 sm:p-8">
     <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{c.eyebrow}</p>
     <h2 id="book-offer-title" className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">FaMED Protokoll 2026</h2>
     <p className="mt-2 text-lg font-bold text-blue-700">{c.cases}</p>
     <p className="mb-4 mt-2 leading-relaxed text-slate-600">{c.text}</p>
     <BookCheckout locale={locale} id="popup"/>
    </div>
   </div>
  </div>
 </div>;
}
