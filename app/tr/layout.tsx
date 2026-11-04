import SiteLayout,{siteMetadata} from '@/components/SiteLayout';
export const metadata={...siteMetadata,openGraph:{...siteMetadata.openGraph,locale:'tr_TR'}};
export default function Layout({children}:{children:React.ReactNode}){return <SiteLayout locale="tr">{children}</SiteLayout>;}
