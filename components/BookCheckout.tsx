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
/* eslint-disable @typescript-eslint/no-explicit-any -- PayPal, Apple Pay and Google Pay SDKs are untyped globals. */
type Config={clientId:string;priceCents:number;mode:'live'|'sandbox'};
const checkout=async(body:object)=>{const res=await fetch('/api/book-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await res.json().catch(()=>({}));if(!res.ok||!data.success)throw Error(data.error||'failed');return data;};
const scripts=new Map<string,Promise<void>>();
const loadScript=(src:string)=>{if(!scripts.has(src))scripts.set(src,new Promise<void>((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=true;s.onload=()=>resolve();s.onerror=()=>{s.remove();scripts.delete(src);reject(Error('SDK unavailable'));};document.head.appendChild(s);}));return scripts.get(src)!;};
let sdk:Promise<{paypal:any;cfg:Config}>|undefined;
function loadPayPal(){
 return sdk??=checkout({step:'config'}).then(async(cfg:Config)=>{await loadScript(`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.clientId)}&currency=EUR&intent=capture&components=buttons,applepay,googlepay&enable-funding=card`);return {paypal:(window as any).paypal,cfg};});
}
// Apple Pay only works on domains registered with PayPal for Apple Pay.
const APPLE_PAY_HOSTS=['famed-vorbereitung.com','www.famed-vorbereitung.com'];
export default function BookCheckout({locale,id}:{locale:Locale;id:string}){
 const c=copy[locale];const [error,setError]=useState(''),[done,setDone]=useState('');
 const nameRef=useRef(''),emailRef=useRef(''),buttons=useRef<HTMLDivElement>(null),apple=useRef<HTMLDivElement>(null),google=useRef<HTMLDivElement>(null),rendered=useRef(false),busy=useRef(false);
 useEffect(()=>{
  if(rendered.current||!buttons.current)return;rendered.current=true;const target=buttons.current,appleBox=apple.current!,googleBox=google.current!;
  const details=()=>{const ok=nameRef.current.trim()&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRef.current.trim());setError(ok?'':c.invalid);return !!ok;};
  const create=async()=>(await checkout({step:'create',firstName:nameRef.current.trim(),email:emailRef.current.trim().toLowerCase()})).orderId as string;
  const capture=async(orderId:string)=>{const r=await checkout({step:'capture',orderId});setDone(r.email||emailRef.current);};
  // Wallets confirm the order with the wallet token, then the same server capture records the sale and emails the book.
  const walletPay=async(kind:'apple'|'google',wallet:any,payment:any)=>{
   const orderId=await create();
   const confirmation=await wallet.confirmOrder(kind==='apple'?{orderId,token:payment.token,billingContact:payment.billingContact}:{orderId,paymentMethodData:payment.paymentMethodData});
   if(confirmation.status==='PAYER_ACTION_REQUIRED'&&kind==='google')await wallet.initiatePayerAction({orderId});
   else if(confirmation.status!=='APPROVED'&&confirmation.status!=='COMPLETED')throw Error('not approved');
   await capture(orderId);
  };
  loadPayPal().then(({paypal,cfg})=>{
   const total=(cfg.priceCents/100).toFixed(2);
   paypal.Buttons({
    style:{layout:'vertical',shape:'rect',label:'pay'},
    onClick:(_:unknown,actions:{reject:()=>void;resolve:()=>void})=>details()?actions.resolve():actions.reject(),
    createOrder:create,
    onApprove:async(data:{orderID:string})=>{try{await capture(data.orderID);}catch{setError(c.failed);}},
    onError:()=>setError(c.failed),
   }).render(target);
   (async()=>{
    if(!APPLE_PAY_HOSTS.includes(location.hostname)||!paypal.Applepay)return;
    await loadScript('https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js');
    const Session=(window as any).ApplePaySession;if(!Session?.canMakePayments())return;
    const wallet=paypal.Applepay(),config=await wallet.config();if(!config.isEligible)return;
    const button=document.createElement('apple-pay-button');
    button.setAttribute('buttonstyle','black');button.setAttribute('type','buy');button.setAttribute('locale',locale==='ar'?'ar-AE':locale==='es'?'es-ES':'en-US');
    button.style.cssText='display:block;--apple-pay-button-width:100%;--apple-pay-button-height:48px;--apple-pay-button-border-radius:6px';
    button.addEventListener('click',()=>{
     if(busy.current||!details())return;busy.current=true;
     try{
      const session=new Session(4,{countryCode:config.countryCode,currencyCode:'EUR',merchantCapabilities:config.merchantCapabilities,supportedNetworks:config.supportedNetworks,requiredBillingContactFields:['postalAddress'],total:{label:'FaMED Prep',type:'final',amount:total}});
      session.onvalidatemerchant=async(event:any)=>{try{const r=await wallet.validateMerchant({validationUrl:event.validationURL,displayName:'FaMED Prep'});session.completeMerchantValidation(r.merchantSession);}catch{session.abort();busy.current=false;setError(c.failed);}};
      session.oncancel=()=>{busy.current=false;};
      session.onpaymentauthorized=async(event:any)=>{try{await walletPay('apple',wallet,event.payment);session.completePayment(Session.STATUS_SUCCESS);}catch{session.completePayment(Session.STATUS_FAILURE);setError(c.failed);}finally{busy.current=false;}};
      session.begin();
     }catch{busy.current=false;setError(c.failed);}
    });
    appleBox.replaceChildren(button);
   })().catch(()=>{});
   (async()=>{
    if(!paypal.Googlepay)return;
    await loadScript('https://pay.google.com/gp/p/js/pay.js');
    const wallet=paypal.Googlepay(),config=await wallet.config();
    if(config.isEligible===false||!config.allowedPaymentMethods?.length||(cfg.mode==='live'&&!config.merchantInfo?.merchantId))return;
    const g=(window as any).google.payments.api;
    const client=new g.PaymentsClient({environment:cfg.mode==='live'?'PRODUCTION':'TEST',paymentDataCallbacks:{onPaymentAuthorized:async(payment:any)=>{
     try{await walletPay('google',wallet,payment);return {transactionState:'SUCCESS'};}
     catch{return {transactionState:'ERROR',error:{intent:'PAYMENT_AUTHORIZATION',reason:'OTHER_ERROR',message:c.failed}};}
    }}});
    const base={apiVersion:2,apiVersionMinor:0,allowedPaymentMethods:config.allowedPaymentMethods};
    if(!(await client.isReadyToPay(base)).result)return;
    googleBox.replaceChildren(client.createButton({buttonColor:'black',buttonType:'buy',buttonSizeMode:'fill',buttonLocale:locale==='ar'?'ar':locale==='es'?'es':'en',allowedPaymentMethods:config.allowedPaymentMethods,onClick:()=>{
     if(busy.current||!details())return;busy.current=true;
     client.loadPaymentData({...base,merchantInfo:config.merchantInfo,callbackIntents:['PAYMENT_AUTHORIZATION'],transactionInfo:{currencyCode:'EUR',totalPriceStatus:'FINAL',totalPrice:total}})
      .catch((e:any)=>{if(e?.statusCode!=='CANCELED')setError(c.failed);}).finally(()=>{busy.current=false;});
    }}));
   })().catch(()=>{});
  }).catch(()=>setError(c.failed));
 },[c,locale]);
 if(done)return <p role="status" className="mt-4 rounded-xl bg-green-50 p-4 text-lg leading-relaxed text-green-900">{c.thanks} <strong>{done}</strong>.</p>;
 const input='mt-1.5 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30';
 return <div>
  <p className="flex items-baseline gap-3"><span className="text-4xl font-extrabold text-slate-900">{BOOK_NOW}</span><s className="text-lg text-slate-500">{BOOK_WAS}</s></p>
  <div className="mt-5 grid gap-3 sm:grid-cols-2">
   <label htmlFor={`${id}-name`} className="block text-sm font-semibold text-slate-700">{c.name}<input id={`${id}-name`} required maxLength={80} autoComplete="given-name" onChange={e=>{nameRef.current=e.target.value;}} className={input}/></label>
   <label htmlFor={`${id}-email`} className="block text-sm font-semibold text-slate-700">{c.email}<input id={`${id}-email`} required type="email" maxLength={200} autoComplete="email" onChange={e=>{emailRef.current=e.target.value;}} className={input}/></label>
  </div>
  {/* Apple Pay / Google Pay appear only on devices that support them. isolate: keeps the payment iframes under the sticky site header. */}
  <div className="isolate mt-4 grid gap-3"><div ref={apple}/><div ref={google} className="h-12 empty:hidden"/><div ref={buttons} className="min-h-[110px]"/></div>
  {error&&<p role="alert" className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  <p className="mt-2 text-xs text-slate-500">{c.sent}</p>
 </div>;
}
