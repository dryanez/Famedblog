'use client';

import { useState } from 'react';
import { submitLead } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function LeadMagnetPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('firstName', name);

        try {
            const result = await submitLead(formData);

            if (result.success) {
                setSubmitted(true);
                // Trigger download
                const link = document.createElement('a');
                link.href = '/2026%20Protokol%20Famed.pdf';
                link.download = '2026_Protokol_Famed.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Redirect to book page after short delay
                setTimeout(() => {
                    router.push('/book');
                }, 1500);
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-16 px-4">
                <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-xl p-12">
                    <div className="text-6xl mb-6">🎉</div>
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">Success!</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Your FREE 8-Week FAMED Study Plan is downloading now!
                    </p>
                    <p className="text-gray-600 mb-8">
                        Check your email for additional resources and tips to help you pass the FAMED exam.
                    </p>
                    <a
                        href="/2026%20Protokol%20Famed.pdf"
                        download
                        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition mb-4"
                    >
                        Download Again
                    </a>
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-gray-700 font-semibold mb-4">Want more help?</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/exam" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                                Practice Exam →
                            </a>
                            <a href="/blog" className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition">
                                Read Blog →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                        Pass Your FAMED Exam in Just 8 Weeks!
                    </h1>
                    <p className="text-2xl text-gray-700 mb-4">
                        Download Your FREE Complete FAMED Preparation Roadmap
                    </p>
                    <p className="text-lg text-gray-600">
                        No credit card required • Instant download • 40+ pages
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Benefits */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">What's Inside:</h2>
                        <ul className="space-y-4">
                            {[
                                "8-week day-by-day study timeline covering ALL 76 official cases",
                                "Sample questions & model answers from actual FAMED cases",
                                "Top 10 common mistakes to avoid",
                                "Essential vocabulary lists by medical specialty",
                                "Complete frameworks (SAMPLER, SBAR, OPQRST)",
                                "Exam day checklist and tips",
                                "Access to preparation community with 500+ candidates",
                                "Practice resources from famedtestprep.com"
                            ].map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                            <p className="text-blue-900 font-semibold mb-2">✓ Based on Official FAMED Structure</p>
                            <p className="text-blue-800 text-sm">
                                This guide covers the correct exam structure: 3 stations + 20-minute Brief,
                                with proper emphasis on Arzt-Arzt (1/3 of exam).
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Get Your Free Guide</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                                    placeholder="Dr. Maria Schmidt"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                                    placeholder="maria@example.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Download Free Guide →'}
                            </button>

                            <p className="text-xs text-gray-500 text-center">
                                We respect your privacy. Unsubscribe anytime.
                            </p>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600 text-center mb-4">
                                Trusted by 500+ FAMED candidates
                            </p>
                            <div className="flex justify-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
