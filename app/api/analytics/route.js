// app/api/analytics/route.js
// Public POST  — records page views (called from useAnalytics hook)
// Protected GET — returns stats (called from admin dashboard)

import { recordVisit, heartbeat, getVisitorStats } from "@/lib/store";

// ── POST: record visit or heartbeat ──────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, sessionId, path, referrer } = body;

    // Detect device from UA
    const ua = request.headers.get("user-agent") ?? "";
    const device = /Mobile|Android|iPhone|iPad/i.test(ua)
      ? "mobile"
      : /Tablet|iPad/i.test(ua)
        ? "tablet"
        : "desktop";

    if (type === "heartbeat") {
      heartbeat(sessionId, path);
    } else {
      recordVisit({ sessionId, path, referrer, device, userAgent: ua });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ── GET: analytics stats (admin only — protected by middleware) ──────────────
export async function GET() {
  try {
    return Response.json(getVisitorStats());
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
