import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {getSitePage} from '@/lib/site-pages';
import LeadMagnetCTA from './LeadMagnetCTA';

export default function SpanishPage({route}:{route:string}) {
 const page=getSitePage(route,'es')!;
 return <div lang="es" className="bg-white text-slate-900">
  <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-5 py-16 text-white"><div className={`mx-auto max-w-4xl ${route==='/'?'text-center':''}`}>
   <h1 className="text-4xl font-bold leading-tight md:text-5xl">{page.title}</h1><p className="mt-6 text-xl leading-relaxed text-blue-100">{page.excerpt}</p>
   {route==='/'&&<div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"><a href="/es/lead-magnet" className="rounded-lg bg-white px-7 py-4 font-bold text-blue-700">Plan de estudio gratuito</a><a href="/es/book" className="rounded-lg border-2 border-white bg-blue-800 px-7 py-4 font-bold text-white">Mira el interior del libro</a></div>}
  </div></section>
  <div className="mx-auto max-w-4xl px-5 py-12">{route==='/'&&<section className="mb-12 grid gap-6 sm:grid-cols-2"><a href="/es/book" className="flex gap-5 rounded-xl border bg-blue-50 p-6"><img src="/images/products/book-cover.png" width="85" height="120" alt="Libro digital FaMED Protokoll 2026 en alemán" className="h-32 w-auto rounded object-contain"/><div><h2 className="text-xl font-bold">FaMED Protokoll 2026</h2><p className="mt-3 text-slate-700">Libro digital en alemán. Casos y expresiones para practicar.</p><p className="mt-3 text-2xl font-bold text-blue-800">€19.99</p></div></a><a href="/es/app" className="rounded-xl border bg-slate-50 p-6"><h2 className="text-xl font-bold">FaMED Prep App</h2><p className="mt-3 text-slate-700">Anamnese · Aufklärung · Arzt–Arzt · Arztbrief</p><p className="mt-3 text-slate-700">Mira pantallas reales y conoce los ejercicios antes de elegir un plan.</p><p className="mt-4 font-bold text-blue-700">Cómo funciona →</p></a></section>}<div className="prose max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{img:props=><img {...props} loading="lazy" className="mx-auto my-8 max-h-[36rem] max-w-full rounded-xl object-contain"/>}}>{page.content}</ReactMarkdown></div>
   {route==='/app'&&<figure className="my-10 rounded-xl border bg-slate-50 p-4"><video className="w-full rounded-lg" controls preload="metadata" poster="/videos/famed-commercial-poster-en-20261019.jpg"><source src="/videos/famed-commercial-en-20261019.mp4" type="video/mp4"/><track kind="captions" src="/videos/famed-commercial-en-20261019.vtt" srcLang="en" label="English" default/></video><figcaption className="mt-3 text-sm text-slate-600">Demostración narrada en inglés; ejercicios en alemán y datos ficticios. No es una evaluación oficial.</figcaption></figure>}
   {(route==='/'||route==='/lead-magnet')&&<LeadMagnetCTA locale="es"/>}
  </div>
 </div>;
}
