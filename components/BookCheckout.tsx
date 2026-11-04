'use client';
import {useEffect,useRef,useState} from 'react';
import type {Locale} from '@/lib/languages';
// Book price, name/email and PayPal buttons, shared by the book popup and the guide-ready page.
// /api/book-checkout passes the payment to the app's guest checkout, which records the sale and emails the book.
export const BOOK_WAS='39,99 €',BOOK_NOW='19,99 €';
const copy:Record<Locale,{name:string;email:string;sent:string;thanks:string;invalid:string;failed:string}>={
 en:{name:'First name',email:'Email address',sent:'Sent to your email right after payment.',thanks:'Thank you! Your book is on its way to',invalid:'Please enter your first name and a valid email first.',failed:'The payment could not be completed. Please try again.'},
 ar:{name:'الاسم الأول',email:'البريد الإلكتروني',sent:'يُرسل إلى بريدك فور الدفع.',thanks:'شكراً لك! الكتاب في طريقه إلى',invalid:'يرجى إدخال اسمك الأول وبريد إلكتروني صحيح أولاً.',failed:'تعذّر إتمام الدفع. حاول مرة أخرى.'},
 es:{name:'Nombre',email:'Correo electrónico',sent:'Se envía a tu correo justo después del pago.',thanks:'¡Gracias! Tu libro va de camino a',invalid:'Introduce primero tu nombre y un correo válido.',failed:'No se pudo completar el pago. Inténtalo de nuevo.'},
 ru:{name:'Имя',email:'Электронная почта',sent:'Отправляется на почту сразу после оплаты.',thanks:'Спасибо! Книга отправлена на адрес',invalid:'Сначала введите имя и корректный адрес почты.',failed:'Не удалось завершить оплату. Попробуйте ещё раз.'},
 fr:{name:'Prénom',email:'Adresse e-mail',sent:'Envoyé par e-mail juste après le paiement.',thanks:'Merci ! Votre livre est en route vers',invalid:'Indiquez d’abord votre prénom et une adresse e-mail valide.',failed:'Le paiement n’a pas pu aboutir. Veuillez réessayer.'},
 tr:{name:'Ad',email:'E-posta adresi',sent:'Ödemeden hemen sonra e-postanıza gönderilir.',thanks:'Teşekkürler! Kitabınız şu adrese gönderiliyor:',invalid:'Lütfen önce adınızı ve geçerli bir e-posta adresi girin.',failed:'Ödeme tamamlanamadı. Lütfen tekrar deneyin.'},
};
type PayPal={Buttons:(o:object)=>{render:(el:HTMLElement)=>Promise<void>}};
const checkout=async(body:object)=>{const res=await fetch('/api/book-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await res.json().catch(()=>({}));if(!res.ok||!data.success)throw Error(data.error||'failed');return data;};
let sdk:Promise<PayPal>|undefined;
function loadPayPal(){
 return sdk??=checkout({step:'config'}).then(cfg=>new Promise<PayPal>((resolve,reject)=>{const w=window as unknown as {paypal?:PayPal};const s=document.createElement('script');s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.clientId)}&currency=EUR&intent=capture&components=buttons`;s.onload=()=>w.paypal?resolve(w.paypal):reject(Error('PayPal unavailable'));s.onerror=reject;document.head.appendChild(s);}));
}
export default function BookCheckout({locale,id}:{locale:Locale;id:string}){
 const c=copy[locale];const [error,setError]=useState(''),[done,setDone]=useState('');
 const nameRef=useRef(''),emailRef=useRef(''),buttons=useRef<HTMLDivElement>(null),rendered=useRef(false);
 useEffect(()=>{
  if(rendered.current||!buttons.current)return;rendered.current=true;const target=buttons.current;
  loadPayPal().then(paypal=>paypal.Buttons({
   style:{layout:'vertical',shape:'rect',label:'pay'},
   onClick:(_:unknown,actions:{reject:()=>void;resolve:()=>void})=>{const ok=nameRef.current.trim()&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRef.current.trim());setError(ok?'':c.invalid);return ok?actions.resolve():actions.reject();},
   createOrder:async()=>(await checkout({step:'create',firstName:nameRef.current.trim(),email:emailRef.current.trim().toLowerCase()})).orderId,
   onApprove:async(data:{orderID:string})=>{try{const r=await checkout({step:'capture',orderId:data.orderID});setDone(r.email||emailRef.current);}catch{setError(c.failed);}},
   onError:()=>setError(c.failed),
  }).render(target)).catch(()=>setError(c.failed));
 },[c]);
 if(done)return <p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-lg leading-relaxed text-green-900">{c.thanks} <strong>{done}</strong>.</p>;
 const input='mt-1.5 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30';
 return <div>
  <p className="flex items-baseline gap-3"><span className="text-4xl font-extrabold text-slate-900">{BOOK_NOW}</span><s className="text-lg text-slate-500">{BOOK_WAS}</s></p>
  <div className="mt-5 grid gap-3 sm:grid-cols-2">
   <label htmlFor={`${id}-name`} className="block text-sm font-semibold text-slate-700">{c.name}<input id={`${id}-name`} required maxLength={80} autoComplete="given-name" onChange={e=>{nameRef.current=e.target.value;}} className={input}/></label>
   <label htmlFor={`${id}-email`} className="block text-sm font-semibold text-slate-700">{c.email}<input id={`${id}-email`} required type="email" maxLength={200} autoComplete="email" onChange={e=>{emailRef.current=e.target.value;}} className={input}/></label>
  </div>
  {/* isolate: keeps PayPal's iframes under the sticky site header when scrolling. */}
  <div ref={buttons} className="isolate mt-4 min-h-[110px]"/>
  {error&&<p role="alert" className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  <p className="mt-2 text-xs text-slate-500">{c.sent}</p>
 </div>;
}
