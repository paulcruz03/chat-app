import { NextResponse, NextRequest } from 'next/server'
import { setupServerFirebase } from "@/lib/firebase-server";
import { cookies } from 'next/headers';
 
export async function middleware(request: NextRequest) {
  const { auth } = await setupServerFirebase();
  console.log(auth.currentUser?.email, 'got', (await cookies()).get("__session")?.value);
  if (auth.currentUser && request.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
  } else if (!auth.currentUser && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  } else {
    return NextResponse.next();
  }
}
 
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
}