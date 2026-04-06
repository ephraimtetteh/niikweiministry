// middleware.js  (root of project)
// Protects all /admin routes except /admin/login.
//
// FIX: import from 'jose' subpath that avoids JWE/deflate (CompressionStream)
// which is not available in the Next.js Edge Runtime.
// We only need JWT sign/verify — use the compact module paths.
//
// Required .env.local:
//   ADMIN_JWT_SECRET  — long random string (openssl rand -hex 32)

import { NextResponse } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "fallback-secret-change-me-in-production",
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only guard /admin paths
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Let the login page through
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    // Token missing, invalid, or expired
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete("admin_token");
    return res;
  }
}

export const config = {
  // Match all /admin routes — but NOT api routes or static files
  matcher: ["/admin/:path*"],
};
