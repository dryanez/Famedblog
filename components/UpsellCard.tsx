'use client';

import Image from 'next/image';

export default function UpsellCard() {
    return (
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-600 relative text-left">
            {/* Banner */}
            <div className="bg-blue-600 text-white text-center py-3 font-bold text-lg tracking-wide uppercase">
                Wait! One Time Offer
            </div>

            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    {/* Left: Content */}
                    <div className="flex-1">
                        {/* 1. Header Section (Moved TOP) */}
                        <div className="mb-4 text-center md:text-left">
                            <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">
                                THE FaMED 2026 PROTOKOLL • More than 300+ Pages
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                                Pass Your FaMED Exam <span className="text-green-600">3x Faster</span>
                            </h2>
                        </div>

                        {/* 2. Body Text */}
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                            The study plan tells you <strong>what</strong> to do. Our official Preparation Book teaches you <strong>everything you need to know</strong> in one resource. <span className="font-bold text-blue-800 bg-blue-50 px-1 rounded">All Current Cases!!!</span>
                        </p>

                        {/* 3. Bullets */}
                        <ul className="space-y-2 mb-8 text-left inline-block w-full">
                            {[
                                "Targeted Grammar & Vocabulary",
                                "Complete Anamnese Scripts",
                                "Standardized Aufklärung Patterns",
                                "Arzt-Arzt Simulation Frameworks",
                                "Brief Cases (Arztbriefe)",
                                "All of them in one book!"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center text-gray-700 font-medium">
                                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* 4. CTA */}
                        <div>
                            <a
                                href="https://buy.stripe.com/8x228sdcZ0QNebifjX7Re0h"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-green-600 text-white text-center px-8 py-5 rounded-xl font-bold text-2xl hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Get The Official Book Now →
                            </a>
                            <p className="text-center text-xs text-gray-400 mt-3">
                                Secure Payment via Stripe • Instant Access
                            </p>
                        </div>
                    </div>

                    {/* Right: Visual/Price */}
                    <div className="hidden md:block w-64 relative transform rotate-3 hover:rotate-0 transition duration-500">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
                            <Image
                                src="/book%20mockup%20website%20german%20(1).png"
                                alt="FaMED Protokoll Book"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-blue-900 font-bold px-5 py-3 rounded-full shadow-lg transform rotate-3 flex flex-col items-center leading-none">
                            <span className="text-xs line-through opacity-60 mb-1">€49.99</span>
                            <span className="text-2xl">€19.99</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
