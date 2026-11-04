import {NextResponse} from 'next/server';
// Book checkout for the popup: proxies to the FaMED app's guest checkout, which records the sale and emails the book.
// Called server-side because the app backend only accepts browser requests from its own origin.
// The URL and anon key are public; both ship in the app's own JS bundle.
const app='https://muptfkaevuyeffudfmey.supabase.co/functions/v1/';
const key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cHRma2FldnV5ZWZmdWRmbWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTgxMzgsImV4cCI6MjA4MTEzNDEzOH0.p_IfZeyO7Z6TXfMuiaAoXdKQu1g476ML5yah25wtSHI';
const planId='book_only';
async function call(name:string,body:object){
 const res=await fetch(app+name,{method:'POST',headers:{'Content-Type':'application/json',apikey:key,Authorization:`Bearer ${key}`},body:JSON.stringify(body),cache:'no-store'});
 const data=await res.json().catch(()=>({}));
 return NextResponse.json(data,{status:res.ok?200:res.status});
}
export async function POST(req:Request){
 const body=await req.json().catch(()=>({}));
 if(body.step==='config')return call('guest-checkout-config',{planId});
 if(body.step==='create')return call('create-guest-order',{planId,email:body.email,firstName:body.firstName});
 if(body.step==='capture')return call('capture-guest-order',{orderId:body.orderId});
 return NextResponse.json({error:'Unknown step'},{status:400});
}
