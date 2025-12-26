'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function BookPromoPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Check if user has already seen/closed the popup
        const hasSeenPopup = localStorage.getItem('famed_book_popup_seen_v1');

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
        localStorage.setItem('famed_book_popup_seen_v1', 'true');
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
        >
            <div className="relative bg-white rounded-xl shadow-2xl border-2 border-blue-500 overflow-hidden w-[22rem] md:w-96">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 z-10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="flex">
                    {/* Image Section (Small) */}
                    <div className="w-1/3 bg-gray-100 relative">
                        <Image
                            src="/images/blog/famed-protokoll-book-3.jpg"
                            alt="Book"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Text Section */}
                    <div className="w-2/3 p-5">
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                            One Time Offer
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                            Pass Your Exam 3x Faster?
                        </h3>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            Get the official protocols and scripts used by 500+ doctors.
                        </p>

                        <a
                            href="https://buy.stripe.com/8x228sdcZ0QNebifjX7Re0h"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleClose} // Allow re-opening? No, treat as conversion/seen
                            className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg text-sm font-bold transition-colors shadow-md"
                        >
                            Get The Book (€49)
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
