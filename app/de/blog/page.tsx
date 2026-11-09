import {languageAlternates} from '@/lib/languages';
import {getAllPosts} from '@/lib/posts';
import BlogList from '@/app/(english)/blog/BlogList';
export const metadata={title:'FaMED-Prüfung: Artikel auf Deutsch',description:'Leitfäden auf Deutsch zur FaMED-Prüfung: Ablauf, Kosten, Anerkennung, FaMED oder FSP und wie Sie mit der FaMED Prep App online üben.',alternates:languageAlternates('/de/blog')};
export default function Page(){return <BlogList locale="de" initialPosts={getAllPosts('de').filter(p=>p.status==='published')}/>;}
