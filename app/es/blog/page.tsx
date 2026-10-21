import {languageAlternates} from '@/lib/languages';
import {getAllPosts} from '@/lib/posts';
import BlogList from '@/app/(english)/blog/BlogList';
export const metadata={title:'Blog de preparación para FaMED',description:'Guías y ejercicios en español con práctica en alemán.',alternates:languageAlternates('/es/blog')};
export default function Page(){return <BlogList locale="es" initialPosts={getAllPosts('es').filter(p=>p.status==='published')}/>;}
