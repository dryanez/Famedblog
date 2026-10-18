import { notFound } from 'next/navigation';
import Link from 'next/link';
import LeadMagnetCTA from '@/components/LeadMagnetCTA';
import ArticleLearningResources from '@/components/ArticleLearningResources';
import { headingId, nodeText, relatedSlugs } from '@/lib/article-navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://famed-vorbereitung.com';

export async function generateStaticParams() {
  const posts = getAllPosts().filter(post => post.status === 'published');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

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
    title: post.title,
    description: metaDesc,
    keywords: post.tags || ['FaMED', 'Fachsprachenprüfung', 'medical German', 'FSP', 'Approbation'],
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      url: `${siteUrl}/blog/${post.slug}`,
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

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  // Get related posts (exclude current)
  const allPosts = getAllPosts();
  const recommended = relatedSlugs[slug] || [];
  const published = allPosts.filter(p => p.slug !== slug && p.status === 'published');
  const relatedPosts = [...published].sort((a,b) => {
    const score = (p: typeof a) => (recommended.includes(p.slug)?100:0)+(p.tags||[]).filter(t=>(post.tags||[]).includes(t)).length*5+(p.category===post.category?2:0);
    return score(b)-score(a);
  }).slice(0,3);
  const headings = [...post.content.matchAll(/^## (.+)$/gm)].map(m=>({text:m[1].replace(/[\*_~]/g,''),id:headingId(m[1].replace(/[\*_~]/g,''))}));
  const german = /[äöüß]|\b(?:und|für|deine|dein|funktioniert)\b/i.test(post.title + ' ' + post.content.slice(0, 500));

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
        '@id': `${siteUrl}/blog/${slug}#article`,
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
          '@id': `${siteUrl}/blog/${slug}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${siteUrl}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `${siteUrl}/blog/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Article Header */}
      <header className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition"
            >
              ← Back to Blog
            </Link>
            <div className="mb-4">
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-blue-100">
              <time>{post.date}</time>
              <span>•</span>
              <span>{post.readTime} read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {headings.length>2 && <nav aria-label={german?'In diesem Artikel':'In this article'} className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-5"><p className="mb-2 font-semibold text-slate-900">{german?'In diesem Artikel':'In this article'}</p><ul className="grid gap-2 sm:grid-cols-2">{headings.map((h,i)=><li key={i}><a className="text-sm text-blue-700 underline" href={`#${h.id}`}>{h.text}</a></li>)}</ul></nav>}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                // Map HTML elements to styled components if needed
                h2: ({ node, ...props }) => <h2 id={headingId(nodeText(node))} className="scroll-mt-24 text-2xl font-bold mt-8 mb-4" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                a: ({ node, ...props }) => <a className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900" {...props} />,
                img: ({ node, alt, ...props }) => {
                  const src = typeof props.src === 'string' ? props.src : '';
                  const productCover = src === '/images/products/book-cover.png';
                  const preview = productCover || src.startsWith('/images/previews/');
                  const book = src.includes('/book-2026-');
                  return <img {...props} alt={alt || 'Article illustration'} loading={preview ? 'eager' : 'lazy'} width={productCover ? 778 : preview ? (book ? 997 : 1280) : undefined} height={productCover ? 1100 : preview ? (book ? 1500 : 720) : undefined} className="mx-auto my-6 max-h-[900px] h-auto w-auto max-w-full rounded-xl border border-slate-200 object-contain" />;
                },
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="text-gray-700" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <ArticleLearningResources german={german} />

          {/* Telegram CTA */}
          <div className="my-12 p-6 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-blue-900 mb-1">Join the Community</h3>
              <p className="text-blue-700 text-sm">Share study questions and find preparation resources.</p>
            </div>
            <a
              href="https://t.me/+vgtsHuqtwfk4MTJh"
              target="_blank"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex-shrink-0"
            >
              Join Telegram →
            </a>
          </div>

          {/* Lead Magnet CTA */}
          <div className="mt-8">
            <LeadMagnetCTA />
          </div>

          {/* Related Posts */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Continue Reading</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="block p-6 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition"
                >
                  <div className="text-sm text-blue-600 font-semibold mb-2">
                    {relatedPost.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {relatedPost.title}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {relatedPost.readTime} read
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to All Posts
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
