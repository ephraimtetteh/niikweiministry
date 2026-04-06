// hooks/useAnalytics.js
// Drop this hook into your root layout (or LayoutShell) — it auto-tracks every page view.
// Works with Next.js App Router (usePathname fires on client navigation too).
//
// Usage in LayoutShell.jsx:
//   import useAnalytics from "@/hooks/useAnalytics"
//   const LayoutShell = ({ children }) => { useAnalytics(); return <>{children}</> }

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Generate a random session ID and persist it for the browser session
function getSessionId() {
  if (typeof window === "undefined") return null;
  const key = "__nkm_sid";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

export default function useAnalytics() {
  const pathname = usePathname();
  const sessionId = useRef(null);
  const heartbeatRef = useRef(null);

  // Record page view on every route change
  useEffect(() => {
    if (!sessionId.current) sessionId.current = getSessionId();

    // Skip /admin routes — no need to track admin activity
    if (pathname?.startsWith("/admin")) return;

    const referrer = document.referrer || "";

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pageview",
        sessionId: sessionId.current,
        path: pathname,
        referrer,
      }),
    }).catch(() => {
      /* silent — never break the page */
    });
  }, [pathname]);

  // Heartbeat every 2 minutes while the tab is active
  useEffect(() => {
    const ping = () => {
      if (!sessionId.current || pathname?.startsWith("/admin")) return;
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "heartbeat",
          sessionId: sessionId.current,
          path: pathname,
        }),
      }).catch(() => {});
    };

    heartbeatRef.current = setInterval(ping, 2 * 60 * 1000); // every 2 min
    return () => clearInterval(heartbeatRef.current);
  }, [pathname]);
}
