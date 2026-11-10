import PublicPage,{publicMetadata} from '@/components/PublicPage';
// German homepage (main pages in German since Nov 2026; articles under /de/blog).
export async function generateMetadata(){return publicMetadata('/','de');}
export default function Page(){return <PublicPage route="/" locale="de"/>;}
