import {supabaseAdmin} from '@/lib/supabase-admin';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const headers={'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer'};
 const token=new URL(request.url).searchParams.get('token')||'';
 if(!/^[a-f0-9]{64}$/.test(token))return new Response('Request the guide through the form / Solicita la guía mediante el formulario.',{status:404,headers});
 const hash=createHash('sha256').update(token).digest('hex');
 const {data,error}=await supabaseAdmin.from('guide_requests').select('locale').eq('guide_token_hash',hash).single();
 if(error||!data||!['en','ar','es'].includes(data.locale))return new Response('Guide link not found',{status:404,headers});
 const html=await readFile(join(process.cwd(),'content','guides',`famed-study-plan-${data.locale}.html`),'utf8');
 return new Response(html,{headers:{...headers,'Content-Type':'text/html; charset=utf-8'}});
}
