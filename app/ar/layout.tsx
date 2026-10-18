import SiteLayout,{siteMetadata} from '@/components/SiteLayout';
export const metadata={...siteMetadata,openGraph:{...siteMetadata.openGraph,locale:'ar_AR'}};
export default function Layout({children}:{children:React.ReactNode}){return <SiteLayout locale="ar">{children}</SiteLayout>;}
