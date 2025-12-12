import { notFound } from 'next/navigation';
import Link from 'next/link';
import LeadMagnetCTA from '@/components/LeadMagnetCTA';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: post.title,
    description: `${post.title} - ${post.readTime} read`,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (exclude current)
  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.slug !== slug)
    .slice(0, 2);

  // Structured Data for SEO & LLMs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || `${post.content.substring(0, 150)}...`,
    image: 'https://famedtestprep.com/og-image.jpg', // Add a real default image later
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Organization',
      name: 'FaMED Test Prep Team',
      url: 'https://famedtestprep.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FaMED Test Prep',
      logo: {
        '@type': 'ImageObject',
        url: 'https://famedtestprep.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://famedtestprep.com/blog/${slug}`,
    },
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
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                // Map HTML elements to styled components if needed
                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="text-gray-700" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Telegram CTA */}
          <div className="my-12 p-6 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-blue-900 mb-1">Join the Community</h3>
              <p className="text-blue-700 text-sm">Get daily tips and connect with 500+ doctors.</p>
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
