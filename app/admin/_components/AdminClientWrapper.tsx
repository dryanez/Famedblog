'use client';

import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export function AdminClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <DarkModeProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                <DarkModeToggle />
                {children}
            </div>
        </DarkModeProvider>
    );
}
