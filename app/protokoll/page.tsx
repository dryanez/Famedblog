import ClientSecureDocViewer from '@/components/ClientSecureDocViewer';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FaMED Protokoll 2026 - FaMED Test Prep',
    description: 'Offizielles Vorbereitungsprotokoll für die FaMED Prüfung.',
};

export default function ProtokollPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-bold text-xl text-blue-900">
                            FaMED
                        </Link>
                        <div className="h-6 w-px bg-gray-300 mx-2"></div>
                        <h1 className="font-semibold text-gray-700">FaMED Protokoll</h1>
                    </div>
                    <Link
                        href="/blog"
                        className="text-sm text-gray-600 hover:text-blue-600 font-medium"
                    >
                        Startseite
                    </Link>
                </div>
            </header>

            {/* Viewer Content */}
            <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
                <div className="max-w-4xl w-full mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-sm text-blue-800 flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <span className="font-semibold block mb-1">Geschütztes Dokument</span>
                            Dieses Dokument ist nur zur Ansicht bestimmt. Das Kopieren, Drucken und Herunterladen ist deaktiviert.
                        </div>
                    </div>
                </div>

                <ClientSecureDocViewer url="/documents/famed-protokoll.pdf" />
            </main>

            <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} FaMED Test Prep. Alle Rechte vorbehalten.</p>
            </footer>
        </div>
    );
}
