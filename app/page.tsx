import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import LeadMagnetCTA from '@/components/LeadMagnetCTA';

export default function Home() {
  const featuredPosts = [
    {
      title: "FAMED vs FSP: Complete Comparison Guide 2025",
      excerpt: "Understand the key differences between FAMED and FSP exams, including structure, recognition, and which one is right for you.",
      slug: "famed-vs-fsp-complete-guide",
      date: "Dec 7, 2024",
      readTime: "8 min",
      category: "Exam Guide"
    },
    {
      title: "8-Week FAMED Study Plan: Pass on Your First Try",
      excerpt: "A realistic, day-by-day study plan covering all 76 official FAMED cases. Includes Anamnese, Aufklärung, Arzt-Arzt, and Brief preparation.",
      slug: "8-week-famed-study-plan",
      date: "Dec 7, 2024",
      readTime: "12 min",
      category: "Study Tips"
    },
    {
      title: "Top 10 FAMED Mistakes (And How to Avoid Them)",
      excerpt: "Learn the most common mistakes candidates make in the FAMED exam and how to avoid them for a successful first attempt.",
      slug: "top-10-famed-mistakes",
      date: "Dec 6, 2024",
      readTime: "6 min",
      category: "Tips & Tricks"
    }
  ];

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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lead-magnet"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg inline-block"
              >
                Get Free Study Guide →
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
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
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">€490</div>
              <div className="text-gray-600">Exam Fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* What is FAMED Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
              What is the FAMED Exam?
            </h2>
            <div className="prose prose-lg mx-auto">
              <p className="text-lg text-gray-700 mb-6">
                FAMED (Fachsprachenprüfung Medizin) is a medical language examination for international
                doctors seeking to work in Germany. It tests your ability to communicate in German at a
                C1 level in medical contexts.
              </p>

              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Exam Structure</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Anamnese (2 × 10 min)</h4>
                      <p className="text-gray-600">Taking patient history - you get TWO cases</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Aufklärung (10 min)</h4>
                      <p className="text-gray-600">Explaining procedures to patients (informed consent)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Arzt-Arzt (10 min)</h4>
                      <p className="text-gray-600">Presenting cases to supervisors - 1/3 of entire exam!</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Brief (20 min)</h4>
                      <p className="text-gray-600">Writing medical documentation (Arztbrief)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                <p className="text-green-800 font-semibold mb-2">✓ Recognition</p>
                <p className="text-green-700">
                  Recognized in Bayern, Rheinland-Pfalz, Sachsen (EU only), and Baden-Württemberg (case-by-case)
                </p>
              </div>
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
