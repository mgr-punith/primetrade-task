import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // If no token and trying to access protected routes
  if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user tries to access admin page but is not admin
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If already logged in and tries to access login/register
  if (token && (pathname === "/" || pathname === "/register")) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/register", "/dashboard/:path*", "/admin/:path*"],
};
