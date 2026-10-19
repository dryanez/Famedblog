'use client';
import {useEffect} from 'react';
import posthog from 'posthog-js';
/** Session replay + funnels in FaMED's own PostHog project (NEXT_PUBLIC_POSTHOG_KEY). Loads only after cookie consent. */
export default function PostHogInit(){
 useEffect(()=>{
  const key=process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const when=Reflect.get(window,'whenCookieConsent') as ((fn:()=>void)=>void)|undefined;
  if(!key||!when)return;
  when(()=>{Reflect.set(window,'posthog',posthog);posthog.init(key,{api_host:'https://us.i.posthog.com',person_profiles:'identified_only'});});
 },[]);
 return null;
}
