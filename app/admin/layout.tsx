import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { DarkModeToggle } from '@/components/DarkModeToggle';

// Force dynamic rendering for all admin pages (must be in server component)
export const dynamic = 'force-dynamic';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminClientWrapper>
            {children}
        </AdminClientWrapper>
    );
}

// Separate client component for dark mode
function AdminClientWrapper({ children }: { children: React.ReactNode }) {
    'use client';

    return (
        <DarkModeProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                <DarkModeToggle />
                {children}
            </div>
        </DarkModeProvider>
    );
}
