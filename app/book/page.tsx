import Link from 'next/link';
import Image from 'next/image';

export default function BookPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        The Official FaMED Preparation Book
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                        The only resource you need to master protocols, communication strategies, and the deep structure of the FaMED exam.
                    </p>
                </div>
            </section>

            {/* Product Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Product Image */}
                            <div className="bg-gray-100 p-12 flex items-center justify-center">
                                <div className="relative w-full max-w-md aspect-[3/4] shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-500">
                                    <Image
                                        src="/images/blog/famed-protokoll-book-3.jpg"
                                        alt="FaMED Protokoll Book"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="p-12 flex flex-col justify-center">
                                <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mb-6 w-fit">
                                    OFFICIAL GUIDE
                                </div>
                                <h2 className="text-4xl font-bold mb-4 text-gray-900">
                                    FaMED Protokoll & Strategy Guide
                                </h2>
                                <div className="text-3xl font-bold text-blue-600 mb-6">
                                    €49.99
                                </div>

                                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                    Written by exam experts, this book provides a deep dissection of the test format. It includes precise communication protocols for every station (Anamnese, Aufklärung, Arzt-Arzt), ensuring you speak the standard German expected by examiners.
                                </p>

                                <ul className="space-y-4 mb-10">
                                    {[
                                        "Complete Anamnese Checklists",
                                        "Standardized Aufklärung Protocols",
                                        "Arztbrief Templates & Phrases",
                                        "Top 10 Exam Pitfalls to Avoid",
                                        "5 Full-Length Practice Cases"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center text-gray-700">
                                            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="https://famed-vorbereitung.com/checkout/book"
                                    className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-xl hover:bg-blue-700 transition shadow-lg"
                                >
                                    Buy Now - €49.99
                                </Link>
                                <p className="text-center text-sm text-gray-400 mt-4">
                                    Instant Digital Download (PDF) + Physical Copy Shipping
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
