import {createHash,randomBytes} from 'node:crypto';
export const CONSENT_VERSION='guide-editorial-v1-20261021';
import {consentCopy} from './guide-consent-copy.mjs';
const copy={en:{subject:'Your free eight-week FaMED study plan',hello:'Hello',intro:'Here is the planning resource you requested. Adapt the schedule to your level and available time.',open:'Read or print the study plan',confirm:'Confirm optional study tips and offers',note:'You have not been subscribed to marketing. If you selected the optional checkbox, confirm below to activate it.',success:'The guide link has been sent. Optional marketing needs a separate confirmation.',invalid:'Enter a valid email and first name.',failed:'We could not send the email. Please try again.',recent:'A guide was sent recently. Please check your inbox.'},ar:{subject:'خطة FaMED المجانية لثمانية أسابيع',hello:'مرحباً',intro:'إليك مورد التخطيط الذي طلبته. عدّل الجدول حسب مستواك والوقت المتاح.',open:'اقرأ خطة الدراسة أو اطبعها',confirm:'تأكيد النصائح والعروض الاختيارية',note:'لم تتم إضافتك إلى رسائل التسويق. إذا اخترت المربع الاختياري، أكّد أدناه لتفعيله.',success:'أُرسل رابط الدليل. يتطلب التسويق الاختياري تأكيداً منفصلاً.',invalid:'أدخل بريداً صالحاً واسمك الأول.',failed:'تعذّر إرسال البريد. حاول مرة أخرى.',recent:'أُرسل دليل مؤخراً. راجع بريدك الإلكتروني.'},es:{subject:'Tu plan gratuito de ocho semanas para FaMED',hello:'Hola',intro:'Aquí tienes el recurso de planificación que solicitaste. Adáptalo a tu nivel y al tiempo disponible.',open:'Leer o imprimir el plan de estudio',confirm:'Confirmar consejos y ofertas opcionales',note:'No se ha activado ninguna suscripción de marketing. Si marcaste la casilla opcional, confirma abajo para activarla.',success:'Te enviamos el enlace de la guía. El marketing opcional requiere una confirmación aparte.',invalid:'Escribe un correo válido y tu nombre.',failed:'No pudimos enviar el correo. Inténtalo de nuevo.',recent:'Enviamos una guía recientemente. Revisa tu correo.'}};
export const hashToken=t=>createHash('sha256').update(t).digest('hex');
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function parseLead(form){
 const value=k=>String(form.get(k)||'').trim();const locale=['en','ar','es'].includes(value('locale'))?value('locale'):'en';
 const email=value('email').toLowerCase(),firstName=value('firstName');
 if(form.get('website')||!/^\S+@\S+\.\S+$/.test(email)||email.length>254||!firstName||firstName.length>80||/[\r\n]/.test(email))return {error:copy[locale].invalid,locale};
 const examDate=value('examDate'),germanLevel=value('germanLevel');
 if(examDate&&!/^\d{4}-\d{2}-\d{2}$/.test(examDate)||germanLevel&&!/^(A1|A2|B1|B2|C1|C2)$/.test(germanLevel))return {error:copy[locale].invalid,locale};
 return {email,firstName,locale,examDate:examDate||null,germanLevel:germanLevel||null,marketingRequested:form.get('marketingConsent')==='yes'};
}
export function guideEmail(lead,token,guideToken){
 const c=copy[lead.locale],url=`https://famed-vorbereitung.com/api/study-guide?token=${guideToken}`;
 return {subject:c.subject,html:`<!doctype html><html lang="${lead.locale}" dir="${lead.locale==='ar'?'rtl':'ltr'}"><body style="font-family:Arial,sans-serif;color:#1f2937;background:#fff;padding:24px;line-height:1.7"><img src="https://famed-vorbereitung.com/logo.png" width="100" alt="FaMED Prep"><h1>${c.hello}, ${escape(lead.firstName)}</h1><p>${c.intro}</p><p><a href="${url}">${c.open}</a></p><p>${c.note}</p>${token?`<p><a href="https://famed-vorbereitung.com/api/guide-consent?token=${token}">${c.confirm}</a></p>`:''}<p>FaMED Prep</p></body></html>`,text:`${c.hello}, ${lead.firstName}\n${c.intro}\n${url}\n${c.note}${token?'\nhttps://famed-vorbereitung.com/api/guide-consent?token='+token:''}`};
}
/** Real server-action flow with injectable I/O for deterministic delivery/consent tests. */
export async function handleLead(form,store,send){
 const lead=parseLead(form),c=copy[lead.locale];if(lead.error)return {success:false,message:lead.error};
 try {
  if(await store.recent(lead.email))return {success:true,message:c.recent};
  const guideToken=randomBytes(32).toString('hex');
  const token=lead.marketingRequested?randomBytes(32).toString('hex'):null;
  const request=await store.record({...lead,tokenHash:token?hashToken(token):null,guideTokenHash:hashToken(guideToken),consentVersion:CONSENT_VERSION,consentText:lead.marketingRequested?consentCopy[lead.locale]:null});
  const message=guideEmail(lead,token,guideToken);
  const result=await send({to:lead.email,...message},hashToken(lead.email+lead.locale+Math.floor(Date.now()/900000)));
  if(result.error||!result.id)return {success:false,message:c.failed};
  await store.delivered(request.id,result.id);
  return {success:true,message:c.success};
 }catch{return {success:false,message:c.failed};}
}
