import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
export function verifyFunnelHome(html){
 const main=html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]||'',hero=main.match(/<section[^>]*>([\s\S]*?)<\/section>/)?.[1]||'';
 assert.ok(!/(?:€\s*19[.,]99|19[.,]99\s*(?:€|يورو)|€\s*25[.,]99)/.test(main),'Product price in homepage');
 assert.ok(!/href="[^\"]*(?:book|buch-vorschau|paypal)/.test(hero),'Book sales action in hero');
 assert.match(hero,/href="(?:\/(?:ar|es))?\/lead-magnet"/,'Hero must open the dedicated guide registration page');
 assert.ok(!/name="email"/.test(main),'Home must link to the registration page, not display the guide form');
 assert.ok(!/book-2026-(contents|opqrst)|\/guides\/famed-study-plan/.test(html),'Public preview exposed');
 const resource=main.indexOf('id="optional-resources"');assert.ok(resource>main.indexOf('id="practice"')&&resource>main.lastIndexOf('id="practice"'),'Products must follow the learning sections');
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const origin=process.argv[2]||'https://famed-vorbereitung.com';
 for(const prefix of ['','/ar','/es']){
  const home=await fetch(origin+(prefix||'/')).then(r=>r.text());verifyFunnelHome(home);
  const response=await fetch(origin+prefix+'/lead-magnet');assert.equal(response.status,200);const html=await response.text();assert.match(html,/name="email"/);assert.match(html,/name="firstName"/);assert.ok(!/href="(?:https?:\/\/[^/" ]+)?(?:\/(?:en|ar|es))?\/guides\/|book-2026-(contents|opqrst)|<iframe/.test(html),'Guide contents must not be publicly previewed');
  assert.ok(!/id="optional-resources"/.test(html),'No product discovery before registration success');
  for(const route of ['/book','/protokoll','/blog/famed-protokoll-buch-vorschau']){const r=await fetch(origin+prefix+route,{redirect:'manual'});assert.equal(r.status,307,route);assert.ok(r.headers.get('location').startsWith('https://www.paypal.com/ncp/payment/DQCLR47JB5DXU'));}
  console.log('PASS',prefix||'en','guide registration funnel and direct payment aliases');
 }
 for(const path of ['/guides/famed-study-plan-en.html','/guides/famed-study-plan-ar.html','/guides/famed-study-plan-es.html','/images/previews/book-2026-contents.webp','/images/previews/book-2026-opqrst.webp','/2026%20Protokol%20Famed.pdf','/documents/famed-protokoll.pdf','/documents/anamnese.pdf'])assert.equal((await fetch(origin+path)).status,404,'Public preview must be withdrawn: '+path);
 assert.equal((await fetch(origin+'/api/study-guide?token=invalid')).status,404);
 console.log('PASS private guide and withdrawn book interiors');
}
