import Link from 'next/link';
import BlogCard from './BlogCard';
import LeadMagnetCTA from './LeadMagnetCTA';
import ArticleLearningResources from './ArticleLearningResources';
import {getAllPosts} from '@/lib/posts';
import {getSitePage} from '@/lib/site-pages';
import type {Locale} from '@/lib/languages';

// Keep the homepage's designed layout separate from generic Markdown pages.
export default function HomePage({locale = 'en'}: {locale?: Locale}) {
  const ar = locale === 'ar';
  const prefix = ar ? '/ar' : '';
  const page = getSitePage('/', locale)!;
  const posts = getAllPosts(locale).filter(post => post.status === 'published');
  const practice = [
    {name: 'Anamnese', icon: '🩺', href: '/blog/anamnese-overview-part-1', text: ar ? 'تدرّب على الأسئلة وفهم إجابات المريض وتنظيم القصة المرضية.' : 'Ask focused questions, understand patient answers and structure the history.'},
    {name: 'Aufklärung', icon: '💉', href: '/blog/famed-aufklaerungsgespraech-guide', text: ar ? 'اشرح الإجراءات والفوائد والمخاطر بلغة يفهمها المريض.' : 'Explain procedures, benefits and risks in language a patient can understand.'},
    {name: 'Arzt–Arzt', icon: '👨‍⚕️', href: '/blog/sbar-schema-arzt-arzt-gespraech', text: ar ? 'قدّم الحالة لزميلك بتسلسل واضح وعبارات دقيقة.' : 'Present a case to a colleague with a clear structure and precise phrases.'},
    {name: 'Arztbrief', icon: '📝', href: '/blog/famed-arztbrief-soap-schema', text: ar ? 'حوّل معلومات المريض إلى توثيق طبي ألماني منظّم.' : 'Turn patient information into organised written medical German.'},
  ];
  return <div lang={locale} dir={ar ? 'rtl' : 'ltr'} className="bg-white text-slate-900">
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-5 py-20 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold leading-tight md:text-6xl">{page.title}</h1>
        <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-blue-100 md:text-2xl">{page.excerpt}</p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href={`${prefix}/lead-magnet`} className="rounded-lg bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-lg transition hover:bg-blue-50">{ar ? 'احصل على خطة الدراسة المجانية' : 'Get the free study guide'}</Link>
          <Link href={`${prefix}/blog/famed-protokoll-buch-vorschau`} className="rounded-lg border-2 border-white bg-blue-800 px-8 py-4 text-lg font-bold text-white transition hover:bg-blue-900">{ar ? 'اقرأ عيّنة من الكتاب' : 'Read a sample of the book'}</Link>
        </div>
        <p className="mt-6 text-base text-blue-100">{ar ? 'خطة واضحة · أمثلة تطبيقية · تدريب على التواصل الطبي بالألمانية' : 'A clear study plan · Worked examples · Practical medical German'}</p>
      </div>
    </section>

    <section aria-label={ar ? 'موارد التحضير' : 'Preparation resources'} className="bg-slate-50 px-5 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 text-center sm:grid-cols-3">
        {[[ar ? '٨ أسابيع' : '8 weeks', ar ? 'خطة دراسة مجانية' : 'Free study plan'], [ar ? '٤ مهارات' : '4 skills', 'Anamnese · Aufklärung · Arzt–Arzt · Arztbrief'], [String(posts.length), ar ? 'دليلاً ومثالاً تطبيقياً' : 'Study guides and worked examples']].map(([value, label]) => <div key={value}><p className="text-4xl font-bold text-blue-700">{value}</p><p className="mt-3 text-base leading-relaxed text-slate-600">{label}</p></div>)}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10 text-center"><h2 className="text-3xl font-bold md:text-4xl">{ar ? 'موارد تساعدك على التقدّم' : 'Resources for your next step'}</h2><p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{ar ? 'ابدأ بحالة من الكتاب الرقمي، ثم تعرّف على التدريب التفاعلي في التطبيق.' : 'Start with a case from the digital book, then explore interactive practice in the app.'}</p></div>
      <ArticleLearningResources arabic={ar}/>
    </section>

    <section className="bg-slate-50 px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center"><h2 className="text-3xl font-bold md:text-4xl">{ar ? 'أحدث المقالات' : 'Latest blog posts'}</h2><p className="mt-4 text-lg text-slate-600">{ar ? 'شروحات وأمثلة عملية لمساعدتك في التحضير.' : 'Useful guides and practical examples for your preparation.'}</p></div>
        <div className="grid gap-8 md:grid-cols-3">{posts.slice(0, 3).map(post => <BlogCard key={post.slug} {...post} arabic={ar}/>)}</div>
        <div className="mt-10 text-center"><Link href={`${prefix}/blog`} className="inline-block rounded-lg bg-blue-700 px-8 py-3 font-semibold text-white transition hover:bg-blue-800">{ar ? 'تصفّح جميع المقالات' : 'View all articles →'}</Link></div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-16"><LeadMagnetCTA arabic={ar}/></section>

    <section className="bg-slate-50 px-5 py-16">
      <div className="mx-auto max-w-6xl"><h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">{ar ? 'تدرّب على المهارات الأربع' : 'Practise the four skills'}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{practice.map(item => <Link key={item.name} href={prefix + item.href} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-lg"><div aria-hidden="true" className="mb-4 text-4xl">{item.icon}</div><h3 className="text-xl font-bold text-blue-700">{item.name}</h3><p className="mt-3 leading-relaxed text-slate-600">{item.text}</p></Link>)}</div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-slate-600">{ar ? 'FaMED Prep جهة مستقلة للتحضير. لا نحجز الاختبار الرسمي ولا نضمن نتيجته.' : 'FaMED Prep is an independent preparation provider. We do not book your official exam or guarantee an exam result.'}</p>
      </div>
    </section>
  </div>;
}
