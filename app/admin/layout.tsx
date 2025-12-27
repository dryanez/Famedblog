// Force dynamic rendering for all admin pages
export const dynamic = 'force-dynamic';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Temporarily disabled dark mode due to deployment issues
    // TODO: Re-enable AdminClientWrapper when dark mode is fixed
    return (
        <div className="min-h-screen bg-white">
            {children}
        </div>
    );
}
