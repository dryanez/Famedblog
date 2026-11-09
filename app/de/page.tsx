import {redirect} from 'next/navigation';
// German has articles only for now; /de goes to the German blog.
export default function Page(){redirect('/de/blog');}
