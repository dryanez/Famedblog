import {NextRequest,NextResponse} from 'next/server';
export function proxy(request:NextRequest){const headers=new Headers(request.headers);headers.set('x-site-language',request.nextUrl.pathname==='/ar'||request.nextUrl.pathname.startsWith('/ar/')?'ar':'en');return NextResponse.next({request:{headers}});}
export const config={matcher:['/((?!api|_next|.*\\..*).*)']};
