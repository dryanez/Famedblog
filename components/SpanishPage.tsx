import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {getSitePage} from '@/lib/site-pages';
import ClientSecureDocViewer from './ClientSecureDocViewer';
import ArticleLearningResources from './ArticleLearningResources';
import LeadMagnetCTA from './LeadMagnetCTA';

export default function SpanishPage({route}:{route:string}) {
 const page=getSitePage(route,'es')!;
 return <div lang="es" className="bg-white text-slate-900">
  <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-5 py-16 text-white"><div className={`mx-auto max-w-4xl ${route==='/'?'text-center':''}`}>
   <h1 className="text-4xl font-bold leading-tight md:text-5xl">{page.title}</h1><p className="mt-6 text-xl leading-relaxed text-blue-100">{page.excerpt}</p>

  </div></section>
  <div className="mx-auto max-w-4xl px-5 py-12"><div className="prose max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{img:props=><img {...props} loading="lazy" className="mx-auto my-8 max-h-[36rem] max-w-full rounded-xl object-contain"/>}}>{page.content}</ReactMarkdown></div>
   {route==='/app'&&<figure className="my-10 rounded-xl border bg-slate-50 p-4"><video className="w-full rounded-lg" controls preload="metadata" poster="/videos/famed-commercial-poster-en-20261019.jpg"><source src="/videos/famed-commercial-en-20261019.mp4" type="video/mp4"/><track kind="captions" src="/videos/famed-commercial-en-20261019.vtt" srcLang="en" label="English" default/></video><figcaption className="mt-3 text-sm text-slate-600">Demostración narrada en inglés; ejercicios en alemán y datos ficticios. No es una evaluación oficial.</figcaption></figure>}
   <LeadMagnetCTA locale="es"/>
   {route==='/resources/anamnese'&&<ClientSecureDocViewer url="/documents/anamnese.pdf"/>}<ArticleLearningResources locale="es"/>
  </div>
 </div>;
}
