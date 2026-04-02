// app/api/admin/login/route.js
//
// Required .env.local:
//   ADMIN_JWT_SECRET   — long random string

import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "fallback-secret-change-me",
);

// ── Authorised admin emails ───────────────────────────────────────────────────
const ADMIN_EMAILS = ["tettehephraim.64@gmail.com", "rubyotto@gmail.com"];

// Simple per-email password map.
// Passwords are stored in env vars — never hardcoded in production.
// Add ADMIN_PASS_1 and ADMIN_PASS_2 to .env.local
function getPassword(email) {
  const map = {
    "tettehephraim.64@gmail.com": process.env.ADMIN_PASS_1,
    "rubyotto@gmail.com": process.env.ADMIN_PASS_2,
  };
  return map[email];
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
      // Deliberate vague message — don't reveal which emails are valid
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const expectedPassword = getPassword(normalised);
    if (!expectedPassword || password !== expectedPassword) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Issue JWT — 8-hour expiry
    const token = await new SignJWT({ email: normalised, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(SECRET);

    // Set httpOnly cookie
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
