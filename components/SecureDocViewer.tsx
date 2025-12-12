"use client";

import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// CSS imports for v9
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure worker locally
if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface SecureDocViewerProps {
    url: string;
}

// --- Icons ---
function ChevronRightIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
    );
}

function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

// --- Sidebar Item Component ---
interface SidebarItemProps {
    item: any;
    onNavigate: (dest: any) => void;
    level?: number;
}

function SidebarItem({ item, onNavigate, level = 0 }: SidebarItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.items && item.items.length > 0;

    // Toggle collapse
    const toggleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    // Handle click on the title itself
    const handleClick = () => {
        if (item.dest) {
            onNavigate(item.dest);
        } else if (hasChildren) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <li className="select-none">
            <div
                className={`
            flex items-center py-1.5 pr-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors
            ${level === 0 ? 'font-medium text-gray-900' : 'text-gray-600 text-sm'}
        `}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={handleClick}
            >
                {/* Chevron for expand/collapse */}
                <div
                    className="w-5 h-5 flex items-center justify-center mr-1 text-gray-400 hover:text-gray-600 rounded"
                    onClick={hasChildren ? toggleOpen : undefined}
                >
                    {hasChildren && (
                        isOpen ? <ChevronDownIcon className="w-3.5 h-3.5" /> : <ChevronRightIcon className="w-3.5 h-3.5" />
                    )}
                </div>

                <span className="truncate flex-1">{item.title}</span>
            </div>

            {/* Render Children */}
            {hasChildren && isOpen && (
                <ul className="mt-0.5">
                    {item.items.map((child: any, idx: number) => (
                        <SidebarItem
                            key={`${child.title}-${idx}`}
                            item={child}
                            onNavigate={onNavigate}
                            level={level + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

export default function SecureDocViewer({ url }: SecureDocViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState<number>(1.2);
    const [windowWidth, setWindowWidth] = useState<number>(1200);
    const [outline, setOutline] = useState<any[]>([]);
    const [pdfProxy, setPdfProxy] = useState<any>(null);

    // Handle document load success
    function onDocumentLoadSuccess(pdf: any) {
        setNumPages(pdf.numPages);
        setPdfProxy(pdf);

        // Get outline
        pdf.getOutline().then((rawOutline: any) => {
            const cleanOutline = filterOutline(rawOutline || []);
            setOutline(cleanOutline);
        });
    }

    // Filter out empty titles
    function filterOutline(items: any[]): any[] {
        return items
            .filter(item => item.title && item.title.trim().length > 0)
            .map(item => ({
                ...item,
                items: item.items ? filterOutline(item.items) : []
            }));
    }

    // Handle navigation from outline
    const handleOutlineClick = async (dest: any) => {
        if (!pdfProxy || !dest) return;

        try {
            let pageIndex = -1;

            // dest can be string (named dest) or array (explicit reference)
            if (typeof dest === 'string') {
                pageIndex = await pdfProxy.getPageIndex(dest);
            } else if (Array.isArray(dest)) {
                const ref = dest[0];
                pageIndex = await pdfProxy.getPageIndex(ref);
            }

            if (pageIndex !== -1) {
                const pageNumber = pageIndex + 1;
                const pageElement = document.getElementById(`page_${pageNumber}`);
                if (pageElement) {
                    // Scroll with offset for sticky header
                    const yOffset = -100;
                    const y = pageElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        } catch (error) {
            console.error("Navigation error:", error);
        }
    };

    // Handle resize for mobile responsiveness
    useEffect(() => {
        setWindowWidth(window.innerWidth);

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Determine widths
    // If sidebar is visible (desktop), reduce content width
    const showSidebar = windowWidth > 900 && outline.length > 0;
    const sidebarWidth = showSidebar ? 280 : 0;
    const pdfWidth = Math.min(windowWidth - sidebarWidth - 64, 850);

    // Prevent right click
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
    }, []);

    return (
        <div
            className="flex select-none min-h-[600px]"
            onContextMenu={handleContextMenu}
        >
            <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
        .react-pdf__Page__canvas {
            display: block;
            user-select: none;
            -webkit-user-select: none;
        }
        .react-pdf__Page__textContent {
            display: none !important;
        }
        .react-pdf__Page__annotations {
            display: block !important;
        }
      `}</style>

            {/* Sidebar - Fixed Position for Scrollability */}
            {showSidebar && (
                <aside className="w-[280px] flex-shrink-0 border-r border-gray-200 mr-8 relative">
                    <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
                        <h3 className="font-bold text-gray-900 mb-3 px-2 text-sm uppercase tracking-wider text-gray-500">Inhalt</h3>
                        <ul className="space-y-0.5 pb-10">
                            {outline.map((item, index) => (
                                <SidebarItem
                                    key={`${item.title}-${index}`}
                                    item={item}
                                    onNavigate={handleOutlineClick}
                                />
                            ))}
                        </ul>
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center">
                {/* Floating Zoom Controls */}
                <div className="mb-6 flex gap-4 sticky top-24 z-20 bg-gray-900/80 text-white backdrop-blur py-1.5 px-4 rounded-full shadow-lg transition-transform hover:scale-105">
                    <button
                        onClick={() => setScale(s => Math.max(0.6, s - 0.2))}
                        className="hover:text-blue-300 font-bold px-2"
                        title="Zoom Out"
                    >
                        −
                    </button>
                    <span className="py-1 font-mono text-sm min-w-[3.5rem] text-center border-l border-r border-gray-600 mx-1">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale(s => Math.min(2.0, s + 0.2))}
                        className="hover:text-blue-300 font-bold px-2"
                        title="Zoom In"
                    >
                        +
                    </button>
                </div>

                <div className="border border-gray-200 shadow-xl rounded-lg overflow-hidden bg-gray-50 p-4 md:p-8">
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="h-96 flex items-center justify-center text-gray-400">Loading protected document...</div>}
                        error={<div className="h-96 flex items-center justify-center text-red-400">Failed to load document.</div>}
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <div key={`page_${index + 1}`} id={`page_${index + 1}`} className="mb-8 relative group">
                                <Page
                                    pageNumber={index + 1}
                                    width={pdfWidth}
                                    scale={scale}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={true}
                                    className="shadow-sm bg-white"
                                />
                            </div>
                        ))}
                    </Document>
                </div>

                <p className="mt-8 mb-12 text-sm text-gray-400 font-medium">
                    Page {numPages} of {numPages}
                </p>
            </div>
        </div>
    );
}
