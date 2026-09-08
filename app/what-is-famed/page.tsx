import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'What is the FAMED Exam? | FAMED Test Prep',
    description: 'Everything you need to know about the FAMED (Fachsprachenprüfung Medizin) exam for international doctors in Germany. Exam structure, costs, and recognition.',
};

export default function WhatIsFamedPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            What is the FAMED Exam?
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                            FAMED (<span className="italic">Fachsprachenprüfung Medizin</span>) is a specialized medical language examination designed for international doctors seeking to work in Germany. It rigorously tests your ability to communicate in German at a C1 level within medical contexts.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="py-12 bg-gray-50 -mt-10 relative z-10 container mx-auto px-4 rounded-xl shadow-lg max-w-5xl">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">

                    <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">76</div>
                        <div className="text-gray-600 font-medium">Official Cases</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                        <div className="text-gray-600 font-medium">Students Helped</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">8</div>
                        <div className="text-gray-600 font-medium">Week Study Plan</div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">

                    {/* Exam Structure */}
                    <section className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Exam Structure</h2>
                            <p className="text-gray-600 text-lg">The examination consists of four key parts designed to simulate real-life medical scenarios.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Part 1 */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">1</div>
                                    <h3 className="text-xl font-bold text-gray-900">Anamnese</h3>
                                    <span className="ml-auto text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">2 × 10 min</span>
                                </div>
                                <p className="text-gray-600">Taking patient history. You will be presented with <span className="font-semibold text-gray-900">TWO</span> different cases to assess your flexibility and breadth of knowledge.</p>
                            </div>

                            {/* Part 2 */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">2</div>
                                    <h3 className="text-xl font-bold text-gray-900">Aufklärung</h3>
                                    <span className="ml-auto text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">10 min</span>
                                </div>
                                <p className="text-gray-600">Explaining procedures to patients (informed consent). Tests your ability to translate complex medical terms into patient-friendly language.</p>
                            </div>

                            {/* Part 3 */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 ring-4 ring-blue-50/50 hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">CRITICAL</div>
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">3</div>
                                    <h3 className="text-xl font-bold text-gray-900">Arzt-Arzt</h3>
                                    <span className="ml-auto text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">10 min</span>
                                </div>
                                <p className="text-gray-600">Presenting cases to supervisors. This section is essentially the most critical part, often weighted as <span className="font-semibold text-gray-900">1/3 of the entire exam!</span></p>
                            </div>

                            {/* Part 4 */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">4</div>
                                    <h3 className="text-xl font-bold text-gray-900">Brief</h3>
                                    <span className="ml-auto text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">20 min</span>
                                </div>
                                <p className="text-gray-600">Writing medical documentation (<span className="italic">Arztbrief</span>). Tests your written professional communication.</p>
                            </div>
                        </div>
                    </section>

                    {/* Recognition Map/Section */}
                    <section className="bg-gray-50 rounded-3xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Recognition in Germany</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span className="text-lg text-gray-700">Bayern</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span className="text-lg text-gray-700">Rheinland-Pfalz</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-amber-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="text-lg text-gray-700">Sachsen <span className="text-gray-500 text-sm">(EU only)</span></span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-amber-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="text-lg text-gray-700">Baden-Württemberg <span className="text-gray-500 text-sm">(case-by-case)</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    The FAMED exam is a widely recognized alternative to the standard Fachsprachenprüfung (FSP) in several key German states. Its structured approach and case-based testing make it a popular choice for international doctors.
                                </p>
                                <div className="flex gap-4">
                                    <Link href="/lead-magnet" className="flex-1 bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                                        Get Study Plan
                                    </Link>
                                    <Link href="/" className="flex-1 border border-gray-300 text-gray-700 text-center px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold">
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
