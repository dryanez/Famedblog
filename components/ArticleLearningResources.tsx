import Image from 'next/image';
export const bookCheckout='https://www.paypal.com/ncp/payment/DQCLR47JB5DXU?utm_source=blog&utm_medium=article&utm_campaign=contextual_book';
export default function ArticleLearningResources({german=false,arabic=false,locale}:{german?:boolean;arabic?:boolean;locale?:'en'|'ar'|'es'}) {
 const ar=locale==='ar'||arabic,es=locale==='es',prefix=ar?'/ar':es?'/es':'';
 return <section id="optional-resources" aria-label={ar?'موارد اختيارية':es?'Recursos opcionales':'Optional learning resources'} className="my-12 grid gap-5 md:grid-cols-2">
  <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row md:flex-col lg:flex-row">
   <a href={bookCheckout} className="shrink-0 self-start"><Image unoptimized loading="lazy" src="/images/products/book-cover.png" alt="FaMED Protokoll 2026" width={778} height={1100} className="w-20 rounded shadow-sm sm:w-24" /></a>
   <div><p className="text-xs font-bold uppercase tracking-wide text-slate-600">{ar?'للتعلّم الإضافي':es?'Para seguir practicando':'For further practice'}</p><h2 className="mt-2 text-xl font-bold text-slate-900">FaMED Protokoll 2026</h2>
    <p className="mt-3 text-sm leading-relaxed text-slate-700">{ar?'كتاب رقمي بالألمانية يتضمن حالات وعبارات مفيدة وبنية المحادثة. مورد اختياري مستقل عن التطبيق.':es?'Libro digital en alemán con casos, expresiones útiles y estructuras de conversación. Un recurso opcional, separado de la app.':german?'Digitales Buch mit Fällen, Redemitteln und Gesprächsstruktur.':'A digital book in German with cases, useful phrases and conversation structures. An optional resource, separate from the app.'}</p>
    <a className="mt-5 inline-block rounded-lg bg-blue-700 px-4 py-3 font-bold text-white" href={bookCheckout}>{ar?'احصل على الكتاب الرقمي':es?'Conseguir el libro digital':german?'Digitales Buch erhalten':'Get the digital book'}</a>
   </div>
  </div>
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><Image unoptimized loading="lazy" src="/images/products/logo.png" alt="FaMED Prep App" width={200} height={82} className="mb-5 h-12 w-auto object-contain"/><h2 className="text-xl font-bold text-slate-900">FaMED Prep App</h2><p className="mt-3 leading-relaxed text-slate-700">{ar?'تعرّف على التدريب على أخذ القصة المرضية وشرح الإجراءات وعرض الحالات والكتابة.':es?'Conoce los ejercicios de Anamnese, Aufklärung, Arzt–Arzt y escritura, y cómo utilizar el feedback para practicar.':'Explore practice for history taking, informed consent, case presentations and writing, and see how feedback can support your next attempt.'}</p><a className="mt-5 inline-block font-semibold text-blue-700 underline" href={`${prefix}/blog/famed-prep-app-so-funktionierts`}>{ar?'كيف يعمل التطبيق؟':es?'Cómo funciona la app':'How the app works →'}</a></div>
 </section>;
}
