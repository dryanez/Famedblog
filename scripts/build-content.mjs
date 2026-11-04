import fs from 'node:fs';import path from 'node:path';import matter from 'gray-matter';
// ru/fr/tr have translated pages only; their articles are added once blog/<locale> exists.
const locales=['en','ar','es','ru','fr','tr'];
const manifest={posts:Object.fromEntries(locales.map(l=>[l,[]])),pages:Object.fromEntries(locales.map(l=>[l,{}]))};
for(const locale of locales){
 const directory=locale==='en'?'blog/posts':'blog/'+locale;
 for(const file of (fs.existsSync(directory)?fs.readdirSync(directory):[]).filter(f=>f.endsWith('.md')&&f.toLowerCase()!=='readme.md')){
  const {data,content}=matter(fs.readFileSync(path.join(directory,file),'utf8'));
  manifest.posts[locale].push({slug:file.slice(0,-3),title:data.title||'Untitled',date:String(data.date||'2026-10-19'),readTime:data.readTime||'5 min',category:data.category||'General',excerpt:data.excerpt||content.slice(0,150),tags:data.tags||[],status:data.status||'draft',...data,content});
 }
 manifest.posts[locale].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 for(const file of fs.readdirSync('content/pages/'+locale).filter(f=>f.endsWith('.md'))){
  const {data,content}=matter(fs.readFileSync('content/pages/'+locale+'/'+file,'utf8'));const key=file.slice(0,-3);const route=key==='home'?'/':key==='resources-anamnese'?'/resources/anamnese':'/'+key;
  manifest.pages[locale][route]={title:data.title,excerpt:data.excerpt,updated:data.updated,content};
 }
}
fs.writeFileSync('lib/generated-content.json',JSON.stringify(manifest));
console.log('Content bundled:',Object.fromEntries(locales.map(l=>[l,{posts:manifest.posts[l].length,pages:Object.keys(manifest.pages[l]).length}])));

fs.writeFileSync('lib/spanish-slugs.mjs','export const spanishSlugs = '+JSON.stringify(manifest.posts.es.filter(p=>p.status==='published').map(p=>p.slug))+';\n');
