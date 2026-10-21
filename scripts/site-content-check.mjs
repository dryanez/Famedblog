import fs from 'node:fs';import assert from 'node:assert/strict';
const origin=process.argv[2]||'https://famed-vorbereitung.com';
const m=JSON.parse(fs.readFileSync('lib/generated-content.json'));
for(const lang of ['en','ar','es']){
 const posts=m.posts[lang].filter(p=>p.status==='published');assert.equal(posts.length,30);
 for(const p of posts){assert.ok(m.posts.en.some(e=>e.slug===p.slug&&e.status==='published'));assert.ok(!/19[.,]99|25[.,]99|59[.,]99|book-2026-(contents|opqrst)|buch-vorschau/.test(p.content),lang+'/'+p.slug+' promotional residue');}
}
const xml=await fetch(origin+'/sitemap.xml').then(r=>r.text());const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,111);
let cursor=0;const worker=async()=>{while(cursor<urls.length){const publicUrl=urls[cursor++],path=new URL(publicUrl).pathname;const r=await fetch(origin+path);assert.equal(r.status,200,path);const html=await r.text();const lang=/^\/ar(?:\/|$)/.test(path)?'ar':/^\/es(?:\/|$)/.test(path)?'es':'en';assert.ok(html.includes(`lang="${lang}"`));assert.ok(!/€\s*19[.,]99|19[.,]99\s*يورو|book-2026-(contents|opqrst)/.test(html),path+' product price/preview');for(const target of ['en','ar','es'])assert.ok(new RegExp(`href[Ll]ang="${target}"`).test(html),path+' missing '+target);}};
await Promise.all(Array.from({length:5},worker));console.log('PASS',urls.length,'public language routes;30 topics in each language; no repeated book price/interior previews');
