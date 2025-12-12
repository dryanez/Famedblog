"use client";

import dynamic from "next/dynamic";

const SecureDocViewer = dynamic(() => import("./SecureDocViewer"), {
    ssr: false,
    loading: () => <div className="p-10 text-center text-gray-400">Loading viewer...</div>
});

export default function ClientSecureDocViewer(props: { url: string }) {
    return <SecureDocViewer {...props} />;
}
