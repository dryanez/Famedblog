import { AdminClientWrapper } from './_components/AdminClientWrapper';

// Force dynamic rendering for all admin pages
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
