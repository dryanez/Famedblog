import {articleDestination} from '@/lib/article-destination';
import AppPracticeCTA from '@/components/AppPracticeCTA';
import AppWalkthrough from './AppWalkthrough';
import { languageAlternates, type Locale } from '@/lib/languages';
import { seoTitle } from '@/lib/seo-title';
import { redirect,notFound } from 'next/navigation';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import HeroGuideForm from '@/components/HeroGuideForm';
import { guideOffer } from '@/lib/guide-offer';
import { Send } from 'lucide-react';
import ArticleLearningResources from '@/components/ArticleLearningResources';
import { headingId, nodeText, relatedSlugs } from '@/lib/article-navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://famed-vorbereitung.com';

export async function articleMetadata(slug: string, locale: Locale = 'en') {
  const prefix = locale === 'en' ? '' : '/'+locale;
  const post = getPostBySlug(slug, locale);

  if (!post || post.status !== 'published') {
    return {
      title: 'Post Not Found'
    };
  }

  const metaDesc = post.excerpt || `${post.content.substring(0, 155).replace(/[#*`_\n]/g, '').trim()}...`;
  const articleDate = (() => {
    try {
      const d = new Date(post.date);
      return isNaN(d.getTime()) ? new Date('2026-09-08').toISOString() : d.toISOString();
    } catch {
      return new Date('2026-09-08').toISOString();
    }
  })();

  return {
    title: seoTitle(post.title),
    description: metaDesc,
    keywords: post.tags || ['FaMED', 'Fachsprachenprüfung', 'medical German', 'FSP', 'Approbation'],
    alternates: languageAlternates(`${prefix}/blog/${post.slug}`),
    openGraph: {
      type: 'article',
      locale:locale==='ar'?'ar_AR':locale==='es'?'es_ES':'en_US',
      url: `${siteUrl}${prefix}/blog/${post.slug}`,
      title: post.title,
      description: metaDesc,
      publishedTime: articleDate,
      modifiedTime: post.updated || articleDate,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: metaDesc,
      images: ['/og-image.png'],
    },
  };
}

export default async function BlogArticle({ slug, locale = 'en' }: { slug: string; locale?: Locale }) {
  const prefix = locale === 'en' ? '' : '/'+locale;
  const ar = locale === 'ar'; const es=locale==='es'; const offer = guideOffer[locale];
  if(slug==='famed-protokoll-buch-vorschau')redirect('https://www.paypal.com/ncp/payment/DQCLR47JB5DXU?utm_source=blog&utm_medium=legacy_preview&utm_campaign=contextual_book');
  const post = getPostBySlug(slug, locale);

  if (!post || post.status !== 'published') {
    notFound();
  }

  // Get related posts (exclude current)
  const allPosts = getAllPosts(locale);
  const recommended = relatedSlugs[slug] || [];
  const published = allPosts.filter(p => p.slug !== slug && p.status === 'published');
  const relatedPosts = [...published].sort((a,b) => {
    const score = (p: typeof a) => (recommended.includes(p.slug)?100:0)+(p.tags||[]).filter(t=>(post.tags||[]).includes(t)).length*5+(p.category===post.category?2:0);
    return score(b)-score(a);
  }).slice(0,3);
  const headings = [...post.content.matchAll(/^## (.+)$/gm)].map(m=>({text:m[1].replace(/[\*_~]/g,''),id:headingId(m[1].replace(/[\*_~]/g,''))}));
  const german = false;

  const articleDate = (() => {
    try {
      const d = new Date(post.date);
      return isNaN(d.getTime()) ? new Date('2026-09-08').toISOString() : d.toISOString();
    } catch {
      return new Date('2026-09-08').toISOString();
    }
  })();

  // Structured Data for SEO & LLMs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        inLanguage: locale,
        '@id': `${siteUrl}${prefix}/blog/${slug}#article`,
        headline: post.title,
        description: post.excerpt || `${post.content.substring(0, 150).replace(/[#*`_\n]/g, '').trim()}...`,
        image: `${siteUrl}/og-image.png`,
        datePublished: articleDate,
        dateModified: post.updated || articleDate,
        author: {
          '@type': 'Organization',
          name: 'FaMED Test Prep Team',
          url: siteUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'FaMED Test Prep',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteUrl}${prefix}/blog/${slug}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteUrl}${prefix}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${siteUrl}${prefix}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `${siteUrl}${prefix}/blog/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <article lang={locale} dir={ar ? 'rtl' : 'ltr'} className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Article Header */}
      <header className="border-b border-slate-200 bg-[#f4f8fd] px-5 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`${prefix}/blog`}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline-offset-4 hover:underline"
          >
            {ar ? 'العودة إلى المدونة' : es ? '← Volver a los artículos' : '← Back to Blog'}
          </Link>
          <p className="mt-4 text-sm font-bold uppercase tracking-wider text-blue-700">{post.category}</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-5 text-xl leading-relaxed text-slate-600">{post.excerpt}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">FaMED Prep</span>
            <span aria-hidden="true">·</span>
            <time>{post.date}</time>
            <span aria-hidden="true">·</span>
            <span>{ar ? post.readTime.replace('min','دقائق') : es ? post.readTime + ' de lectura' : post.readTime + ' read'}</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="px-5 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {headings.length>2 && <nav aria-label={ar?'في هذا المقال':es?'En este artículo':'In this article'} className="mb-10 rounded-2xl bg-[#f4f8fd] p-6 ring-1 ring-blue-100"><p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-900">{ar?'في هذا المقال':es?'En este artículo':'In this article'}</p><ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">{headings.map((h,i)=><li key={i}><a className="font-medium text-blue-700 underline-offset-4 hover:underline" href={`#${h.id}`}>{h.text}</a></li>)}</ul></nav>}
          {slug === 'famed-prep-app-so-funktionierts' && <AppWalkthrough arabic={ar} spanish={es}/>}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                // Map HTML elements to styled components if needed
                table: ({ node, ...props }) => <div className="my-8 max-w-full overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200" role="region" aria-label={ar ? 'جدول المقال' : es ? 'Tabla del artículo' : 'Article table'} tabIndex={0}><table {...props} /></div>,
                h2: ({ node, ...props }) => <h2 id={headingId(nodeText(node))} className="scroll-mt-24 mt-12 mb-4 text-3xl font-extrabold tracking-tight text-slate-900" {...props} />,
                h3: ({ node, ...props }) => <h3 className="mt-8 mb-3 text-xl font-bold text-slate-900" {...props} />,
                p: ({ node, ...props }) => <p className="mb-5 text-lg leading-8 text-slate-700" {...props} />,
                a: ({ node, ...props }) => <a className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900" {...props} href={articleDestination(props.href,slug,locale)} />,
                img: ({ node, alt, ...props }) => {
                  const src = typeof props.src === 'string' ? props.src : '';
                  const productCover = src === '/images/products/book-cover.png';
                  const preview = productCover || src.startsWith('/images/previews/');
                  const book = src.includes('/book-2026-');
                  return <img {...props} alt={alt || 'Article illustration'} loading={preview ? 'eager' : 'lazy'} width={productCover ? 778 : preview ? (book ? 997 : 1280) : undefined} height={productCover ? 1100 : preview ? (book ? 1500 : 720) : undefined} className="mx-auto my-6 max-h-[900px] h-auto w-auto max-w-full rounded-xl border border-slate-200 object-contain" />;
                },
                ul: ({ node, ...props }) => <ul className="mb-6 list-disc space-y-2 ps-6 marker:text-blue-700" {...props} />,
                li: ({ node, ...props }) => <li className="text-lg leading-8 text-slate-700" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Straight into the matching free app exercise */}
          <AppPracticeCTA slug={slug} locale={locale} />

          {/* Free guide signup */}
          <section aria-labelledby="article-guide" className="my-14 rounded-3xl bg-blue-800 p-6 text-white sm:p-10">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-200">{offer.free}</p>
            <h2 id="article-guide" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{offer.cta}</h2>
            <div className="mt-6"><HeroGuideForm locale={locale} id="article" dark/></div>
          </section>

          <ArticleLearningResources locale={locale} />

          {/* Telegram CTA */}
          <div className="my-12 flex flex-wrap items-center gap-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Send aria-hidden="true" className="h-6 w-6" /></span>
            <div className="min-w-0 flex-1 basis-60">
              <h3 className="text-lg font-bold text-slate-900">{ar ? 'انضم إلى المجتمع' : es ? 'Únete a la comunidad' : 'Join the Community'}</h3>
              <p className="mt-1 text-slate-600">{ar ? 'ناقش أسئلة الدراسة واعثر على مصادر التحضير.' : es ? 'Comparte preguntas de estudio y descubre recursos de preparación.' : 'Share study questions and find preparation resources.'}</p>
            </div>
            <a
              href="https://t.me/+vgtsHuqtwfk4MTJh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 shrink-0 items-center rounded-xl bg-blue-700 px-6 font-bold text-white transition hover:bg-blue-800"
            >
              {ar ? 'انضم عبر تيليغرام' : es ? 'Unirme a Telegram →' : 'Join Telegram →'}
            </a>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <section className="bg-[#f4f8fd] px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{ar ? 'تابع القراءة' : es ? 'Sigue leyendo' : 'Continue Reading'}</h2>
            <Link href={`${prefix}/blog`} className="inline-flex min-h-11 items-center font-semibold text-blue-700 underline-offset-4 hover:underline">
              {ar ? 'العودة إلى جميع المقالات' : es ? 'Ver todos los artículos →' : 'All posts →'}
            </Link>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => <BlogCard key={relatedPost.slug} {...relatedPost} locale={locale} />)}
          </div>
        </div>
      </section>
    </article>
  );
}
