'use client';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {X} from 'lucide-react';
import {localeOf,localePattern,type Locale} from '@/lib/languages';
// Book offer popup (owner request, 4 November): only on blog articles, once the reader is 60% through the article text, at most once a week.
// Payment runs on this site through PayPal buttons; /api/book-checkout passes it to the app's guest checkout, which emails the book.
const WAS='39,99 €',NOW='19,99 €',SEEN='famed-book-popup',WEEK=7*864e5,READ=0.6;
const copy:Record<Locale,{badge:string;eyebrow:string;cases:string;text:string;name:string;email:string;sent:string;close:string;thanks:string;invalid:string;failed:string}>={
 en:{badge:'50% off',eyebrow:'Limited offer',cases:'All current cases seen on the exam',text:'The digital case book in German: cases, useful phrases and conversation structures for Anamnese, Aufklärung, Arzt–Arzt and Arztbrief.',name:'First name',email:'Email address',sent:'Sent to your email right after payment.',close:'Close',thanks:'Thank you! Your book is on its way to',invalid:'Please enter your first name and a valid email first.',failed:'The payment could not be completed. Please try again.'},
 ar:{badge:'خصم 50%',eyebrow:'عرض محدود',cases:'جميع الحالات الحالية التي ظهرت في الامتحان',text:'كتاب الحالات الرقمي بالألمانية: حالات وعبارات مفيدة وبنية المحادثة لـ Anamnese وAufklärung وArzt–Arzt وArztbrief.',name:'الاسم الأول',email:'البريد الإلكتروني',sent:'يُرسل إلى بريدك فور الدفع.',close:'إغلاق',thanks:'شكراً لك! الكتاب في طريقه إلى',invalid:'يرجى إدخال اسمك الأول وبريد إلكتروني صحيح أولاً.',failed:'تعذّر إتمام الدفع. حاول مرة أخرى.'},
 es:{badge:'50 % de descuento',eyebrow:'Oferta limitada',cases:'Todos los casos actuales vistos en el examen',text:'El libro digital de casos en alemán: casos, frases útiles y estructuras de conversación para Anamnese, Aufklärung, Arzt–Arzt y Arztbrief.',name:'Nombre',email:'Correo electrónico',sent:'Se envía a tu correo justo después del pago.',close:'Cerrar',thanks:'¡Gracias! Tu libro va de camino a',invalid:'Introduce primero tu nombre y un correo válido.',failed:'No se pudo completar el pago. Inténtalo de nuevo.'},
 ru:{badge:'Скидка 50%',eyebrow:'Ограниченное предложение',cases:'Все актуальные случаи с экзамена',text:'Электронная книга на немецком: клинические случаи, полезные фразы и структура разговора для Anamnese, Aufklärung, Arzt–Arzt и Arztbrief.',name:'Имя',email:'Электронная почта',sent:'Отправляется на почту сразу после оплаты.',close:'Закрыть',thanks:'Спасибо! Книга отправлена на адрес',invalid:'Сначала введите имя и корректный адрес почты.',failed:'Не удалось завершить оплату. Попробуйте ещё раз.'},
 fr:{badge:'-50 %',eyebrow:'Offre limitée',cases:'Tous les cas actuels vus à l’examen',text:'Le livre numérique de cas en allemand : cas, expressions utiles et structures d’entretien pour Anamnese, Aufklärung, Arzt–Arzt et Arztbrief.',name:'Prénom',email:'Adresse e-mail',sent:'Envoyé par e-mail juste après le paiement.',close:'Fermer',thanks:'Merci ! Votre livre est en route vers',invalid:'Indiquez d’abord votre prénom et une adresse e-mail valide.',failed:'Le paiement n’a pas pu aboutir. Veuillez réessayer.'},
 tr:{badge:'%50 indirim',eyebrow:'Sınırlı teklif',cases:'Sınavda görülen tüm güncel vakalar',text:'Almanca dijital vaka kitabı: Anamnese, Aufklärung, Arzt–Arzt ve Arztbrief için vakalar, faydalı ifadeler ve görüşme yapıları.',name:'Ad',email:'E-posta adresi',sent:'Ödemeden hemen sonra e-postanıza gönderilir.',close:'Kapat',thanks:'Teşekkürler! Kitabınız şu adrese gönderiliyor:',invalid:'Lütfen önce adınızı ve geçerli bir e-posta adresi girin.',failed:'Ödeme tamamlanamadı. Lütfen tekrar deneyin.'},
};
type PayPal={Buttons:(o:object)=>{render:(el:HTMLElement)=>Promise<void>}};
const checkout=async(body:object)=>{const res=await fetch('/api/book-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await res.json().catch(()=>({}));if(!res.ok||!data.success)throw Error(data.error||'failed');return data;};
function loadPayPal(clientId:string){
 const w=window as unknown as {paypal?:PayPal};if(w.paypal)return Promise.resolve(w.paypal);
 return new Promise<PayPal>((resolve,reject)=>{const s=document.createElement('script');s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture&components=buttons`;s.onload=()=>w.paypal?resolve(w.paypal):reject(Error('PayPal unavailable'));s.onerror=reject;document.head.appendChild(s);});
}
export default function BookPromoPopup(){
 const path=usePathname(),locale=localeOf(path),c=copy[locale],base=path.replace(localePattern,'')||'/';
 const [open,setOpen]=useState(false),[error,setError]=useState(''),[done,setDone]=useState('');
 const nameRef=useRef(''),emailRef=useRef(''),buttons=useRef<HTMLDivElement>(null),rendered=useRef(false);
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
  if(!rendered.current&&buttons.current){rendered.current=true;const target=buttons.current;
   checkout({step:'config'}).then(cfg=>loadPayPal(cfg.clientId)).then(paypal=>paypal.Buttons({
    style:{layout:'vertical',shape:'rect',label:'pay'},
    onClick:(_:unknown,actions:{reject:()=>void;resolve:()=>void})=>{const ok=nameRef.current.trim()&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRef.current.trim());setError(ok?'':c.invalid);return ok?actions.resolve():actions.reject();},
    createOrder:async()=>(await checkout({step:'create',firstName:nameRef.current.trim(),email:emailRef.current.trim().toLowerCase()})).orderId,
    onApprove:async(data:{orderID:string})=>{try{const r=await checkout({step:'capture',orderId:data.orderID});setDone(r.email||emailRef.current);}catch{setError(c.failed);}},
    onError:()=>setError(c.failed),
   }).render(target)).catch(()=>setError(c.failed));}
  return()=>window.removeEventListener('keydown',onKey);
 },[open,c]);
 if(!open&&!done)return null;
 return <div className={open?'fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/60 p-3 sm:items-center sm:p-6':'hidden'} onClick={e=>{if(e.target===e.currentTarget)setOpen(false);}}>
  <div role="dialog" aria-modal="true" aria-labelledby="book-offer-title" dir={locale==='ar'?'rtl':'ltr'} className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
   <button type="button" onClick={()=>setOpen(false)} aria-label={c.close} className="absolute end-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-600 hover:bg-slate-100"><X aria-hidden="true" className="h-5 w-5"/></button>
   <div className="grid sm:grid-cols-[220px_minmax(0,1fr)]">
    <div className="relative flex items-center justify-center bg-[#f4f8fd] px-6 pb-4 pt-8 sm:py-10">
     {/* eslint-disable-next-line @next/next/no-img-element */}
     <img src="/images/products/book-cover.png" alt="FaMED Protokoll 2026" width={778} height={1100} className="w-28 -rotate-3 rounded-sm shadow-2xl shadow-slate-900/30 sm:w-40"/>
     <span className="absolute start-4 top-4 rounded-full bg-[#ed574b] px-3 py-1.5 text-sm font-extrabold text-white shadow-lg">{c.badge}</span>
    </div>
    <div className="p-6 sm:p-8">
     {done?<div role="status" className="py-6"><h2 id="book-offer-title" className="text-2xl font-extrabold text-slate-900">FaMED Protokoll 2026</h2><p className="mt-4 text-lg leading-relaxed text-slate-700">{c.thanks} <strong>{done}</strong>.</p></div>:<>
      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{c.eyebrow}</p>
      <h2 id="book-offer-title" className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">FaMED Protokoll 2026</h2>
      <p className="mt-2 text-lg font-bold text-blue-700">{c.cases}</p><p className="mt-2 leading-relaxed text-slate-600">{c.text}</p>
      <p className="mt-4 flex items-baseline gap-3"><span className="text-4xl font-extrabold text-slate-900">{NOW}</span><s className="text-lg text-slate-500">{WAS}</s></p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
       <label className="block text-sm font-semibold text-slate-700">{c.name}<input required maxLength={80} autoComplete="given-name" onChange={e=>{nameRef.current=e.target.value;}} className="mt-1.5 h-12 w-full rounded-lg border border-slate-300 px-4 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"/></label>
       <label className="block text-sm font-semibold text-slate-700">{c.email}<input required type="email" maxLength={200} autoComplete="email" onChange={e=>{emailRef.current=e.target.value;}} className="mt-1.5 h-12 w-full rounded-lg border border-slate-300 px-4 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"/></label>
      </div>
      <div ref={buttons} className="mt-4 min-h-[110px]"/>
      {error&&<p role="alert" className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <p className="mt-2 text-xs text-slate-500">{c.sent}</p>
     </>}
    </div>
   </div>
  </div>
 </div>;
}
