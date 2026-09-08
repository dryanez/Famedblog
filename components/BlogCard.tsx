import Link from 'next/link';

interface BlogCardProps {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    readTime: string;
    category: string;
}

export default function BlogCard({ title, excerpt, slug, date, readTime, category }: BlogCardProps) {
    return (
        <Link href={`/blog/${slug}`}>
            <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full border border-gray-100">
                <div className="p-6">
                    {/* Category Badge */}
                    <div className="mb-3">
                        <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                            {category}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition line-clamp-2">
                        {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                        {excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{date}</span>
                        <span>{readTime} read</span>
                    </div>
                </div>

                {/* Read More */}
                <div className="px-6 pb-6">
                    <div className="text-blue-600 font-semibold flex items-center group">
                        Read More
                        <svg
                            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </article>
        </Link>
    );
}
