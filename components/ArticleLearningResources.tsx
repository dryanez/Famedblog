import Image from 'next/image';
export default function ArticleLearningResources({german=false}:{german?:boolean}) {
 return <section id="weiterlernen" aria-label={german?'Weiterlernen':'Continue learning'} className="my-12 grid gap-5 md:grid-cols-2">
  <div className="flex gap-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
   <a href="/blog/famed-protokoll-buch-vorschau" className="shrink-0 self-start"><Image unoptimized loading="eager" src="/images/products/book-cover.png" alt="FaMED Protokoll · Ausgabe 2026" width={778} height={1100} className="w-20 rounded shadow-sm sm:w-24" /></a>
   <div><p className="text-xs font-bold uppercase tracking-wide text-blue-700">{german?'Digitales Buch':'Digital book'}</p>
    <h2 className="mt-2 text-xl font-bold text-slate-900">FaMED Protokoll 2026</h2>
    <p className="mt-2 text-sm text-slate-700">{german?'Fälle, Redemittel und Gesprächsstruktur.':'Cases, useful phrases and conversation structure.'}</p>
    <p className="mt-3 text-3xl font-extrabold text-blue-800">€19.99</p>
    <a className="mt-4 inline-block rounded-lg bg-blue-700 px-4 py-3 font-bold text-white" href="https://famedtestprep.com/FamedProtokolle?utm_source=blog&utm_medium=article&utm_campaign=book_2026">{german?'Digitales Buch ansehen':'View digital book'}</a>
    <a className="mt-3 block text-sm font-semibold text-blue-700 underline" href="/blog/famed-protokoll-buch-vorschau">{german?'Erst reinlesen →':'Read a sample first →'}</a>
   </div>
  </div>
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
   <div className="mb-5 flex min-h-40 items-center justify-center rounded-xl bg-slate-800 p-5">
    <div className="flex h-36 w-36 rotate-3 flex-col items-center justify-center gap-3 rounded-3xl bg-white p-4 shadow-xl">
     <Image unoptimized loading="eager" src="/images/products/logo.png" alt="FaMED Prep App" width={200} height={82} className="h-16 w-28 object-contain" />
     <span className="text-center text-xs font-semibold text-slate-700">3 Monate App-Zugang</span>
    </div>
   </div>
   <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{german?'Praktisch üben':'Put it into practice'}</p>
   <h2 className="mt-2 text-xl font-bold text-slate-900">FaMED Prep App</h2>
   <p className="mt-3 text-slate-700">{german?'Anamnese, Aufklärung, Patientenvorstellung und Schreiben: Lerne zuerst den Ablauf kennen.':'History, informed consent, case presentations and writing: see how the practice works first.'}</p>
   <a className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-3 font-bold text-white" href="/blog/famed-prep-app-so-funktionierts">{german?'So funktioniert die App →':'How the app works →'}</a>
  </div>
 </section>;
}
