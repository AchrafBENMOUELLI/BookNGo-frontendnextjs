import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/my-reservations", "/hotels/:id/reserve"];
const authRoutes = ["/login", "/register"];
const adminPublicRoutes = ["/admin/login"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const adminToken = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  // ── Admin routes ──────────────────────────────────────
  const isAdminPublic = adminPublicRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith("/admin");

  // Admin already logged in → redirect away from login
  if (isAdminPublic && adminToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Admin route but no token → redirect to admin login
  if (isAdminRoute && !isAdminPublic && !adminToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // ── Regular user routes ───────────────────────────────
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route.replace(":id", ""))
  );
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/my-reservations/:path*",
    "/hotels/:path*/reserve",
    "/login",
    "/register",
  ],
};
