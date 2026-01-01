'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function BookPromoPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Check if user has already seen/closed the popup (New Year 2026 version)
        const hasSeenPopup = localStorage.getItem('famed_newyear_popup_seen_2026');

        if (!hasSeenPopup) {
            // Delay showing the popup (e.g., 10 seconds)
            const timer = setTimeout(() => {
                setShouldRender(true);
                // Small delay to allow render before animating opacity
                requestAnimationFrame(() => setIsVisible(true));
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Wait for animation to finish before unmounting
        setTimeout(() => setShouldRender(false), 500);
        // Mark as seen
        localStorage.setItem('famed_newyear_popup_seen_2026', 'true');
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
        >
            <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-xl shadow-2xl border-2 border-purple-400 overflow-hidden w-[22rem] md:w-96">
                {/* Sparkle decorations */}
                <div className="absolute top-2 left-2 text-2xl animate-pulse">✨</div>
                <div className="absolute top-2 right-12 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>🎉</div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 z-10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* "LAST DAY" Badge */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-500 text-white text-center py-1 text-xs font-bold uppercase tracking-wide">
                    ⚡ LAST DAY OFFER - ENDS TONIGHT ⚡
                </div>

                {/* Content */}
                <div className="flex mt-7">
                    {/* Image Section (Small) */}
                    <div className="w-1/3 bg-gradient-to-br from-purple-100 to-blue-100 relative">
                        <Image
                            src="/images/blog/famed-protokoll-book-3.jpg"
                            alt="Book"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Text Section */}
                    <div className="w-2/3 p-5">
                        <div className="text-2xl mb-1 text-center">
                            🎉
                        </div>
                        <div className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1 text-center">
                            Happy New Year Special
                        </div>
                        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight mb-2 text-center">
                            50% OFF + Free Book!
                        </h3>
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed text-center">
                            Start 2026 right! Get full access + the FaMED Protokoll Book.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                            <p className="text-xs font-bold text-blue-800 text-center">
                                💪 Study Smart. Pass the Test!
                            </p>
                        </div>

                        <a
                            href="https://famed-vorbereitung.com/pricing"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleClose}
                            className="block w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-center py-2.5 rounded-lg text-sm font-bold transition-all shadow-md transform hover:scale-105"
                        >
                            🎁 Claim My Gift Now →
                        </a>
                        <p className="text-xs text-red-600 font-semibold text-center mt-2">
                            ⏰ Offer ends at midnight!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
