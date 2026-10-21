import {verifyFunnelHome} from './funnel-check.mjs';
import {verifyHomepage,verifyPalette} from './homepage-regression.mjs';
/** Paired Markdown -> immutable preview -> verified promotion. Never publishes database status. */
import {execFileSync,execFile} from 'node:child_process';
import {promisify} from 'node:util';
const execAsync=promisify(execFile);
import {readFileSync,writeFileSync,mkdirSync,existsSync,openSync,closeSync,unlinkSync,cpSync,mkdtempSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
export function validatePairs(root){
 const manifest=JSON.parse(readFileSync(join(root,'lib/generated-content.json')));
 for(const locale of ['en','ar',...(manifest.posts.es?['es']:[])])for(const post of manifest.posts[locale].filter(p=>p.status==='published')){
  const other=manifest.posts[locale==='en'?'ar':'en'].find(p=>p.slug===post.slug&&p.status==='published');
  if(!other)throw Error(`Missing published counterpart: ${locale}/${post.slug}`);
  for(const key of ['title','excerpt','content'])if(!post[key]?.trim())throw Error(`Missing ${key}: ${locale}/${post.slug}`);
  if(locale==='ar'&&!/[\u0600-\u06ff]/.test(post.content))throw Error(`Missing Arabic content: ${post.slug}`);
  if(post.content.includes('3 Monate App-Zugang'))throw Error(`Obsolete artwork label: ${post.slug}`);
 }
 return manifest;
}
function run(cmd,args,cwd){return execFileSync(cmd,args,{cwd,encoding:'utf8',maxBuffer:30*1024*1024});}
export function verifyHtml(html,path,locale){
 if(path===''||path==='/'||path==='/ar'||path==='/es'){verifyHomepage(html);verifyFunnelHome(html);}
 if(!/<h1[\s>]/.test(html)||!html.includes(`lang="${locale}"`)||!html.includes(`dir="${locale==='ar'?'rtl':'ltr'}"`))throw Error(`Missing page/language: ${path}`);
 const canonical='https://famed-vorbereitung.com'+path;
 if(!html.includes(`rel="canonical" href="${canonical}"`))throw Error(`Wrong canonical: ${path}`);
 if(!html.includes('hrefLang="ar"')&&!html.includes('hreflang="ar"'))throw Error(`Missing language alternative: ${path}`);
 if(path.includes('/blog/')&&!html.includes('application/ld+json'))throw Error(`Missing article structured data: ${path}`);
}
async function main(){
 const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
 const args=process.argv.slice(2),deploy=args.includes('--deploy'),promote=args.includes('--promote');
 if(args.some(a=>!['--deploy','--promote'].includes(a)))throw Error('Usage: node scripts/release-blog.mjs [--deploy] [--promote]');
 if(promote&&!deploy)throw Error('--promote requires --deploy');
 const lock=join(root,'.blog-release.lock');let fd;
 try{fd=openSync(lock,'wx');}catch{throw Error('Another release is running; inspect .blog-release.lock before retrying');}
 try{
  run('node',['scripts/build-content.mjs'],root);const manifest=validatePairs(root);
  verifyPalette(readFileSync(join(root,'app/globals.css'),'utf8'));
  // Release only committed source: exclude unrelated dirty lifecycle work.
  const dirty=run('git',['status','--porcelain','--untracked-files=normal'],root).trim();
  if(dirty)throw Error('Commit the reviewed release first. Dirty source is never deployed.');
  const revision=run('git',['rev-parse','HEAD'],root).trim();
  const priorReport=join(root,'release-evidence',revision+'.json');
  if(deploy&&existsSync(priorReport)){const prior=JSON.parse(readFileSync(priorReport));if(prior.phase==='live-verified'){const current=JSON.parse(run('vercel',['inspect','famed-vorbereitung.com','--json'],root)).url;if(prior.deployment==='https://'+current){console.log(JSON.stringify({phase:'already-live-verified',revision,deployment:prior.deployment}));return;}}}
  const stage=mkdtempSync(join(tmpdir(),'famed-blog-release-'));
  const archive=join(stage,'source.tar');execFileSync('git',['archive','--format=tar','--output',archive,revision],{cwd:root});run('tar',['-xf',archive,'-C',stage],root);unlinkSync(archive);
  // Vercel project identity is public; local env files are never copied.
  mkdirSync(join(stage,'.vercel'));writeFileSync(join(stage,'.vercel/project.json'),JSON.stringify({projectId:'prj_nPODFvDcSdEtmMycxCAPCt2mGDf9',orgId:'team_EEOHCcxdDARxuWFk1jGRIUUv',projectName:'famedblog'}));
  const report={revision,checkedAt:new Date().toISOString(),stage,phase:'validated',checks:[]};
  const evidence=join(root,'release-evidence');mkdirSync(evidence,{recursive:true});const reportPath=join(evidence,revision+'.json');
  writeFileSync(reportPath,JSON.stringify(report,null,2));
  if(!deploy){console.log(JSON.stringify(report));return;}
  const output=run('vercel',['deploy',stage,'--prod','--skip-domain','--yes'],root);const deployment=output.match(/https:\/\/[^\s]+\.vercel\.app/g)?.at(-1);if(!deployment)throw Error('No deployment URL returned');
  report.deployment=deployment;report.phase='preview';writeFileSync(reportPath,JSON.stringify(report,null,2));
  const fetchPreview=async(path)=>{const r=await execAsync('vercel',['curl',path,'--deployment',deployment,'--','--silent','--show-error','--fail'],{cwd:stage,maxBuffer:10*1024*1024});return r.stdout;};
  const sitemap=await fetchPreview('/sitemap.xml');
  const paths=[...Object.keys(manifest.pages.en).filter(p=>!['/book','/protokoll'].includes(p)),'/blog',...manifest.posts.en.filter(p=>p.status==='published').map(p=>'/blog/'+p.slug)];
  const targets=['en','ar'].flatMap(locale=>paths.map(route=>({locale,path:(locale==='ar'?'/ar':'')+(route==='/'?'':route)})));
  for(const route of [...Object.keys(manifest.pages.es||{}).filter(p=>!['/book','/protokoll'].includes(p)),'/blog',...(manifest.posts.es||[]).filter(p=>p.status==='published').map(p=>'/blog/'+p.slug)])targets.push({locale:'es',path:'/es'+(route==='/'?'':route)});
  let cursor=0;const worker=async()=>{while(cursor<targets.length){const {locale,path}=targets[cursor++];verifyHtml(await fetchPreview(path||'/'),path,locale);if(!sitemap.includes('<loc>https://famed-vorbereitung.com'+path+'</loc>'))throw Error('Missing sitemap URL: '+path);report.checks.push({path:path||'/',passed:true});}};
  const results=await Promise.allSettled(Array.from({length:5},worker));for(const result of results)if(result.status==='rejected')throw result.reason;
  for(const draft of manifest.posts.en.filter(p=>p.status==='draft')){const r=await execAsync('vercel',['curl','/blog/'+draft.slug,'--deployment',deployment,'--','--silent','--output','/dev/null','--write-out','%{http_code}'],{cwd:stage});if(r.stdout.trim()!=='404')throw Error('Draft is public: '+draft.slug);}
  report.phase='preview-verified';writeFileSync(reportPath,JSON.stringify(report,null,2));
  if(promote){
   const previous=JSON.parse(run('vercel',['inspect','famed-vorbereitung.com','--json'],root)).url;report.previous=previous;writeFileSync(reportPath,JSON.stringify(report,null,2));
   run('vercel',['promote',deployment,'--yes'],root);
   try{for(const {path} of report.checks){const r=await fetch('https://famed-vorbereitung.com'+path);if(!r.ok)throw Error(`Live ${r.status}: ${path}`);verifyHtml(await r.text(),path==='/'?'':path,path.startsWith('/ar')?'ar':path.startsWith('/es')?'es':'en');}report.phase='live-verified';}
   catch(e){run('vercel',['promote',previous,'--yes'],root);report.phase='rolled-back';report.error=String(e);writeFileSync(reportPath,JSON.stringify(report,null,2));throw e;}
   writeFileSync(reportPath,JSON.stringify(report,null,2));
  }
  console.log(JSON.stringify({revision,deployment,phase:report.phase,checks:report.checks.length,reportPath}));
 }finally{closeSync(fd);unlinkSync(lock);}
}
if(process.argv[1]===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.message);process.exitCode=1;});
