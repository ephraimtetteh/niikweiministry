// app/api/admin/login/route.js
// This runs in the Node.js runtime (NOT Edge), so the full jose import is fine here.
// The Edge Runtime warning only applies to middleware.js — this file is unaffected.
//
// Required .env.local:
//   ADMIN_JWT_SECRET  — must match middleware.js
//   ADMIN_PASS_1      — password for tettehephraim.64@gmail.com
//   ADMIN_PASS_2      — password for rubyotto@gmail.com

import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "fallback-secret-change-me-in-production",
);

// ── Authorised admin emails ───────────────────────────────────────────────────
const ADMIN_EMAILS = ["tettehephraim.64@gmail.com", "ruby.otoo@gmail.com"];

function getPassword(email) {
  return {
    "tettehephraim.64@gmail.com": process.env.ADMIN_PASS_1,
    "rubyotto@gmail.com": process.env.ADMIN_PASS_2,
  }[email];
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const normalised = email.toLowerCase().trim();

    if (!ADMIN_EMAILS.includes(normalised)) {
      // Vague on purpose — don't reveal which emails are valid
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const expected = getPassword(normalised);
    if (!expected || password !== expected) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Issue a signed JWT — 8 hour expiry
    const token = await new SignJWT({ email: normalised, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(SECRET);

    // Set httpOnly cookie (JS can't read it — XSS-safe)
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return Response.json({ success: true, email: normalised });
  } catch (err) {
    console.error("[admin/login]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
