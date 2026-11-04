import SiteLayout,{siteMetadata} from '@/components/SiteLayout';
export const metadata={...siteMetadata,openGraph:{...siteMetadata.openGraph,locale:'ru_RU'}};
export default function Layout({children}:{children:React.ReactNode}){return <SiteLayout locale="ru">{children}</SiteLayout>;}
