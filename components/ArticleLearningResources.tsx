import Image from 'next/image';
export default function ArticleLearningResources({german=false,arabic=false}:{german?:boolean;arabic?:boolean}) {
 return <section id="weiterlernen" style={{scrollMarginTop:100}} aria-label={arabic?'تابع التعلّم':german?'Weiterlernen':'Continue learning'} className="my-12 grid gap-5 md:grid-cols-2">
  <div className="flex flex-col gap-5 rounded-2xl sm:flex-row md:flex-col lg:flex-row border border-blue-200 bg-blue-50 p-5">
   <a href={`${arabic?'/ar':''}/blog/famed-protokoll-buch-vorschau`} className="shrink-0 self-start"><Image unoptimized loading="eager" src="/images/products/book-cover.png" alt="FaMED Protokoll · Ausgabe 2026" width={778} height={1100} className="w-20 rounded shadow-sm sm:w-24" /></a>
   <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">{arabic?'الكتاب الرقمي':german?'Digitales Buch':'Digital book'}</p>
    <h2 className="mt-2 text-xl font-bold text-slate-900">FaMED Protokoll 2026</h2>
    <p className="mt-2 text-sm text-slate-700">{arabic?'حالات وعبارات مفيدة لتنظيم الحوار.':german?'Fälle, Redemittel und Gesprächsstruktur.':'Cases, useful phrases and conversation structure.'}</p>
    <p className="mt-3 text-3xl font-extrabold text-blue-800">€19.99</p>
    <a className="mt-4 inline-block rounded-lg bg-blue-700 px-4 py-3 font-bold text-white" href="https://www.paypal.com/ncp/payment/DQCLR47JB5DXU?utm_source=blog&utm_medium=article&utm_campaign=book_2026">{arabic?'اشترِ الكتاب الرقمي':german?'Digitales Buch ansehen':'Get the digital book'}</a>
    <a className="mt-3 block text-sm font-semibold text-blue-700 underline" href={`${arabic?'/ar':''}/blog/famed-protokoll-buch-vorschau`}>{arabic?'اقرأ عيّنة أولاً':german?'Erst reinlesen →':'Read a sample first →'}</a>
   </div>
  </div>
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
   <div className="mb-5 flex min-h-40 items-center justify-center rounded-xl bg-slate-800 p-5">
    <div className="flex h-36 w-36 rotate-3 flex-col items-center justify-center gap-3 rounded-3xl bg-white p-4 shadow-xl">
     <Image unoptimized loading="eager" src="/images/products/logo.png" alt="FaMED Prep App" width={200} height={82} className="h-16 w-28 object-contain" />
     <span className="text-center text-xs font-semibold text-slate-700">FaMED Prep</span>
    </div>
   </div>
   <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{arabic?'تدرّب عملياً':german?'Praktisch üben':'Put it into practice'}</p>
   <h2 className="mt-2 text-xl font-bold text-slate-900">FaMED Prep App</h2>
   <p className="mt-3 text-slate-700">{arabic?'أخذ القصة المرضية وشرح الإجراءات وعرض الحالات والكتابة: تعرّف أولاً على طريقة التدريب.':german?'Anamnese, Aufklärung, Patientenvorstellung und Schreiben: Lerne zuerst den Ablauf kennen.':'History, informed consent, case presentations and writing: see how the practice works first.'}</p>
   <a className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-3 font-bold text-white" href={`${arabic?'/ar':''}/blog/famed-prep-app-so-funktionierts`}>{arabic?'كيف يعمل التطبيق؟':german?'So funktioniert die App →':'How the app works →'}</a>
  </div>
 </section>;
}
