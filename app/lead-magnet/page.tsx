'use client';

import { useState } from 'react';
import { submitLead } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import UpsellCard from '@/components/UpsellCard';

export default function LeadMagnetPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [examDate, setExamDate] = useState('');
    const [germanLevel, setGermanLevel] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('firstName', name);
        formData.append('examDate', examDate);
        formData.append('germanLevel', germanLevel);

        try {
            const result = await submitLead(formData);

            if (result.success) {
                setSubmitted(true);
                // Email will be sent with download link - no auto-download
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
                <div className="max-w-4xl mx-auto w-full">
                    {/* Success Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                            <span className="text-4xl">📧</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 text-gray-900">Check your email!</h1>
                        <p className="text-xl text-gray-600">
                            We've sent your FREE 8-Week FAMED Study Plan to <strong>{email}</strong>
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Didn't receive it? Check your spam folder or{' '}
                            <a href="mailto:support@famed-vorbereitung.com" className="text-blue-600 underline">
                                contact support
                            </a>
                        </p>
                    </div>

                    {/* ONE TIME OFFER CARD */}
                    <UpsellCard />

                    <div className="text-center mt-8">
                        <button
                            onClick={() => window.location.reload()}
                            className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                            No thanks, I'll stick to the free plan
                        </button>
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

                            <div>
                                <label htmlFor="examDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                    When is your FaMED exam?
                                </label>
                                <input
                                    type="date"
                                    id="examDate"
                                    value={examDate}
                                    onChange={(e) => setExamDate(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                                />
                            </div>

                            <div>
                                <label htmlFor="germanLevel" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your German Level
                                </label>
                                <select
                                    id="germanLevel"
                                    value={germanLevel}
                                    onChange={(e) => setGermanLevel(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                                >
                                    <option value="">Select your level</option>
                                    <option value="A1">A1 - Beginner</option>
                                    <option value="A2">A2 - Elementary</option>
                                    <option value="B1">B1 - Intermediate</option>
                                    <option value="B2">B2 - Upper Intermediate</option>
                                    <option value="C1">C1 - Advanced</option>
                                    <option value="C2">C2 - Proficient</option>
                                </select>
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
