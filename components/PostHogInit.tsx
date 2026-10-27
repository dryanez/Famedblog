'use client';
import {useEffect} from 'react';
import posthog from 'posthog-js';
/** FaMED's own PostHog project (NEXT_PUBLIC_POSTHOG_KEY). Until the visitor accepts cookies it runs cookieless
 *  (no cookies/storage, anonymous counts only); "Accept" switches to normal tracking + session replay. */
export default function PostHogInit(){
 useEffect(()=>{
  const key=process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if(!key)return;
  Reflect.set(window,'posthog',posthog);
  posthog.init(key,{api_host:'https://us.i.posthog.com',person_profiles:'identified_only',cookieless_mode:'on_reject',opt_out_capturing_by_default:true});
  if(Reflect.get(window,'cookieConsent')==='accepted'&&posthog.has_opted_out_capturing())posthog.opt_in_capturing();
 },[]);
 return null;
}
