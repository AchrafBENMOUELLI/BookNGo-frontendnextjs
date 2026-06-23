import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/my-reservations", "/hotels/:id/reserve"];

// Routes that logged-in users shouldn't access
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route.replace(":id", ""))
  );

  const isAuthRoute = authRoutes.includes(pathname);

  // Not logged in trying to access protected page → redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already logged in trying to access login/register → redirect to home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my-reservations/:path*", "/hotels/:path*/reserve", "/login", "/register"],
};
