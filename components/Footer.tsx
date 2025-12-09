import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">FAMED Test Prep</h3>
                        <p className="text-gray-400 text-sm">
                            Complete preparation for the FAMED medical German language exam.
                            Pass on your first try with our expert study guides and practice materials.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-white transition">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-400 hover:text-white transition">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/exam" className="text-gray-400 hover:text-white transition">
                                    Practice Exam
                                </Link>
                            </li>
                            <li>
                                <Link href="/lead-magnet" className="text-gray-400 hover:text-white transition">
                                    Free Study Guide
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/anamnese" className="text-gray-400 hover:text-white transition">
                                    Anamnese Practice
                                </Link>
                            </li>
                            <li>
                                <Link href="/aufklaerung" className="text-gray-400 hover:text-white transition">
                                    Aufklärung Practice
                                </Link>
                            </li>
                            <li>
                                <Link href="/medicalcases" className="text-gray-400 hover:text-white transition">
                                    Arzt-Arzt Cases
                                </Link>
                            </li>
                            <li>
                                <Link href="/brief" className="text-gray-400 hover:text-white transition">
                                    Brief Practice
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>Email: info@famedtestprep.com</li>
                            <li>
                                <Link href="/community" className="hover:text-white transition">
                                    Join Community
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} FAMED Test Prep. All rights reserved.</p>
                    <p className="mt-2">
                        Helping international doctors succeed in Germany 🇩🇪
                    </p>
                </div>
            </div>
        </footer>
    );
}
