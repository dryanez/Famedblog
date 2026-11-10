// Two follow-up emails after the free guide (Felipe's decision, 2026-11-10: send to everyone who requests the guide,
// with a one-click unsubscribe). Day 1: try a free case in the app. Day 3: the book offer.
// Pure functions only (selection, copy, signing); I/O lives in app/api/cron/guide-followups/route.ts.
import {createHmac,timingSafeEqual} from 'node:crypto';
import {bookPoints} from './book-offer.mjs';

export const STEPS={d1:{minH:24,maxH:48},d3:{minH:72,maxH:96}}; // the cron runs once a day, so each request falls in each window once
const SITE='https://famed-vorbereitung.com';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const sign=(email,secret)=>createHmac('sha256',secret).update('unsub:'+email.toLowerCase()).digest('hex');
export function verify(email,sig,secret){if(!email||!/^[a-f0-9]{64}$/.test(sig||''))return false;const a=Buffer.from(sign(email,secret),'hex'),b=Buffer.from(sig,'hex');return a.length===b.length&&timingSafeEqual(a,b);}
export const unsubscribeUrl=(email,secret)=>`${SITE}/api/guide-unsubscribe?e=${encodeURIComponent(Buffer.from(email.toLowerCase()).toString('base64url'))}&s=${sign(email,secret)}`;

/** Which step (if any) a guide request is due for, given its age in hours. */
export function dueStep(createdAt,now=Date.now()){const h=(now-Date.parse(createdAt))/36e5;for(const [k,w] of Object.entries(STEPS))if(h>=w.minH&&h<w.maxH)return k;return null;}

/**
 * requests: guide_requests rows; sent: Set of `${email}|${step}` already sent; buyers: Set of emails that bought;
 * Returns [{email,firstName,locale,step}] — one per email, newest request wins, skipping unsubscribed and buyers.
 */
export function selectRecipients(requests,{sent,buyers,withdrawn,now=Date.now()}){
 const latest=new Map();
 for(const r of requests){const e=String(r.email||'').toLowerCase().trim();if(!e)continue;const prev=latest.get(e);if(!prev||r.created_at>prev.created_at)latest.set(e,{...r,email:e});}
 const out=[];
 for(const r of latest.values()){
  if(r.withdrawn_at||withdrawn.has(r.email)||buyers.has(r.email))continue;
  const step=dueStep(r.created_at,now);if(!step||sent.has(r.email+'|'+step))continue;
  out.push({email:r.email,firstName:r.first_name||'',locale:['en','es','ar'].includes(r.locale)?r.locale:'en',step});
 }
 return out;
}

const copy={
 en:{d1:{subject:'Try one FaMED case out loud today (free)',pre:'One exam-style task in your browser, no account needed.',title:'Start with one real task',body:'You have the 8-week plan. The fastest way to start is to do one exam-style task out loud: take a history, explain a procedure or present a patient. The FaMED Prep app lets you try one free in your browser, no account and no card.',cta:'Try a free case now →',ps:'P.S. The FaMED Protokoll 2026 book is still €19.99 instead of €39.99.'},
     d3:{subject:'FaMED Protokoll 2026: €19.99 instead of €39.99',pre:'All current cases, useful phrases and conversation structures in one digital book.',title:'The book that shows how the exam runs',body:'Many candidates combine the 8-week plan with our digital case book. It brings together the current cases, useful phrases and conversation structures for each part of the exam.',cta:'Get the book for €19.99 →',ps:'One payment · sent to your email right away.'},
     hello:'Hello',bye:'Good luck with your preparation!',team:'The FaMED Team',why:'You are receiving this because you requested the free FaMED guide. These are the only two follow-up emails.',unsub:'Unsubscribe'},
 es:{d1:{subject:'Prueba hoy un caso FaMED en voz alta (gratis)',pre:'Una tarea tipo examen en tu navegador, sin cuenta.',title:'Empieza con una tarea real',body:'Ya tienes el plan de 8 semanas. La forma más rápida de empezar es hacer una tarea tipo examen en voz alta: una anamnesis, explicar un procedimiento o presentar un paciente. La app FaMED Prep te deja probar una gratis en tu navegador, sin cuenta y sin tarjeta.',cta:'Probar un caso gratis →',ps:'P. D.: El libro FaMED Protokoll 2026 sigue a 19,99 € en vez de 39,99 €.'},
     d3:{subject:'FaMED Protokoll 2026: 19,99 € en vez de 39,99 €',pre:'Todos los casos actuales, frases útiles y estructuras de conversación en un libro digital.',title:'El libro que muestra cómo es el examen',body:'Muchos candidatos combinan el plan de 8 semanas con nuestro libro digital de casos. Reúne los casos actuales, frases útiles y estructuras de conversación para cada parte del examen.',cta:'Consigue el libro por 19,99 € →',ps:'Un solo pago · se envía a tu correo al instante.'},
     hello:'Hola',bye:'¡Mucho éxito con tu preparación!',team:'El equipo de FaMED',why:'Recibes este correo porque pediste la guía gratuita de FaMED. Son los únicos dos correos de seguimiento.',unsub:'Darme de baja'},
 ar:{d1:{subject:'جرّب اليوم حالة FaMED بصوت عالٍ (مجاناً)',pre:'مهمة مثل الامتحان في متصفحك، بدون حساب.',title:'ابدأ بمهمة حقيقية واحدة',body:'لديك خطة الأسابيع الثمانية. أسرع طريقة للبدء هي أداء مهمة مثل الامتحان بصوت عالٍ: أخذ سيرة مرضية أو شرح إجراء أو عرض مريض. يتيح لك تطبيق FaMED Prep تجربة واحدة مجاناً في متصفحك، بدون حساب وبدون بطاقة.',cta:'جرّب حالة مجانية الآن ←',ps:'ملاحظة: كتاب FaMED Protokoll 2026 ما زال بـ 19.99 € بدلاً من 39.99 €.'},
     d3:{subject:'FaMED Protokoll 2026: ‏19.99 € بدلاً من 39.99 €',pre:'جميع الحالات الحالية والعبارات المفيدة وهياكل المحادثة في كتاب رقمي واحد.',title:'الكتاب الذي يوضح كيف يسير الامتحان',body:'يجمع كثير من المرشحين بين خطة الأسابيع الثمانية وكتاب الحالات الرقمي. يضم الحالات الحالية والعبارات المفيدة وهياكل المحادثة لكل جزء من الامتحان.',cta:'احصل على الكتاب بـ 19.99 € ←',ps:'دفعة واحدة · يُرسل إلى بريدك فوراً.'},
     hello:'مرحباً',bye:'بالتوفيق في تحضيرك!',team:'فريق FaMED',why:'تصلك هذه الرسالة لأنك طلبت دليل FaMED المجاني. هاتان هما رسالتا المتابعة الوحيدتان.',unsub:'إلغاء الاشتراك'},
};

