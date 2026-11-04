import SiteLayout,{siteMetadata} from '@/components/SiteLayout';
export const metadata={...siteMetadata,openGraph:{...siteMetadata.openGraph,locale:'fr_FR'}};
export default function Layout({children}:{children:React.ReactNode}){return <SiteLayout locale="fr">{children}</SiteLayout>;}
