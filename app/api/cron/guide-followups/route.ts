// Daily: day-1 (free app case) and day-3 (book offer) emails to everyone who requested the free guide.
// Skips unsubscribed people, buyers and anyone already sent that step. Logged in email_logs (email_type guide_d1/guide_d3).
// ?dry=1 lists who would receive what without sending.
import {NextResponse} from 'next/server';
import {Resend} from 'resend';
import {supabaseAdmin} from '@/lib/supabase-admin';
// @ts-ignore Pure helpers are covered by scripts/guide-followups.test.mjs.
import {selectRecipients,followupEmail} from '@/lib/guide-followups.mjs';
export const dynamic='force-dynamic';

export async function GET(request:Request){
 const secret=process.env.CRON_SECRET;
 if(!secret||request.headers.get('authorization')!==`Bearer ${secret}`)return NextResponse.json({error:'Unauthorized'},{status:401});
 const dry=new URL(request.url).searchParams.get('dry')==='1';
 const since=new Date(Date.now()-5*864e5).toISOString();
 const {data:requests,error}=await supabaseAdmin.from('guide_requests').select('email,first_name,locale,created_at,withdrawn_at').gte('created_at',since);
 if(error)return NextResponse.json({error:'guide_requests unavailable'},{status:503});
 const emails=[...new Set((requests||[]).map(r=>String(r.email).toLowerCase()))];
 const sent=new Set<string>(),buyers=new Set<string>(),withdrawn=new Set<string>();
 if(emails.length){
  const {data:logs}=await supabaseAdmin.from('email_logs').select('to_email,email_type').in('email_type',['guide_d1','guide_d3']).in('to_email',emails);
  for(const l of logs||[])sent.add(String(l.to_email).toLowerCase()+'|'+String(l.email_type).replace('guide_',''));
  const {data:off}=await supabaseAdmin.from('guide_requests').select('email').in('email',emails).not('withdrawn_at','is',null);
  for(const w of off||[])withdrawn.add(String(w.email).toLowerCase());
  const {data:guests}=await supabaseAdmin.from('guest_purchases').select('email,status').in('email',emails).in('status',['paid','claimed']);
  for(const g of guests||[])buyers.add(String(g.email).toLowerCase());
  const {data:users}=await supabaseAdmin.from('users').select('id,email').in('email',emails);
  const ids=(users||[]).map(u=>u.id);
  if(ids.length){const {data:paid}=await supabaseAdmin.from('payment_fulfillments').select('user_id').in('user_id',ids);const paidIds=new Set((paid||[]).map(p=>p.user_id));for(const u of users||[])if(paidIds.has(u.id))buyers.add(String(u.email).toLowerCase());}
 }
 const recipients=selectRecipients(requests||[],{sent,buyers,withdrawn});
 if(dry)return NextResponse.json({dry:true,count:recipients.length,recipients:recipients.map((r:any)=>({step:r.step,locale:r.locale,email:r.email.replace(/^(.).*(@.*)$/,'$1***$2')}))});
 if(!process.env.RESEND_API_KEY)return NextResponse.json({error:'RESEND_API_KEY missing'},{status:503});
 const resend=new Resend(process.env.RESEND_API_KEY);const results=[];
 for(const r of recipients){
  const m=followupEmail(r,secret);
  const res=await resend.emails.send({from:'FaMED Prep <team@famed-vorbereitung.com>',to:r.email,subject:m.subject,html:m.html,text:m.text,headers:m.headers},{idempotencyKey:`guide-${r.step}/${r.email}`});
  await supabaseAdmin.from('email_logs').insert({to_email:r.email,from_email:'team@famed-vorbereitung.com',subject:m.subject,email_type:'guide_'+r.step,status:res.error?'failed':'sent',provider:'resend',message_id:res.data?.id||null,error_message:res.error?String(res.error.message||res.error):null,metadata:{locale:r.locale}});
  results.push({step:r.step,ok:!res.error});
 }
 return NextResponse.json({sent:results.filter(x=>x.ok).length,failed:results.filter(x=>!x.ok).length});
}
