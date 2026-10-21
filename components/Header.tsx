'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {spanishRoutes} from '@/lib/languages';
export default function Header(){
 const path=usePathname(),ar=/^\/ar(?:\/|$)/.test(path),es=/^\/es(?:\/|$)/.test(path),prefix=ar?'/ar':es?'/es':'';
 const [open,setOpen]=useState(false);const base=path.replace(/^\/(ar|es)(?=\/|$)/,'')||'/';
 const items=es?[['/','Inicio'],['/what-is-famed','Qué es FaMED'],['/book','Libro digital'],['/app','La app'],['/lead-magnet','Plan gratuito']]:[['/',ar?'الرئيسية':'Home'],['/what-is-famed',ar?'ما هو FaMED؟':'What is FaMED?'],['/blog',ar?'المدونة':'Blog'],['/app',ar?'التطبيق':'The app'],['/book',ar?'الكتاب الرقمي':'Digital book'],['/career',ar?'العمل في ألمانيا':'Career'],['/lead-magnet',ar?'خطة دراسة مجانية':'Free study guide']];
 const switches=[...(!(!ar&&!es)?[['en','English',base]]:[]),...(!ar?[['ar','العربية','/ar'+(base==='/'?'':base)]]:[]),...(!es&&spanishRoutes.includes(base)?[['es','Español','/es'+(base==='/'?'':base)]]:[])];
 return <header className="sticky top-0 z-50 border-b bg-white shadow-sm" dir={ar?'rtl':'ltr'}><nav className="mx-auto max-w-7xl px-4 py-4"><div className="flex flex-wrap items-center justify-between gap-4"><Link href={prefix||'/'} className="flex items-center gap-2 font-bold text-slate-900"><img src="/logo.png" width="40" height="40" alt="FaMED Prep"/>FaMED Prep</Link><div className="hidden items-center gap-4 xl:flex">{items.map(([href,label])=><Link key={href} href={prefix+(href==='/'?'':href)||'/'} className="text-sm font-semibold text-slate-700 hover:text-blue-700">{label}</Link>)}</div><div className="flex items-center gap-2">{switches.map(([lang,label,href])=><Link key={lang} href={href} hrefLang={lang} lang={lang} className="rounded-lg border px-2 py-2 text-sm font-semibold text-blue-700">{label}</Link>)}<button aria-label={ar?'القائمة':es?'Menú':'Menu'} aria-expanded={open} onClick={()=>setOpen(!open)} className="rounded border px-3 py-2 text-slate-900 xl:hidden">☰</button></div></div>{open&&<div className="mt-4 grid gap-3 text-slate-700 xl:hidden">{items.map(([href,label])=><Link key={href} onClick={()=>setOpen(false)} href={prefix+(href==='/'?'':href)||'/'}>{label}</Link>)}</div>}</nav></header>;
}
