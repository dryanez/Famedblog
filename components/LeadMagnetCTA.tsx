'use client';

import Link from 'next/link';

export default function LeadMagnetCTA() {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 my-12 text-white shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-3xl font-bold mb-4">
                    Pass Your FAMED Exam in Just 8 Weeks!
                </h3>
                <p className="text-xl mb-6 text-blue-100">
                    Download our FREE Complete FAMED Preparation Roadmap
                </p>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
                    <ul className="text-left space-y-3 mb-6">
                        <li className="flex items-start">
                            <svg className="w-6 h-6 mr-3 flex-shrink-0 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>8-week day-by-day study timeline covering all 76 official cases</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 mr-3 flex-shrink-0 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Sample questions & model answers from actual FAMED cases</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 mr-3 flex-shrink-0 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Top 10 common mistakes to avoid</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 mr-3 flex-shrink-0 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Essential vocabulary lists & communication frameworks</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 mr-3 flex-shrink-0 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Access to preparation community with 500+ candidates</span>
                        </li>
                    </ul>
                </div>

                <Link
                    href="/lead-magnet"
                    className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    Download Free Guide →
                </Link>

                <p className="mt-4 text-sm text-blue-100">
                    No credit card required • Instant download • 40+ pages
                </p>
            </div>
        </div>
    );
}
