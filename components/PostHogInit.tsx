'use client';
import {useEffect} from 'react';
import posthog from 'posthog-js';
/** Session replay + funnels in FaMED's own PostHog project; off until NEXT_PUBLIC_POSTHOG_KEY is set. No cookies. */
export default function PostHogInit(){
 useEffect(()=>{
  const key=process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if(!key||navigator.doNotTrack==='1'||Reflect.get(navigator,'globalPrivacyControl')===true)return;
  posthog.init(key,{api_host:'https://us.i.posthog.com',person_profiles:'identified_only',persistence:'memory'});
 },[]);
 return null;
}
