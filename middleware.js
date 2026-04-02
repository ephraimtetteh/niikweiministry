// middleware.js  (root of project — Next.js reads it automatically)
// Protects all /admin routes except /admin/login.
// Uses a signed JWT stored in an httpOnly cookie.
//
// Required .env.local:
//   ADMIN_JWT_SECRET   — any long random string, e.g. openssl rand -hex 32

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "fallback-secret-change-me",
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /admin paths
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Allow the login page through
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    // Token invalid or expired — redirect to login
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete("admin_token");
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
