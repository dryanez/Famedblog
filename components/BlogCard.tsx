import {blogLocale,localePrefix,type Locale} from '@/lib/languages';
import Link from 'next/link';

interface BlogCardProps {
    arabic?: boolean;
    locale?: Locale;
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    readTime: string;
    category: string;
}

const moreLabel:Record<Locale,string>={en:'Read more',de:'Weiterlesen',ar:'اقرأ المزيد',es:'Leer más',ru:'Читать (англ.)',fr:'Lire (en anglais)',tr:'Oku (İngilizce)'};
const readLabel=(t:string,l?:Locale)=>l==='es'?t+' de lectura':l==='de'?t+' Lesezeit':l==='ru'?t.replace('min','мин'):l==='tr'?t.replace('min','dk'):l==='fr'?t+' de lecture':t+' read';
export default function BlogCard({ title, excerpt, slug, date, readTime, category, arabic=false,locale }: BlogCardProps) {
    return (
        <Link href={`${localePrefix(blogLocale(locale||(arabic?'ar':'en')))}/blog/${slug}`} className="group block h-full">
            <article className="flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/10 hover:ring-blue-300">
                {/* Category */}
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{category}</p>

                {/* Title */}
                <h3 className="mt-3 line-clamp-2 text-xl font-extrabold leading-snug tracking-tight text-slate-900 transition group-hover:text-blue-700">
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="mt-3 line-clamp-3 flex-1 leading-relaxed text-slate-600">
                    {excerpt}
                </p>

                {/* Meta + read more */}
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 text-sm">
                    <span className="text-slate-500">{date} · {arabic?readTime.replace('min','دقائق'):readLabel(readTime,locale)}</span>
                    <span className="flex shrink-0 items-center gap-1.5 font-semibold text-blue-700">
                        {arabic?'اقرأ المزيد':moreLabel[locale||'en']}
                        <svg aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </article>
        </Link>
    );
}
