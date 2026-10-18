export default function AppWalkthrough({arabic=false}:{arabic?:boolean}){
 const locale=arabic?'ar':'en';const base='https://famed-vorbereitung.com';
 const schema={'@context':'https://schema.org','@type':'VideoObject',name:arabic?'كيف تتدرّب في تطبيق FaMED Prep':'FaMED Prep: from practice case to AI feedback',description:arabic?'عرض حقيقي لحالة خيالية: اختيار المهمة والاستماع والكتابة ومراجعة الملاحظات ثم المحاولة مجدداً.':'An edited real app recording: choose a fictional case, listen, write, review AI feedback and apply a correction.',thumbnailUrl:base+'/videos/famed-app-poster.jpg',uploadDate:'2026-10-19T01:00:00+02:00',duration:'PT48S',contentUrl:base+`/videos/famed-app-walkthrough-${locale}.mp4`,inLanguage:locale};
 return <section aria-label={arabic?'شاهد طريقة التدريب':'Watch a real practice session'} className="my-8 rounded-2xl border border-slate-200 bg-slate-950 p-3 sm:p-5">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
  <h2 className="mb-3 text-xl font-bold text-white">{arabic?'شاهد: من الحالة إلى الملاحظات في ٤٨ ثانية':'Watch: from case to feedback in 48 seconds'}</h2>
  <video controls playsInline preload="none" width={1280} height={848} poster="/videos/famed-app-poster.jpg" className="w-full rounded-xl" aria-label={arabic?'تسجيل فعلي للتطبيق مع شرح بالعربية':'Real app recording with English explanations'}>
   <source src={`/videos/famed-app-walkthrough-${locale}.mp4`} type="video/mp4"/>
   <track kind="captions" srcLang="en" label="English" src="/videos/famed-app-en.vtt"/>
   <track kind="captions" srcLang="ar" label="العربية" src="/videos/famed-app-ar.vtt"/>
   <a href={`/videos/famed-app-walkthrough-${locale}.mp4`}>{arabic?'افتح الفيديو':'Open the video'}</a>
  </video>
  <p className="mt-3 text-sm leading-relaxed text-slate-300">{arabic?'تسجيل مختصر من التطبيق الفعلي بحساب عرض وحالة خيالية. تم اختصار الانتظار؛ الملاحظات مولّدة فعلياً بالذكاء الاصطناعي وليست نتيجة امتحان رسمية أو تجربة طالب. تختلف المهام المتاحة حسب الخطة.':'Edited recording of the actual app using a demo account and fictional case. Waiting is shortened. The AI response is real practice feedback, not an official exam result or a student testimonial. Task access varies by plan.'}</p>
  <details className="mt-3 text-sm text-slate-200"><summary className="cursor-pointer font-semibold">{arabic?'خطوات العرض نصياً':'Read the walkthrough steps'}</summary><ol className="mt-3 list-decimal space-y-2 ps-5">{(arabic?['اختر حالة كتابة متاحة.','استمع إلى الحالة واقرأ التعليمات.','اكتب إجابتك اعتماداً على المعلومات المعطاة.','أرسلها للمراجعة وانتظر الملاحظات.','راجع التعليقات المحددة.','طبّق تصحيحاً واحداً في المحاولة التالية.']:['Choose an available writing case.','Listen to the case and read its instructions.','Write a practice answer using the supplied information.','Submit it and wait for the feedback.','Review the specific comments.','Apply one correction in your next attempt.']).map(s=><li key={s}>{s}</li>)}</ol></details>
 </section>;
}
