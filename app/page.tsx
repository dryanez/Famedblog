import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import LeadMagnetCTA from '@/components/LeadMagnetCTA';
import { getAllPosts } from '@/lib/posts';

export default function Home() {
  const allPosts = getAllPosts();
  // Filter for published posts and take the first 3
  const featuredPosts = allPosts
    .filter(post => post.status === 'published')
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Pass Your FAMED Exam on the First Try
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Complete preparation for the Fachsprachenprüfung Medizin.
              Expert study guides, practice cases, and proven strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/lead-magnet"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg inline-block"
              >
                Get Free Study Guide
              </Link>
              <Link
                href="/exam"
                className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-400 transition border-2 border-white inline-block"
              >
                Practice Exam
              </Link>
            </div>
            <p className="mt-6 text-blue-200">
              ✓ All 76 official cases  ✓ 8-week study plan  ✓ Expert tips
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">76</div>
              <div className="text-gray-600">Official Cases</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">8</div>
              <div className="text-gray-600">Week Study Plan</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Students Helped</div>
            </div>

          </div>
        </div>
      </section>



      {/* Featured Blog Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Latest Blog Posts</h2>
            <p className="text-xl text-gray-600">Expert tips and guides to help you succeed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View All Posts →
            </Link>
          </div>
        </div>
      </section>

      {/* Lead Magnet CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <LeadMagnetCTA />
        </div>
      </section>

      {/* Practice Resources */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Practice Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Link href="/anamnese" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition group">
              <div className="text-4xl mb-4">🩺</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">Anamnese</h3>
              <p className="text-gray-600">13 practice cases</p>
            </Link>

            <Link href="/aufklaerung" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition group">
              <div className="text-4xl mb-4">💉</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">Aufklärung</h3>
              <p className="text-gray-600">19 procedures</p>
            </Link>

            <Link href="/medicalcases" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition group">
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">Arzt-Arzt</h3>
              <p className="text-gray-600">29+ cases</p>
            </Link>

            <Link href="/brief" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition group">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">Brief</h3>
              <p className="text-gray-600">10 Arztbrief cases</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