export function followupEmail({email,firstName,locale,step},secret){
 const c=copy[locale]||copy.en,s=c[step],rtl=locale==='ar',start=rtl?'right':'left',unsub=unsubscribeUrl(email,secret);
 const link=step==='d1'
  ?`https://famedtestprep.com/dashboard?utm_source=blog&utm_medium=email&utm_campaign=guide_followup&utm_content=guide-d1&utm_locale=${locale}`
  :`https://www.paypal.com/ncp/payment/DQCLR47JB5DXU?utm_source=email&utm_medium=guide_followup&utm_campaign=guide_d3_${locale}`;
 const points=step==='d3'?`<ul style="padding-${start}:20px;margin:14px 0;font-size:15px;">${(bookPoints[locale]||bookPoints.en).map(p=>`<li style="margin:4px 0;">${p}</li>`).join('')}</ul>`:'';
 const image=step==='d3'?`<img src="https://famedtestprep.com/brand/book-hero.png" alt="FaMED Protokoll 2026" width="600" style="display:block;width:100%;height:auto;border:0;">`:'';
 const html=`<!doctype html><html lang="${locale}" dir="${rtl?'rtl':'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FaMED</title></head><body style="margin:0;background:#f1f5f9;"><div style="display:none;max-height:0;overflow:hidden;">${s.pre}</div><div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1e293b;line-height:1.6;background:#ffffff;text-align:${start};">
<div style="background:#ffffff;padding:22px 24px 14px;text-align:center;border-bottom:4px solid #0066cc;"><img src="https://famedtestprep.com/brand/logo.png" alt="FaMED Prep" width="150" style="display:inline-block;height:auto;border:0;"></div>
<div style="background:#0b1f3a;padding:24px;text-align:center;"><h1 style="color:#ffffff;margin:0;font-size:24px;line-height:1.3;">${s.title}</h1></div>${image}
<div style="padding:24px;"><p style="font-size:16px;margin-top:0;">${c.hello}${firstName?', '+esc(firstName):''}</p><p style="font-size:16px;">${s.body}</p>${points}
<div style="text-align:center;margin:26px 0;"><a href="${link}" style="background-color:${step==='d3'?'#c8372c':'#0066cc'};color:#ffffff;padding:16px 30px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:17px;display:inline-block;">${s.cta}</a></div>
<p style="font-size:14px;color:#475569;">${s.ps}</p><p style="font-size:15px;">${c.bye}<br><strong>${c.team}</strong></p></div>
<div style="background:#f8fafc;padding:16px 24px;text-align:center;font-size:12px;color:#94a3b8;">FaMED Prep · famed-vorbereitung.com<br>${c.why}<br><a href="${unsub}" style="color:#64748b;">${c.unsub}</a></div></div></body></html>`;
 const text=`${c.hello}${firstName?', '+firstName:''}\n\n${s.body}\n\n${s.cta} ${link}\n\n${s.ps}\n\n${c.bye}\n${c.team}\n\n${c.why}\n${c.unsub}: ${unsub}`;
 return {subject:s.subject,html,text,headers:{'List-Unsubscribe':`<${unsub}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'}};
}
