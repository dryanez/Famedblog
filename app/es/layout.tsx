import SiteLayout,{siteMetadata} from '@/components/SiteLayout';
export const metadata={...siteMetadata,openGraph:{...siteMetadata.openGraph,locale:'es_ES'}};
export default function Layout({children}:{children:React.ReactNode}){return <SiteLayout locale="es">{children}</SiteLayout>;}
