import test from 'node:test';import assert from 'node:assert/strict';
import {dueStep,selectRecipients,followupEmail,sign,verify,unsubscribeUrl} from '../lib/guide-followups.mjs';
const H=36e5,now=Date.parse('2026-11-10T09:00:00Z'),ago=h=>new Date(now-h*H).toISOString();
test('steps fall in 24 h windows once',()=>{assert.equal(dueStep(ago(10),now),null);assert.equal(dueStep(ago(30),now),'d1');assert.equal(dueStep(ago(50),now),null);assert.equal(dueStep(ago(80),now),'d3');assert.equal(dueStep(ago(100),now),null);});
test('skips buyers, unsubscribed and already sent; newest request wins',()=>{
 const rows=[{email:'A@x.com',first_name:'Ana',locale:'es',created_at:ago(30)},{email:'b@x.com',locale:'en',created_at:ago(80)},{email:'c@x.com',locale:'en',created_at:ago(30)},{email:'d@x.com',locale:'en',created_at:ago(30),withdrawn_at:ago(1)},{email:'e@x.com',locale:'de',created_at:ago(80)},{email:'e@x.com',locale:'en',created_at:ago(5)}];
 const r=selectRecipients(rows,{sent:new Set(['b@x.com|d3']),buyers:new Set(['c@x.com']),withdrawn:new Set(),now});
 assert.deepEqual(r.map(x=>x.email+':'+x.step+':'+x.locale),['a@x.com:d1:es']);
});
test('email has unsubscribe link + header, tracked links, escaped name',()=>{
 const m=followupEmail({email:'a@x.com',firstName:'<b>',locale:'es',step:'d1'},'k');
 assert.match(m.html,/utm_content=guide-d1&utm_locale=es/);assert.match(m.html,/Darme de baja/);assert.ok(!m.html.includes('<b>'));assert.match(m.headers['List-Unsubscribe'],/guide-unsubscribe/);
 const d3=followupEmail({email:'a@x.com',firstName:'',locale:'ar',step:'d3'},'k');assert.match(d3.html,/dir="rtl"/);assert.match(d3.html,/paypal\.com\/ncp/);
});
test('unsubscribe signature',()=>{assert.ok(verify('a@x.com',sign('A@x.com','k'),'k'));assert.ok(!verify('a@x.com',sign('a@x.com','other'),'k'));assert.ok(!verify('a@x.com','zz','k'));assert.match(unsubscribeUrl('a@x.com','k'),/^https:\/\/famed-vorbereitung\.com\/api\/guide-unsubscribe\?e=/);});
