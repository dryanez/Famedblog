// One-click unsubscribe from the guide follow-up emails (link + List-Unsubscribe header). Marks every guide request of that email as withdrawn.
import {supabaseAdmin} from '@/lib/supabase-admin';
// @ts-ignore Pure helpers are covered by scripts/guide-followups.test.mjs.
import {verify} from '@/lib/guide-followups.mjs';
export const dynamic='force-dynamic';
const headers={'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'};
const page=(msg:string,status=200)=>new Response(`<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><title>FaMED Prep</title><body style="font:18px/1.7 Arial;margin:40px auto;padding:24px;max-width:640px;color:#1f2937"><h1>FaMED Prep</h1><p>${msg}</p></body></html>`,{status,headers});
async function run(request:Request){
 const u=new URL(request.url);let email='';try{email=Buffer.from(u.searchParams.get('e')||'','base64url').toString('utf8').toLowerCase();}catch{}
 const secret=process.env.CRON_SECRET||'';
 if(!secret||!verify(email,u.searchParams.get('s')||'',secret))return page('Invalid link / Enlace no válido / رابط غير صالح',400);
 const {error}=await supabaseAdmin.from('guide_requests').update({withdrawn_at:new Date().toISOString()}).eq('email',email).is('withdrawn_at',null);
 if(error)return page('Please try again later / Inténtalo más tarde',503);
 return page('You are unsubscribed. You will not receive more FaMED follow-up emails.<br>Te has dado de baja. No recibirás más correos de seguimiento de FaMED.<br>تم إلغاء اشتراكك.');
}
export const GET=run; export const POST=run;
