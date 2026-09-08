'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 relative">
                            <img src="/logo.png" alt="FaMED Logo" className="object-contain w-full h-full" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">FAMED Test Prep</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
                            Home
                        </Link>
                        <Link href="/what-is-famed" className="text-gray-700 hover:text-blue-600 transition font-medium text-blue-900">
                            What is FAMED?
                        </Link>
                        <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition">
                            Blog
                        </Link>
                        <Link href="/exam" className="text-gray-700 hover:text-blue-600 transition">
                            Practice Exam
                        </Link>
                        <Link href="/career" className="text-gray-700 hover:text-blue-600 transition">
                            Career
                        </Link>
                        <Link
                            href="/lead-magnet"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            Free Study Guide
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-4">
                        <Link
                            href="/"
                            className="block text-gray-700 hover:text-blue-600 transition"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/what-is-famed"
                            className="block text-gray-700 hover:text-blue-600 transition font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            What is FAMED?
                        </Link>
                        <Link
                            href="/blog"
                            className="block text-gray-700 hover:text-blue-600 transition"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/exam"
                            className="block text-gray-700 hover:text-blue-600 transition"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Practice Exam
                        </Link>
                        <Link
                            href="/career"
                            className="block text-gray-700 hover:text-blue-600 transition"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Career
                        </Link>
                        <Link
                            href="/lead-magnet"
                            className="block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-center"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Free Study Guide
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}
