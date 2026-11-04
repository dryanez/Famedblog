import Image from 'next/image';
import {blogLocale,localePrefix,type Locale} from '@/lib/languages';
export const bookCheckout='https://www.paypal.com/ncp/payment/DQCLR47JB5DXU?utm_source=blog&utm_medium=article&utm_campaign=contextual_book';
const copy={
 en:['Optional learning resources','For further practice','A digital book in German with cases, useful phrases and conversation structures. An optional resource, separate from the app.','Get the digital book','Explore practice for history taking, informed consent, case presentations and writing, and see how feedback can support your next attempt.','How the app works →'],
 ar:['موارد اختيارية','للتعلّم الإضافي','كتاب رقمي بالألمانية يتضمن حالات وعبارات مفيدة وبنية المحادثة. مورد اختياري مستقل عن التطبيق.','احصل على الكتاب الرقمي','تعرّف على التدريب على أخذ القصة المرضية وشرح الإجراءات وعرض الحالات والكتابة.','كيف يعمل التطبيق؟'],
 es:['Recursos opcionales','Para seguir practicando','Libro digital en alemán con casos, expresiones útiles y estructuras de conversación. Un recurso opcional, separado de la app.','Conseguir el libro digital','Conoce los ejercicios de Anamnese, Aufklärung, Arzt–Arzt y escritura, y cómo utilizar el feedback para practicar.','Cómo funciona la app'],
 ru:['Дополнительные материалы','Для дальнейшей практики','Электронная книга на немецком с клиническими случаями, полезными фразами и структурой разговора. Дополнительный ресурс, отдельный от приложения.','Получить электронную книгу','Упражнения по Anamnese, Aufklärung, Arzt–Arzt и письменной части, а также как использовать обратную связь для следующей попытки.','Как работает приложение (англ.) →'],
 fr:['Ressources facultatives','Pour aller plus loin','Un livre numérique en allemand avec des cas, des expressions utiles et des structures d’entretien. Une ressource facultative, distincte de l’application.','Obtenir le livre numérique','Découvrez les exercices d’Anamnese, d’Aufklärung, d’Arzt–Arzt et d’écrit, et comment utiliser le retour pour votre prochaine tentative.','Comment fonctionne l’application (en anglais) →'],
 tr:['İsteğe bağlı kaynaklar','Daha fazla pratik için','Vakalar, faydalı ifadeler ve görüşme yapıları içeren Almanca dijital kitap. Uygulamadan ayrı, isteğe bağlı bir kaynak.','Dijital kitabı edinin','Anamnese, Aufklärung, Arzt–Arzt ve yazma alıştırmalarını keşfedin; geri bildirimin bir sonraki denemenize nasıl yardımcı olduğunu görün.','Uygulama nasıl çalışır (İngilizce) →'],
};
export default function ArticleLearningResources({german=false,arabic=false,locale}:{german?:boolean;arabic?:boolean;locale?:Locale}) {
 const lang:Locale=locale||(arabic?'ar':'en'),[label,eyebrow,book,bookCta,app,appCta]=copy[lang],prefix=localePrefix(blogLocale(lang)),en=lang==='en';
 return <section id="optional-resources" aria-label={label} className="my-12 grid gap-5 md:grid-cols-2">
  <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row md:flex-col lg:flex-row">
   <a href={bookCheckout} className="shrink-0 self-start"><Image unoptimized loading="lazy" src="/images/products/book-cover.png" alt="FaMED Protokoll 2026" width={778} height={1100} className="w-20 rounded shadow-sm sm:w-24" /></a>
   <div><p className="text-xs font-bold uppercase tracking-wide text-slate-600">{eyebrow}</p><h2 className="mt-2 text-xl font-bold text-slate-900">FaMED Protokoll 2026</h2>
    <p className="mt-3 text-sm leading-relaxed text-slate-700">{en&&german?'Digitales Buch mit Fällen, Redemitteln und Gesprächsstruktur.':book}</p>
    <a className="mt-5 inline-block rounded-lg bg-blue-700 px-4 py-3 font-bold text-white" href={bookCheckout}>{en&&german?'Digitales Buch erhalten':bookCta}</a>
   </div>
  </div>
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><Image unoptimized loading="lazy" src="/images/products/logo.png" alt="FaMED Prep App" width={200} height={82} className="mb-5 h-12 w-auto object-contain"/><h2 className="text-xl font-bold text-slate-900">FaMED Prep App</h2><p className="mt-3 leading-relaxed text-slate-700">{app}</p><a className="mt-5 inline-block font-semibold text-blue-700 underline" href={`${prefix}/blog/famed-prep-app-so-funktionierts`}>{appCta}</a></div>
 </section>;
}
