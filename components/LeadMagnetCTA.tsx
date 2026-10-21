'use client';
import {useState} from 'react';
import {submitLead} from '@/app/actions';
// @ts-ignore Shared consent text also lives in the recorded server-side evidence.
import {consentCopy} from '@/lib/guide-consent-copy.mjs';
const copy={en:{title:'Plan your FaMED preparation',intro:'A free eight-week schedule for speaking and writing practice. Read it now or request the link by email.',read:'Read or print the free guide',name:'First name',email:'Email address',date:'Exam date (optional)',level:'German level (optional)',send:'Email me the guide',sending:'Sending…',privacy:'Privacy policy',note:'The guide request does not subscribe you to marketing. The optional checkbox needs a separate email confirmation.',failed:'Something went wrong. Try again or open the guide directly.'},ar:{title:'خطّط للتحضير لامتحان FaMED',intro:'جدول مجاني لثمانية أسابيع للتحدث والكتابة. اقرأه الآن أو اطلب الرابط عبر البريد.',read:'اقرأ الدليل المجاني أو اطبعه',name:'الاسم الأول',email:'البريد الإلكتروني',date:'تاريخ الامتحان (اختياري)',level:'مستوى الألمانية (اختياري)',send:'أرسل لي رابط الدليل',sending:'جارٍ الإرسال…',privacy:'سياسة الخصوصية',note:'طلب الدليل لا يفعّل التسويق. يحتاج المربع الاختياري إلى تأكيد منفصل عبر البريد.',failed:'حدث خطأ. حاول مرة أخرى أو افتح الدليل مباشرة.'},es:{title:'Organiza tu preparación para FaMED',intro:'Un plan gratuito de ocho semanas para practicar expresión oral y escritura. Léelo ahora o pide el enlace por correo.',read:'Leer o imprimir la guía gratuita',name:'Nombre',email:'Correo electrónico',date:'Fecha del examen (opcional)',level:'Nivel de alemán (opcional)',send:'Enviarme la guía',sending:'Enviando…',privacy:'Política de privacidad',note:'Pedir la guía no te suscribe a marketing. La casilla opcional requiere una confirmación aparte por correo.',failed:'Algo salió mal. Inténtalo de nuevo o abre la guía directamente.'}};
export default function LeadMagnetCTA({arabic=false,locale}:{arabic?:boolean;locale?:'en'|'ar'|'es'}){
 const lang=locale||(arabic?'ar':'en'),c=copy[lang];const [loading,setLoading]=useState(false),[status,setStatus]=useState(''),[message,setMessage]=useState('');
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setMessage('');try{const result=await submitLead(new FormData(e.currentTarget));setStatus(result.success?'success':'error');setMessage(result.message||c.failed);}catch{setStatus('error');setMessage(c.failed);}finally{setLoading(false);}}
 const input='mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900';
 return <section className="my-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-xl sm:p-8" dir={lang==='ar'?'rtl':'ltr'}>
  <div className="mx-auto max-w-2xl"><h3 className="text-center text-3xl font-bold">{c.title}</h3><p className="mt-5 text-center text-lg leading-relaxed text-blue-100">{c.intro}</p>
   <p className="my-6 text-center"><a href={`/guides/famed-study-plan-${lang}.html`} className="font-bold text-white underline underline-offset-4">{c.read}</a></p>
   <form onSubmit={submit} className="mx-auto max-w-md space-y-4 text-start"><input type="hidden" name="locale" value={lang}/><input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"/>
    <label className="block font-semibold">{c.name}<input required maxLength={80} name="firstName" autoComplete="given-name" className={input}/></label>
    <label className="block font-semibold">{c.email}<input required type="email" maxLength={254} name="email" autoComplete="email" className={input}/></label>
    <label className="block font-semibold">{c.date}<input type="date" name="examDate" className={input}/></label>
    <label className="block font-semibold">{c.level}<select name="germanLevel" className={input}><option value="">—</option>{['A1','A2','B1','B2','C1','C2'].map(level=><option key={level}>{level}</option>)}</select></label>
    <label className="flex items-start gap-3 rounded-lg border border-blue-300 bg-blue-800 p-4 text-sm leading-relaxed"><input type="checkbox" name="marketingConsent" value="yes" className="mt-1 h-5 w-5 shrink-0"/>{consentCopy[lang]}</label>
    <button disabled={loading} className="w-full rounded-lg bg-white px-6 py-4 font-bold text-blue-700 shadow disabled:opacity-60">{loading?c.sending:c.send}</button>
    {message&&<p role="status" className={`rounded-lg bg-white p-4 ${status==='success'?'text-green-800':'text-red-800'}`}>{message}</p>}
   </form><p className="mt-6 text-sm leading-relaxed text-blue-100">{c.note} <a href="https://famedtestprep.com/PrivacyPolicy" className="underline">{c.privacy}</a></p>
  </div>
 </section>;
}
