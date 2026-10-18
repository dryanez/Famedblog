import PublicPage,{publicMetadata} from '@/components/PublicPage';
export const metadata=publicMetadata('/book');
export default function Page(){return <PublicPage route="/book"/>;}
