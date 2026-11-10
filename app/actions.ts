'use server';
import {supabaseAdmin} from '@/lib/supabase-admin';
import {Resend} from 'resend';
// @ts-ignore Shared I/O orchestration is covered by Node integration tests.
import {handleLead} from '@/lib/lead-request.mjs';

export async function submitLead(formData:FormData){
 const store={
  async recent(email:string){const {data,error}=await supabaseAdmin.from('guide_requests').select('id').eq('email',email).not('provider_message_id','is',null).gte('created_at',new Date(Date.now()-900000).toISOString()).limit(1);if(error)throw Error('Guide storage unavailable');return !!data?.length;},
  async record(lead:any){
   const {data,error}=await supabaseAdmin.from('guide_requests').insert({email:lead.email,first_name:lead.firstName,locale:lead.locale,marketing_requested:lead.marketingRequested,token_hash:lead.tokenHash,guide_token_hash:lead.guideTokenHash,consent_version:lead.consentVersion,consent_text:lead.consentText}).select('id').single();if(error)throw Error('Guide storage unavailable');
   // A guide request is not permission for the existing lead campaigns.
   const {error:leadError}=await supabaseAdmin.from('leads').insert({email:lead.email,first_name:lead.firstName,exam_date:lead.examDate,german_level:lead.germanLevel,source:'website_guide_request_v2'+(lead.page?':'+lead.page:'')});if(leadError&&leadError.code!=='23505')console.error('Guide lead record unavailable',leadError.code);
   return data;
  },
  async delivered(id:string,providerId:string){const {error}=await supabaseAdmin.from('guide_requests').update({provider_message_id:providerId}).eq('id',id);if(error)throw Error('Delivery evidence unavailable');},
 };
 return handleLead(formData,store,async(message:any,key:string)=>{if(!process.env.RESEND_API_KEY)return {error:true};const result=await new Resend(process.env.RESEND_API_KEY).emails.send({from:'FaMED Prep <team@famed-vorbereitung.com>',...message},{idempotencyKey:'guide/'+key});return {id:result.data?.id,error:result.error};});
}
