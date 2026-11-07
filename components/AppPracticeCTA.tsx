import {appPracticePath,appPracticeUrl} from '@/lib/article-destination';
import type {Locale} from '@/lib/languages';

// Exercise names stay German (they are the exam's own terms); only the generic "case" is translated.
const caseWord:Record<Locale,string>={en:'case',es:'caso clínico',ar:'الحالة',ru:'клинический случай',fr:'cas clinique',tr:'vaka'};
const topicOf=(path:string,locale:Locale)=>({'/anamnese':'Anamnese','/aufklaerung':'Aufklärung','/brief':'Arztbrief','/medicalcases':caseWord[locale]} as Record<string,string>)[path]||'FaMED';

const copy:Record<Locale,{title:(t:string)=>string;text:string;cta:string}>={
 en:{title:t=>`Practise this ${t} now, free`,text:'Open the FaMED Prep app and try a real exam-style task in your browser. No account, no card needed.',cta:'Start practising →'},
 es:{title:t=>`Practica este ${t} ahora, gratis`,text:'Abre la app FaMED Prep y prueba una tarea real tipo examen en tu navegador. Sin cuenta y sin tarjeta.',cta:'Empezar a practicar →'},
 ar:{title:t=>`تدرّب على ${t} الآن مجانًا`,text:'افتح تطبيق FaMED Prep وجرّب مهمة حقيقية مثل الامتحان في متصفحك. بدون حساب وبدون بطاقة.',cta:'ابدأ التدريب ←'},
 ru:{title:t=>`Потренируйте ${t} прямо сейчас бесплатно`,text:'Откройте приложение FaMED Prep и попробуйте реальное задание в формате экзамена в браузере. Без регистрации и без карты.',cta:'Начать тренировку →'},
 fr:{title:t=>`Entraînez-vous à ce ${t} maintenant, gratuitement`,text:"Ouvrez l'application FaMED Prep et essayez une vraie tâche de type examen dans votre navigateur. Sans compte, sans carte.",cta:"Commencer l'entraînement →"},
 tr:{title:t=>`Bu ${t} için şimdi ücretsiz pratik yapın`,text:'FaMED Prep uygulamasını açın ve tarayıcınızda gerçek sınav tarzı bir görevi deneyin. Hesap ve kart gerekmez.',cta:'Pratiğe başla →'},
};

/** Article box that drops readers straight into the matching free app exercise (not the landing page). */
export default function AppPracticeCTA({slug,locale}:{slug:string;locale:Locale}){
 const c=copy[locale]||copy.en;const topic=topicOf(appPracticePath(slug),locale);
 return <section dir={locale==='ar'?'rtl':'ltr'} className="my-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-slate-900 sm:flex sm:items-center sm:justify-between sm:gap-6">
  <div><h3 className="text-xl font-bold text-emerald-900">{c.title(topic)}</h3><p className="mt-2 text-sm leading-relaxed text-emerald-800">{c.text}</p></div>
  <a href={appPracticeUrl(slug,locale)} className="mt-4 inline-block flex-shrink-0 rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 sm:mt-0">{c.cta}</a>
 </section>;
}
