'use client';

import { useState } from 'react';
import { submitLead } from '@/app/actions';

export default function LeadMagnetCTA() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setStatus('idle');

        const result = await submitLead(formData);

        setIsLoading(false);
        if (result.success) {
            setStatus('success');
            setMessage(result.message);
        } else {
            setStatus('error');
            setMessage(result.message || 'Something went wrong.');
        }
    }

    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 my-12 text-white shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-3xl font-bold mb-4">
                    Pass Your FAMED Exam in Just 8 Weeks!
                </h3>
                <p className="text-xl mb-6 text-blue-100">
                    Get our FREE Complete FAMED Preparation Roadmap sent directly to your inbox.
                </p>

                {status === 'success' ? (
                    <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-6">
                        <svg className="w-12 h-12 mx-auto mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <h4 className="text-xl font-bold mb-2">Success! check your inbox.</h4>
                        <p>{message}</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="mr-3 text-green-300">✓</span>
                                    <span>8-week day-by-day study timeline</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-green-300">✓</span>
                                    <span>Sample questions & model answers from actual FAMED cases</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-green-300">✓</span>
                                    <span>Top 10 common mistakes to avoid</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-green-300">✓</span>
                                    <span>Essential vocabulary lists & communication frameworks</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-3 text-green-300">✓</span>
                                    <span>Access to preparation community with 500+ candidates</span>
                                </li>
                            </ul>
                        </div>

                        <form action={handleSubmit} className="max-w-md mx-auto space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Your First Name"
                                    required
                                    className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 outline-none"
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email Address"
                                    required
                                    className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Sending...' : 'Send Me The Study Plan →'}
                            </button>
                            {status === 'error' && (
                                <p className="text-red-200 text-sm mt-2 font-bold">{message}</p>
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
