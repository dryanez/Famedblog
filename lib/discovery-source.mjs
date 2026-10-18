export const sources=['direct','google','bing','chatgpt','perplexity','claude','gemini','facebook','instagram','telegram','other'];
export function discoverySource(referrer){
 if(!referrer)return 'direct';let host;try{host=new URL(referrer).hostname.toLowerCase();}catch{return 'other';}
 const domains={chatgpt:['chatgpt.com','chat.openai.com'],perplexity:['perplexity.ai'],claude:['claude.ai'],gemini:['gemini.google.com'],bing:['bing.com'],facebook:['facebook.com','fb.com'],instagram:['instagram.com'],telegram:['t.me']};
 for(const [source,list]of Object.entries(domains))if(list.some(d=>host===d||host.endsWith('.'+d)))return source;
 if(/(^|\.)google\.[a-z.]+$/.test(host))return 'google';
 return 'other';
}
