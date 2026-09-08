'use client';

import { useState } from 'react';
import { submitLead } from '@/app/actions';
import UpsellCard from '@/components/UpsellCard';

export default function LeadMagnetCTA() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log('Form submitting...');

        setIsLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            const formData = new FormData(e.currentTarget);
            const result = await submitLead(formData);
            console.log('Result:', result);

            setIsLoading(false);
            if (result.success) {
                setStatus('success');
                setMessage(result.message);
            } else {
                setStatus('error');
                setMessage(result.message || 'Something went wrong.');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setIsLoading(false);
            setStatus('error');
            setMessage('An unexpected error occurred. Please try again.');
        }
    }

    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 my-12 text-white shadow-xl">
            {/* Same header content... */}
            <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-3xl font-bold mb-4">
                    Pass Your FAMED Exam in Just 8 Weeks!
                </h3>
                <p className="text-xl mb-6 text-blue-100">
                    Get our FREE Complete FAMED Preparation Roadmap sent directly to your inbox.
                </p>

                {status === 'success' ? (
                    <div className="animate-fade-in space-y-8">
                        <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow-inner">
                            <svg className="w-16 h-16 mx-auto mb-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <h4 className="text-2xl font-bold mb-2">Check your inbox!</h4>
                            <p>{message}</p>
                        </div>
                        <div className="text-black transform scale-100 origin-top">
                            <UpsellCard />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                            {/* List items unchanged */}
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="mr-3 text-green-300">✓</span>
                                    <span>8-week day-by-day study timeline</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-green-300">✓</span>
                                    <span>Sample questions & model answers</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-green-300">✓</span>
                                    <span>Top 10 common mistakes</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-green-300">✓</span>
                                    <span>Essential vocabulary lists</span>
                                </li>
                            </ul>
                        </div>

                        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Your First Name"
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 outline-none"
                                    style={{ backgroundColor: 'white' }}
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email Address"
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 outline-none"
                                    style={{ backgroundColor: 'white' }}
                                />
                            </div>
                            <div>
                                <input
                                    type="date"
                                    name="examDate"
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 outline-none"
                                    style={{ backgroundColor: 'white' }}
                                    placeholder="When is your exam?"
                                />
                            </div>
                            <div>
                                <select
                                    name="germanLevel"
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-300 outline-none"
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <option value="">Your German Level</option>
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
                                disabled={isLoading}
                                className="w-full bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : 'Send Me The Study Plan →'}
                            </button>
                            {status === 'error' && (
                                <p className="bg-red-100 text-red-800 p-3 rounded text-sm mt-2 font-bold border border-red-200">{message}</p>
                            )}
                        </form>
                    </>
                )}

                <p className="mt-6 text-sm text-blue-200">
                    No spam. Unsubscribe anytime. High-yield content only.
                </p>
            </div>
        </div>
    );
}
