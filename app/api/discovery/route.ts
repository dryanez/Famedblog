import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {getAllPosts} from '@/lib/posts';
import {hasVersion,localeOf} from '@/lib/languages';
import {publicRoutes} from '@/lib/site-pages';
const sources=new Set(['direct','google','bing','chatgpt','perplexity','claude','gemini','facebook','instagram','telegram','other']);
const events=new Set(['page_view','book_click','app_click','video_play']);
export async function POST(request:Request){
 const origin=new URL(request.url).origin;
 if(request.headers.get('origin')!==origin)return new Response(null,{status:403});
 if(Number(request.headers.get('content-length')||0)>700)return new Response(null,{status:413});
 try{
  const body=await request.text();if(body.length>700)return new Response(null,{status:413});
  const {path,source,event}=JSON.parse(body);
  if(typeof path!=='string'||path.length>180||!sources.has(source)||!events.has(event))return new Response(null,{status:400});
  const locale=localeOf(path);const route=locale==='en'?path:path.slice(3)||'/';
  if(!hasVersion(locale,route))return new Response(null,{status:400});
  if(![...publicRoutes,'/blog'].includes(route)&&!getAllPosts(locale).some(p=>p.status==='published'&&route==='/blog/'+p.slug))return new Response(null,{status:400});
  const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const {error}=await db.rpc('record_discovery',{p_path:path,p_source:source,p_event:event});
  if(error)return new Response(null,{status:503});return new Response(null,{status:204});
 }catch{return new Response(null,{status:400});}
}
