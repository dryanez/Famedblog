import type { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';

export const metadata: Metadata = {
    title: 'Blog - FAMED Exam Preparation Tips & Guides',
    description: 'Expert tips, study guides, and strategies for passing the FAMED medical German language exam. Learn from doctors who passed on their first try.',
};

export default function BlogPage() {
    const blogPosts = [
        {
            title: "FAMED vs FSP: Complete Comparison Guide 2025",
            excerpt: "Understand the key differences between FAMED and FSP exams, including structure, recognition, timing, and which one is right for your situation.",
            slug: "famed-vs-fsp-complete-guide",
            date: "Dec 7, 2024",
            readTime: "8 min",
            category: "Exam Guide"
        },
        {
            title: "8-Week FAMED Study Plan: Pass on Your First Try",
            excerpt: "A realistic, day-by-day study plan covering all 76 official FAMED cases. Includes Anamnese, Aufklärung, Arzt-Arzt, and Brief preparation with multiple activities per day.",
            slug: "8-week-famed-study-plan",
            date: "Dec 7, 2024",
            readTime: "12 min",
            category: "Study Tips"
        },
        {
            title: "Top 10 FAMED Mistakes (And How to Avoid Them)",
            excerpt: "Learn the most common mistakes candidates make in the FAMED exam and how to avoid them for a successful first attempt. From using 'Du' instead of 'Sie' to poor time management.",
            slug: "top-10-famed-mistakes",
            date: "Dec 6, 2024",
            readTime: "6 min",
            category: "Tips & Tricks"
        },
        {
            title: "Mastering Anamnese: Complete Guide to Patient History",
            excerpt: "Learn how to conduct a thorough patient history in German using the SAMPLER and OPQRST frameworks. Includes all 13 official Anamnese cases.",
            slug: "mastering-anamnese-guide",
            date: "Dec 5, 2024",
            readTime: "10 min",
            category: "Station Guide"
        },
        {
            title: "Aufklärung Mastery: Informed Consent in German",
            excerpt: "Complete guide to explaining medical procedures to patients in German. Covers all 19 official Aufklärung cases with sample scripts and vocabulary.",
            slug: "aufklarung-mastery-guide",
            date: "Dec 4, 2024",
            readTime: "11 min",
            category: "Station Guide"
        },
        {
            title: "Arzt-Arzt Communication: The Most Important Station",
            excerpt: "Master the Arzt-Arzt station (1/3 of your exam!) with SBAR framework, passive voice, and professional presentation skills. All 29+ cases covered.",
            slug: "arzt-arzt-communication-guide",
            date: "Dec 3, 2024",
            readTime: "13 min",
            category: "Station Guide"
        }
    ];

    return (
        <div className="py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-gray-900">
                        FAMED Exam Blog
                    </h1>
                    <p className="text-xl text-gray-600">
                        Expert tips, study guides, and proven strategies to help you pass the FAMED exam on your first try
                    </p>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {blogPosts.map((post) => (
                        <BlogCard key={post.slug} {...post} />
                    ))}
                </div>

                {/* Categories */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Browse by Category</h2>
                    <div className="flex flex-wrap gap-3">
                        <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition">
                            All Posts
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                            Exam Guide
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                            Study Tips
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                            Station Guide
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                            Tips & Tricks
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
