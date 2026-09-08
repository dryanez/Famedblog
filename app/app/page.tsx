import Link from 'next/link';

export default function AppPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        FaMED Test Simulation App
                    </h1>
                    <p className="text-xl text-gray-600">
                        Practice like it's the real exam. Anytime, anywhere.
                    </p>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            📱 Realistic Test Simulation
                        </h3>
                        <p className="text-gray-600">
                            Experience the exact format and timing of the FaMED exam with our authentic simulation engine.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            📊 Track Your Progress
                        </h3>
                        <p className="text-gray-600">
                            Monitor your performance across all topics and identify areas for improvement.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            💬 Anamnese Practice
                        </h3>
                        <p className="text-gray-600">
                            Master communication skills with guided Anamnese scenarios and feedback.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            📚 Integrated with Protokoll
                        </h3>
                        <p className="text-gray-600">
                            Seamlessly access case studies from the FaMED Protokoll Book while practicing.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Practicing?</h2>
                    <p className="text-lg mb-6 opacity-90">
                        Download the FaMED App and start simulating the test today
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <a
                            href="https://apps.apple.com/app/famed"
                            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            📱 Download for iOS
                        </a>
                        <a
                            href="https://play.google.com/store/apps/famed"
                            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            🤖 Download for Android
                        </a>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">
                        Looking for comprehensive case studies?
                    </p>
                    <Link
                        href="/protokoll"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        Check out the FaMED Protokoll Book →
                    </Link>
                </div>
            </div>
        </div>
    );
}
