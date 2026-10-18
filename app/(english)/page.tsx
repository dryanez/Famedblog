import PublicPage,{publicMetadata} from '@/components/PublicPage';
export const metadata=publicMetadata('/');
export default function Page(){return <PublicPage route="/"/>;}
