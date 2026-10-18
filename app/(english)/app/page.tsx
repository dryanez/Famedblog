import PublicPage,{publicMetadata} from '@/components/PublicPage';
export const metadata=publicMetadata('/app');
export default function Page(){return <PublicPage route="/app"/>;}
