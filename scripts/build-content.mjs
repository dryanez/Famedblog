import fs from 'node:fs';import path from 'node:path';import matter from 'gray-matter';
const manifest={posts:{en:[],ar:[]},pages:{en:{},ar:{}}};
for(const locale of ['en','ar']){
 const directory=locale==='en'?'blog/posts':'blog/ar';
 for(const file of fs.readdirSync(directory).filter(f=>f.endsWith('.md')&&f.toLowerCase()!=='readme.md')){
  const {data,content}=matter(fs.readFileSync(path.join(directory,file),'utf8'));
  manifest.posts[locale].push({slug:file.slice(0,-3),title:data.title||'Untitled',date:String(data.date||'2026-10-19'),readTime:data.readTime||'5 min',category:data.category||'General',excerpt:data.excerpt||content.slice(0,150),tags:data.tags||[],status:data.status||'draft',...data,content});
 }
 manifest.posts[locale].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 for(const file of fs.readdirSync('content/pages/'+locale).filter(f=>f.endsWith('.md'))){
  const {data,content}=matter(fs.readFileSync('content/pages/'+locale+'/'+file,'utf8'));const key=file.slice(0,-3);const route=key==='home'?'/':key==='resources-anamnese'?'/resources/anamnese':'/'+key;
  manifest.pages[locale][route]={title:data.title,excerpt:data.excerpt,content};
 }
}
fs.writeFileSync('lib/generated-content.json',JSON.stringify(manifest));
console.log('Content bundled:',Object.fromEntries(['en','ar'].map(l=>[l,{posts:manifest.posts[l].length,pages:Object.keys(manifest.pages[l]).length}])));
