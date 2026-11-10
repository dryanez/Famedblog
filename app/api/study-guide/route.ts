import {supabaseAdmin} from '@/lib/supabase-admin';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
// @ts-ignore Shared plain-JS module.
import {GUIDE_PDF_LOCALES} from '@/lib/lead-request.mjs';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const headers={'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer'};
 const params=new URL(request.url).searchParams,token=params.get('token')||'',lang=params.get('lang')||'';
 if(!/^[a-f0-9]{64}$/.test(token))return new Response('Request the guide through the form / Solicita la guía mediante el formulario.',{status:404,headers});
 const hash=createHash('sha256').update(token).digest('hex');
 const {data,error}=await supabaseAdmin.from('guide_requests').select('locale').eq('guide_token_hash',hash).single();
 if(error||!data||!GUIDE_PDF_LOCALES.includes(data.locale))return new Response('Guide link not found',{status:404,headers});
 // The PDF follows the page language (&lang=de|ru|fr|tr) when given; otherwise the stored en/ar/es locale.
 const locale=GUIDE_PDF_LOCALES.includes(lang)?lang:data.locale;
 const pdf=await readFile(join(process.cwd(),'content','guides',`famed-study-guide-${locale}.pdf`));
 return new Response(pdf,{headers:{...headers,'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="FaMED-8-Week-Study-Guide-${locale}.pdf"`}});
}
