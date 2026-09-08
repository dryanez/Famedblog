import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Medical Career in Germany | Free Job Placement & Accommodation',
    description: 'Start your medical career in Germany with free accommodation, online B2/FSP/FaMED classes, and full bureaucracy support. Partnered with Veldener HR Referenten.',
};

export default function CareerPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section - High Impact */}
            <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 text-center">
                    <span className="inline-block py-2 px-4 rounded-full bg-yellow-400 text-blue-900 text-sm font-bold uppercase tracking-wider mb-8 shadow-lg">
                        Exclusive Partner Offer
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Start Your Medical Career <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                            in Germany Keyless & Stress-Free
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto font-light">
                        We don't just find you a job. We give you a <strong>home</strong> and <strong>education</strong> to get started.
                        <span className="block mt-2 font-semibold text-white">All for 0€.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://www.vhr-referenten.de/kontakt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl text-xl font-bold hover:bg-yellow-300 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                        >
                            Get Your Free Consultation
                        </a>
                    </div>
                </div>
            </section>

            {/* The "POP" Feature Highlights - Why Us? */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Doctors Choose Our Partner <span className="text-blue-600">VHR</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            Most agencies just send your CV. We build your entire foundation in Germany.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {/* Feature 1: Accommodation */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-600 transform hover:scale-105 transition duration-300">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Free Accommodation</h3>
                            <p className="text-gray-600 text-center">
                                <strong>Up to 2 months free stay</strong> in Bavaria (near Nuremberg) while you handle your paperwork and interviews. No worries about rent.
                            </p>
                        </div>

                        {/* Feature 2: Education */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-yellow-500 transform hover:scale-105 transition duration-300 relative">
                            <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-lg text-blue-900">MOST POPULAR</div>
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.747 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Full Online Education</h3>
                            <p className="text-gray-600 text-center">
                                <strong>Free Online Classes</strong> for B2, FSP (Medical Language), and FaMED. No B2 certificate? No problem – start fast.
                            </p>
                        </div>

                        {/* Feature 3: Support */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-500 transform hover:scale-105 transition duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">100% Free Paperwork</h3>
                            <p className="text-gray-600 text-center">
                                We handle the entire bureaucracy: Approbation, Visa support, and job placement in Clinics & MVZs.
                            </p>
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                        <div className="bg-gray-50 border-b border-gray-200 p-6 text-center">
                            <h3 className="text-2xl font-bold text-gray-900">The VHR Advantage</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white">
                                        <th className="px-6 py-4 text-left text-gray-500 font-medium w-1/3">Feature</th>
                                        <th className="px-6 py-4 text-center text-gray-400 font-medium w-1/3">Typical Agency</th>
                                        <th className="px-6 py-4 text-center text-blue-600 font-bold text-lg w-1/3 bg-blue-50">Our Partner (VHR)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="px-6 py-4 text-gray-700 font-medium">Job Placement</td>
                                        <td className="px-6 py-4 text-center text-gray-500">
                                            <svg className="w-6 h-6 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </td>
                                        <td className="px-6 py-4 text-center bg-blue-50">
                                            <svg className="w-6 h-6 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-700 font-medium">Free Accommodation</td>
                                        <td className="px-6 py-4 text-center text-gray-400">
                                            <svg className="w-6 h-6 mx-auto text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </td>
                                        <td className="px-6 py-4 text-center bg-blue-50">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-8 h-8 text-green-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                <span className="text-xs font-bold text-blue-700">2 Months Free (Bavaria)</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-700 font-medium">Online Classes (B2/FSP/FaMED)</td>
                                        <td className="px-6 py-4 text-center text-gray-400">
                                            <span className="text-sm">Paid or Basic</span>
                                        </td>
                                        <td className="px-6 py-4 text-center bg-blue-50">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-8 h-8 text-green-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                <span className="text-xs font-bold text-blue-700">Full Intensive Online</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-700 font-medium">Starts without B2 Certificate</td>
                                        <td className="px-6 py-4 text-center text-gray-400">
                                            <svg className="w-6 h-6 mx-auto text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </td>
                                        <td className="px-6 py-4 text-center bg-blue-50">
                                            <svg className="w-6 h-6 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-gray-700 font-medium">Visa & Paperwork Support</td>
                                        <td className="px-6 py-4 text-center text-gray-500">
                                            <span className="text-sm">Basic</span>
                                        </td>
                                        <td className="px-6 py-4 text-center bg-blue-50">
                                            <span className="text-sm font-bold text-blue-800">Full VIP Support</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Partner Section */}
            <section className="bg-white py-16 md:py-24 border-t border-gray-100">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">About <span className="text-blue-600">Veldener HR Referenten</span></h2>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        We partner with VHR because they go above and beyond. They believe in <strong>equality and transparency.</strong>
                        Whether you need a job in Anesthesia, Internal Medicine, Surgery, or Psychiatry — their network is your network.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-semibold">Bavaria / Southern Germany</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-semibold">Northern & Eastern Germany</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-900 py-20">
                <div className="container mx-auto px-4 max-w-4xl text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Stop Worrying. Start Working.</h2>
                    <p className="text-xl text-blue-100 mb-10">
                        Accommodation, language training, and career, all sorted.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <a
                            href="https://www.vhr-referenten.de/kontakt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-blue-900 px-10 py-4 rounded-xl text-xl font-bold hover:bg-gray-100 transition shadow-lg"
                        >
                            Contact VHR Now
                        </a>
                        <a
                            href="mailto:info@vhr-referenten.de"
                            className="border-2 border-white text-white px-10 py-4 rounded-xl text-xl font-bold hover:bg-white/10 transition"
                        >
                            Email Us
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
