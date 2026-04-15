// src/middleware.js
import { NextResponse } from "next/server";

export  function middleware(request) {
  //  get the token from the cookies
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  //  PROTECT RULES
  // If the user is trying to enter ANY /admin page
  if (pathname.startsWith("/admin")) {
    
    // Allow them to see the login and register pages without a token
    if (pathname === "/admin/login" || pathname === "/admin/register") {
      // If they ARE logged in already, don't let them see login/register, send to dashboard
      if (token) return NextResponse.redirect(new URL("/admin", request.url));
      return NextResponse.next();
    }

    // For all other admin pages, if NO token exists, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

// THE MATCHER (This is what locks the direct URL)
export const config = {
  matcher: ["/admin/:path*"],
};