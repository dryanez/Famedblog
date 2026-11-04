'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {blogLocale,hasVersion,localeNames,localeOf,localePattern,localePrefix,locales} from '@/lib/languages';
const nav={en:['Home','What is FaMED?','Blog','Career','Free study guide','Menu'],ar:['الرئيسية','ما هو FaMED؟','المدونة','العمل في ألمانيا','خطة دراسة مجانية','القائمة'],es:['Inicio','Qué es FaMED','Artículos','Trabajar en Alemania','Plan gratuito','Menú'],ru:['Главная','Что такое FaMED','Статьи (англ.)','Работа в Германии','Бесплатный план','Меню'],fr:['Accueil','Qu’est-ce que le FaMED ?','Articles (anglais)','Travailler en Allemagne','Plan gratuit','Menu'],tr:['Ana sayfa','FaMED nedir?','Makaleler (İngilizce)','Almanya’da çalışmak','Ücretsiz plan','Menü']};
export default function Header(){
 const path=usePathname(),locale=localeOf(path),ar=locale==='ar',prefix=localePrefix(locale);
 const [open,setOpen]=useState(false);const base=path.replace(localePattern,'')||'/';
 const [home,what,blog,career,guide,menu]=nav[locale];
 // The blog link goes to the English articles for languages that have pages only.
 const items=[['/',home,prefix],['/what-is-famed',what,prefix],['/blog',blog,localePrefix(blogLocale(locale))],['/career',career,prefix],['/lead-magnet',guide,prefix]];
 const href=(page:string,pre:string)=>pre+(page==='/'?'':page)||'/';
 const switches=base==='/guide-ready'?[]:locales.filter(l=>l!==locale&&hasVersion(l,base)).map(l=>[l,localeNames[l],href(base,localePrefix(l))]);
 return <header className="sticky top-0 z-50 border-b bg-white shadow-sm" dir={ar?'rtl':'ltr'}><nav className="mx-auto max-w-7xl px-4 py-4"><div className="flex flex-wrap items-center justify-between gap-4"><Link href={prefix||'/'} className="flex items-center gap-2 font-bold text-slate-900"><img src="/logo.png" width="40" height="40" alt="FaMED Prep"/>FaMED Prep</Link><div className="hidden items-center gap-4 xl:flex">{items.map(([page,label,pre])=><Link key={page} href={href(page,pre)} className="text-sm font-semibold text-slate-700 hover:text-blue-700">{label}</Link>)}</div><div className="flex flex-wrap items-center gap-2">{switches.map(([lang,label,to])=><Link key={lang} href={to} hrefLang={lang} lang={lang} className="rounded-lg border px-2 py-2 text-sm font-semibold text-blue-700">{label}</Link>)}<button aria-label={menu} aria-expanded={open} onClick={()=>setOpen(!open)} className="rounded border px-3 py-2 text-slate-900 xl:hidden">☰</button></div></div>{open&&<div className="mt-4 grid gap-3 text-slate-700 xl:hidden">{items.map(([page,label,pre])=><Link key={page} onClick={()=>setOpen(false)} href={href(page,pre)}>{label}</Link>)}</div>}</nav></header>;
}
