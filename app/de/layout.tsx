import SiteLayout,{siteMetadata} from '@/components/SiteLayout';
export const metadata={...siteMetadata,openGraph:{...siteMetadata.openGraph,locale:'de_DE'}};
export default function Layout({children}:{children:React.ReactNode}){return <SiteLayout locale="de">{children}</SiteLayout>;}
