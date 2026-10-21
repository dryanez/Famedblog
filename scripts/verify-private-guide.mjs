import fs from 'node:fs';import{parse}from'dotenv';import{createClient}from'@supabase/supabase-js';import{randomBytes,createHash}from'node:crypto';import assert from'node:assert/strict';
const origin=process.argv[2]||'http://localhost:3016',outPath=process.argv[3];
const e=parse(fs.readFileSync('.env.local')),db=createClient(e.NEXT_PUBLIC_SUPABASE_URL,e.SUPABASE_SERVICE_ROLE_KEY);
const report={origin,checkedAt:new Date().toISOString(),emailsSent:0,locales:[],fixturesRemoved:false};const ids=[];
try{for(const locale of ['en','ar','es']){
 const token=randomBytes(32).toString('hex');const {data,error}=await db.from('guide_requests').insert({email:'qa-private-guide-'+locale+'@example.invalid',first_name:'QA-only fixture',locale,marketing_requested:false,guide_token_hash:createHash('sha256').update(token).digest('hex')}).select('id').single();assert.equal(error,null);ids.push(data.id);
 const r=await fetch(origin+'/api/study-guide?token='+token);assert.equal(r.status,200,locale);const html=await r.text();assert.ok(html.includes(`lang="${locale}"`));assert.match(r.headers.get('cache-control'),/no-store/);assert.match(r.headers.get('x-robots-tag'),/noindex/);assert.ok(!html.includes('€490'));
 const state=await db.from('guide_requests').select('confirmed_at,editorial_eligible').eq('id',data.id).single();assert.equal(state.data.confirmed_at,null);assert.equal(state.data.editorial_eligible,false);report.locales.push({locale,privateDeliveryPassed:true,marketingUnchanged:true});
 }
 assert.equal((await fetch(origin+'/api/study-guide')).status,404);assert.equal((await fetch(origin+'/api/study-guide?token='+'a'.repeat(64))).status,404);
}finally{if(ids.length){const cleanup=await db.from('guide_requests').delete().in('id',ids);assert.equal(cleanup.error,null);}report.fixturesRemoved=true;if(outPath)fs.writeFileSync(outPath,JSON.stringify(report,null,2));}
console.log(JSON.stringify(report));
