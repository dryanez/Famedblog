import assert from 'node:assert/strict';
const origin=process.argv[2]||'https://famed-vorbereitung.com';
const routes=['','/what-is-famed','/lead-magnet','/book','/app'];
for(const route of routes){
 const path='/es'+route;const r=await fetch(origin+path);assert.equal(r.status,200,path);const html=await r.text();
 assert.match(html,/<html[^>]*lang="es"[^>]*dir="ltr"/);assert.ok(html.includes(`rel="canonical" href="https://famed-vorbereitung.com${path}"`),path+' canonical');
 for(const lang of ['en','ar','es'])assert.ok(new RegExp(`href[Ll]ang="${lang}"`).test(html),path+' alternate '+lang);
 assert.ok(!/<meta name="robots" content="noindex/.test(html));
 for(const m of html.matchAll(/(?:src|poster)="(\/(?:images|videos|guides)[^"]+)"/g)){const asset=await fetch(origin+m[1],{method:'HEAD'});assert.equal(asset.status,200,m[1]);}
 console.log('PASS',path);
}
for(const lang of ['en','ar','es']){const r=await fetch(`${origin}/guides/famed-study-plan-${lang}.html`);assert.equal(r.status,200);const text=await r.text();assert.ok(text.includes(`lang="${lang}"`));assert.ok(!text.includes('€490'));console.log('PASS printable guide',lang);}
const sitemap=await fetch(origin+'/sitemap.xml').then(r=>r.text());for(const route of routes)assert.ok(sitemap.includes('<loc>https://famed-vorbereitung.com/es'+route+'</loc>'));
for(const path of ['/es/blog','/es/career'])assert.equal((await fetch(origin+path)).status,404,'Untranslated routes must stay private: '+path);
const consent=await fetch(origin+'/api/guide-consent?token=invalid');assert.equal(consent.status,400);assert.match(consent.headers.get('x-robots-tag'),/noindex/);
console.log('PASS sitemap, private untranslated routes, invalid consent link');
