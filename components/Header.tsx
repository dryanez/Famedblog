'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {blogLocale,hasVersion,localeNames,localeOf,localePattern,localePrefix,locales} from '@/lib/languages';
const nav={en:['Home','What is FaMED?','Blog','Career','Free study guide','Menu'],ar:['الرئيسية','ما هو FaMED؟','المدونة','العمل في ألمانيا','خطة دراسة مجانية','القائمة'],es:['Inicio','Qué es FaMED','Artículos','Trabajar en Alemania','Plan gratuito','Menú'],ru:['Главная','Что такое FaMED','Статьи (англ.)','Работа в Германии','Бесплатный план','Меню'],fr:['Accueil','Qu’est-ce que le FaMED ?','Articles (anglais)','Travailler en Allemagne','Plan gratuit','Menu'],de:['Startseite (EN)','Was ist FaMED? (EN)','Blog','Arbeiten in Deutschland (EN)','Kostenloser Lernplan (EN)','Menü'],tr:['Ana sayfa','FaMED nedir?','Makaleler (İngilizce)','Almanya’da çalışmak','Ücretsiz plan','Menü']};
export default function Header(){
 const path=usePathname(),locale=localeOf(path),ar=locale==='ar',prefix=localePrefix(locale);
 const [open,setOpen]=useState(false);const base=path.replace(localePattern,'')||'/';
 const [home,what,blog,career,guide,menu]=nav[locale];
 // The blog link goes to the English articles for languages that have pages only.
 // German has blog articles only: the other links go to the English pages.
 const pagePrefix=hasVersion(locale,'/')?prefix:'';
 const items=[['/',home,pagePrefix],['/what-is-famed',what,pagePrefix],['/blog',blog,localePrefix(blogLocale(locale))],['/career',career,pagePrefix],['/lead-magnet',guide,pagePrefix]];
 const href=(page:string,pre:string)=>pre+(page==='/'?'':page)||'/';
 const switches=base==='/guide-ready'?[]:locales.filter(l=>l!==locale&&hasVersion(l,base)).map(l=>[l,localeNames[l],href(base,localePrefix(l))]);
 return <header className="sticky top-0 z-50 border-b bg-white shadow-sm" dir={ar?'rtl':'ltr'}><nav className="mx-auto max-w-7xl px-4 py-4"><div className="flex items-center justify-between gap-3 sm:gap-4"><Link href={pagePrefix||'/'} className="flex shrink-0 items-center gap-2 font-bold text-slate-900"><img src="/logo.png" width="40" height="40" alt="FaMED Prep"/><span className="hidden sm:inline">FaMED Prep</span></Link><div className="hidden items-center gap-4 xl:flex">{items.map(([page,label,pre])=><Link key={page} href={href(page,pre)} className="text-sm font-semibold text-slate-700 hover:text-blue-700">{label}</Link>)}</div><div className="flex min-w-0 items-center gap-1.5 sm:gap-2">{/* Phones show short language codes so the row never wraps. */}{switches.map(([lang,label,to])=><Link key={lang} href={to} hrefLang={lang} lang={lang} aria-label={label} title={label} className="flex min-h-10 items-center rounded-lg border px-2 text-xs font-bold text-blue-700 sm:py-2 sm:text-sm sm:font-semibold"><span className="sm:hidden">{lang.toUpperCase()}</span><span className="hidden sm:inline">{label}</span></Link>)}<button aria-label={menu} aria-expanded={open} onClick={()=>setOpen(!open)} className="min-h-10 shrink-0 rounded border px-3 text-slate-900 xl:hidden">☰</button></div></div>{open&&<div className="mt-4 grid gap-3 text-slate-700 xl:hidden">{items.map(([page,label,pre])=><Link key={page} onClick={()=>setOpen(false)} href={href(page,pre)}>{label}</Link>)}</div>}</nav></header>;
}
