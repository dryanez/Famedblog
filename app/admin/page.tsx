"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Dashboard } from './_components/Dashboard';

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            // Check for simple admin cookie
            const isAdmin = document.cookie.split('; ').find(row => row.startsWith('admin_session='));

            if (!isAdmin) {
                router.push('/admin/login');
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
        );
    }

    return <Dashboard />;
}
