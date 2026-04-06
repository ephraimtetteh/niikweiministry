"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtGHS = (n) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(n ?? 0);
const timeAgo = (iso) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
const statusPill = (s) =>
  ({
    unread: "bg-violet-50 text-violet-600 border-violet-200",
    read: "bg-gray-50 text-gray-400 border-gray-200",
    replied: "bg-green-50 text-green-600 border-green-200",
    completed: "bg-green-50 text-green-600 border-green-200",
    active: "bg-green-50 text-green-600 border-green-200",
    unsubscribed: "bg-gray-50 text-gray-400 border-gray-200",
    paystack: "bg-blue-50 text-blue-600 border-blue-200",
    offline: "bg-amber-50 text-amber-600 border-amber-200",
  })[s] ?? "bg-gray-50 text-gray-400 border-gray-200";

const exportCSV = (records) => {
  const rows = [
    ["Email", "Status", "Subscribed"].join(","),
    ...records.map((r) =>
      [r.email, r.status, new Date(r.createdAt).toLocaleDateString()].join(","),
    ),
  ];
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([rows.join("\n")], { type: "text/csv" }),
  );
  a.download = `subscribers-${Date.now()}.csv`;
  a.click();
};

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "donations", label: "Donations" },
  { id: "general", label: "Messages" },
  { id: "events", label: "Events" },
  { id: "booking", label: "Bookings" },
  { id: "subscribers", label: "Subscribers" },
];

// ─── Shared components ────────────────────────────────────────────────────────
const Stat = ({ label, value, sub, accent, children }) => (
  <div
    className={`bg-white border ${accent ? "border-violet-100 shadow-violet-50" : "border-gray-100"} rounded-2xl p-5 shadow-sm flex flex-col gap-2`}
  >
    <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-gray-400">
      {label}
    </p>
    <p
      className={`text-2xl font-bold ${accent ? "text-violet-600" : "text-gray-900"}`}
    >
      {value}
    </p>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
    {children}
  </div>
);

const Section = ({ title, action, children }) => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

const Empty = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-2">
    <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
      <svg
        className="w-4 h-4 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    </div>
    <p className="text-sm text-gray-300">{label}</p>
  </div>
);

const DonationRow = ({ d }) => (
  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-800 truncate">
        {d.guestName}
      </p>
      <p className="text-xs text-gray-400 truncate">{d.guestEmail}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-violet-600">{fmtGHS(d.amount)}</p>
      <p className="text-xs text-gray-400 capitalize">{d.frequency}</p>
    </div>
    <span
      className={`text-[10px] font-semibold uppercase tracking-[1px] px-2 py-1 rounded-full border ${statusPill(d.method)}`}
    >
      {d.method ?? "—"}
    </span>
    <p className="text-xs text-gray-300 text-right whitespace-nowrap">
      {timeAgo(d.createdAt)}
    </p>
  </div>
);

const ContactRow = ({ c, onMark }) => (
  <div className="px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
    <div className="flex items-start justify-between gap-4 mb-1.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-800">{c.name}</p>
          {c.status === "unread" && (
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-400">
          {c.email}
          {c.phone ? ` · ${c.phone}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[10px] font-semibold uppercase tracking-[1px] px-2 py-1 rounded-full border ${statusPill(c.status)}`}
        >
          {c.status}
        </span>
        <p className="text-xs text-gray-300 whitespace-nowrap">
          {timeAgo(c.createdAt)}
        </p>
      </div>
    </div>
    {c.event_name && (
      <p className="text-xs text-gray-500 mb-1">
        📅 <strong>{c.event_name}</strong>
        {c.event_date ? ` · ${c.event_date}` : ""}
      </p>
    )}
    {c.program_type && (
      <p className="text-xs text-gray-500 mb-1">
        🎤 <strong>{c.program_type}</strong>
        {c.preferred_date ? ` · ${c.preferred_date}` : ""}
      </p>
    )}
    <p className="text-xs text-gray-400 line-clamp-2 mt-1">{c.message}</p>
    {c.status !== "replied" && (
      <div className="flex gap-2 mt-3">
        {c.status === "unread" && (
          <button
            onClick={() => onMark(c.id, "read")}
            className="text-[11px] px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all border border-gray-200"
          >
            Mark Read
          </button>
        )}
        <a
          href={`mailto:${c.email}`}
          onClick={() => onMark(c.id, "replied")}
          className="text-[11px] px-3 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-600 transition-all border border-violet-200"
        >
          Reply via Email ↗
        </a>
      </div>
    )}
  </div>
);

const SubRow = ({ s }) => (
  <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
    <p className="text-sm text-gray-700 font-medium">{s.email}</p>
    <div className="flex items-center gap-3">
      <span
        className={`text-[10px] font-semibold uppercase tracking-[1px] px-2 py-1 rounded-full border ${statusPill(s.status)}`}
      >
        {s.status}
      </span>
      <p className="text-xs text-gray-300 whitespace-nowrap">
        {timeAgo(s.createdAt)}
      </p>
    </div>
  </div>
);

// ─── Live visitor indicator ────────────────────────────────────────────────────
const LiveBadge = ({ count }) => (
  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
    <p className="text-xs font-semibold text-green-700">{count} online now</p>
  </div>
);

// ─── Bar chart (simple CSS) ────────────────────────────────────────────────────
const BarChart = ({ data, max, label }) => (
  <div className="flex flex-col gap-2">
    {data.map(({ path, count }, i) => (
      <div key={i} className="flex items-center gap-3">
        <p className="text-xs text-gray-400 w-32 truncate shrink-0">
          {path || "/"}
        </p>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.round((count / (max || 1)) * 100)}%` }}
          />
        </div>
        <p className="text-xs font-semibold text-gray-600 w-8 text-right shrink-0">
          {count}
        </p>
      </div>
    ))}
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const fetchData = useCallback(
    async (view) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/data?view=${view}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        setData(await res.json());
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    fetchData(tab);
  }, [tab, fetchData]);

  // Auto-refresh analytics every 15s when on analytics tab
  useEffect(() => {
    if (tab === "analytics" || tab === "overview") {
      pollRef.current = setInterval(() => fetchData(tab), 15000);
    }
    return () => clearInterval(pollRef.current);
  }, [tab, fetchData]);

  const handleMark = async (id, action) => {
    await fetch("/api/admin/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    fetchData(tab);
  };
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const unread = data?.contactStats?.unread ?? 0;

  const NavBtn = ({ n }) => (
    <button
      onClick={() => setTab(n.id)}
      className={[
        "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full",
        tab === n.id
          ? "bg-violet-50 text-violet-700 border border-violet-100 shadow-sm"
          : "text-gray-500 hover:text-gray-800 hover:bg-gray-50",
      ].join(" ")}
    >
      <span>{n.label}</span>
      {n.id === "general" && unread > 0 && tab !== n.id && (
        <span className="text-[10px] bg-violet-500 text-white rounded-full px-1.5 py-0.5 font-bold">
          {unread}
        </span>
      )}
      {n.id === "analytics" && data?.visitorStats?.activeNow > 0 && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 fixed top-0 left-0 z-40 shadow-sm">
        <div className="px-5 py-6 border-b border-gray-50">
          <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-violet-500 mb-0.5">
            Admin Portal
          </p>
          <h1 className="text-sm font-bold text-gray-900">
            Nii Kwei Ministries
          </h1>
        </div>
        <nav className="flex-1 px-2.5 py-4 flex flex-col gap-0.5">
          {NAV.map((n) => (
            <NavBtn key={n.id} n={n} />
          ))}
        </nav>
        <div className="px-2.5 py-4 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all w-full"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 lg:ml-56 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-gray-900 capitalize">
              {NAV.find((n) => n.id === tab)?.label}
            </h2>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString("en-GH", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Live badge */}
            {data?.visitorStats?.activeNow > 0 && (
              <LiveBadge count={data.visitorStats.activeNow} />
            )}
            {/* Mobile nav */}
            <div className="flex lg:hidden gap-1 overflow-x-auto max-w-[50vw]">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setTab(n.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap ${tab === n.id ? "bg-violet-500 text-white" : "text-gray-400 hover:text-gray-700"}`}
                >
                  {n.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => fetchData(tab)}
              className="p-2 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-700"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-5 lg:p-7">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <svg
                className="animate-spin w-7 h-7 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </div>
          ) : !data ? null : (
            <>
              {/* ── OVERVIEW ── */}
              {tab === "overview" && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <Stat
                      label="Total Raised"
                      value={fmtGHS(data.donationStats?.total)}
                      sub={`${data.donationStats?.count} donations`}
                      accent
                    />
                    <Stat
                      label="Visitors Today"
                      value={data.visitorStats?.todayVisits ?? 0}
                      sub={`${data.visitorStats?.uniqueToday ?? 0} unique`}
                    />
                    <Stat
                      label="Active Now"
                      value={data.visitorStats?.activeNow ?? 0}
                      sub="live on site"
                    />
                    <Stat
                      label="Unread Messages"
                      value={data.contactStats?.unread ?? 0}
                      sub={`${data.contactStats?.total} total`}
                    />
                    <Stat
                      label="Subscribers"
                      value={data.subscriberStats?.active ?? 0}
                      sub={`${data.subscriberStats?.total} total`}
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <Section
                      title="Recent Donations"
                      action={
                        <button
                          onClick={() => setTab("donations")}
                          className="text-xs text-violet-500 hover:text-violet-700"
                        >
                          View all →
                        </button>
                      }
                    >
                      {data.recentDonations?.length ? (
                        data.recentDonations.map((d) => (
                          <DonationRow key={d.id} d={d} />
                        ))
                      ) : (
                        <Empty label="No donations yet" />
                      )}
                    </Section>
                    <Section
                      title="Recent Messages"
                      action={
                        <button
                          onClick={() => setTab("general")}
                          className="text-xs text-violet-500 hover:text-violet-700"
                        >
                          View all →
                        </button>
                      }
                    >
                      {data.recentContacts?.length ? (
                        data.recentContacts.map((c) => (
                          <ContactRow key={c.id} c={c} onMark={handleMark} />
                        ))
                      ) : (
                        <Empty label="No messages yet" />
                      )}
                    </Section>
                  </div>
                  {data.visitorStats?.topPages?.length > 0 && (
                    <Section title="Top Pages Today">
                      <div className="px-5 py-4">
                        <BarChart
                          data={data.visitorStats.topPages}
                          max={data.visitorStats.topPages[0]?.count}
                        />
                      </div>
                    </Section>
                  )}
                </div>
              )}

              {/* ── ANALYTICS ── */}
              {tab === "analytics" && (
                <div className="flex flex-col gap-5">
                  {/* Live pulse */}
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-green-600 mb-1">
                        Live Right Now
                      </p>
                      <p className="text-4xl font-bold text-green-700">
                        {data.activeNow ?? 0}
                      </p>
                      <p className="text-xs text-green-500 mt-1">
                        visitors currently on the site
                      </p>
                    </div>
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-green-300 opacity-30" />
                      <span className="relative inline-flex rounded-full h-8 w-8 bg-green-400 items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9z"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Stat
                      label="Total Visits"
                      value={data.totalVisits ?? 0}
                      sub="all time"
                    />
                    <Stat
                      label="Today"
                      value={data.todayVisits ?? 0}
                      sub={`${data.uniqueToday ?? 0} unique`}
                      accent
                    />
                    <Stat
                      label="This Week"
                      value={data.weekVisits ?? 0}
                      sub="last 7 days"
                    />
                    <Stat
                      label="Active Now"
                      value={data.activeNow ?? 0}
                      sub="live sessions"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {data.topPages?.length > 0 && (
                      <Section title="Top Pages Today">
                        <div className="px-5 py-4">
                          <BarChart
                            data={data.topPages}
                            max={data.topPages[0]?.count}
                          />
                        </div>
                      </Section>
                    )}
                    {data.activePages?.length > 0 && (
                      <Section title="Active Pages (Live)">
                        <div className="px-5 py-4 flex flex-col gap-2">
                          {data.activePages.map(({ path, count }, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                            >
                              <p className="text-sm text-gray-600 font-medium">
                                {path || "/"}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                                </span>
                                <p className="text-sm font-bold text-green-600">
                                  {count}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Section>
                    )}
                  </div>

                  {/* Device breakdown */}
                  {data.deviceCounts &&
                    Object.keys(data.deviceCounts).length > 0 && (
                      <Section title="Device Breakdown">
                        <div className="px-5 py-4 grid grid-cols-3 gap-4">
                          {Object.entries(data.deviceCounts).map(
                            ([device, count]) => (
                              <div
                                key={device}
                                className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100"
                              >
                                <p className="text-2xl mb-1">
                                  {device === "mobile"
                                    ? "📱"
                                    : device === "tablet"
                                      ? "📲"
                                      : "💻"}
                                </p>
                                <p className="text-xl font-bold text-gray-800">
                                  {count}
                                </p>
                                <p className="text-xs text-gray-400 capitalize">
                                  {device}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </Section>
                    )}

                  <p className="text-center text-xs text-gray-300">
                    Auto-refreshes every 15 seconds · Sessions expire after 30
                    min of inactivity
                  </p>
                </div>
              )}

              {/* ── DONATIONS ── */}
              {tab === "donations" && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Stat
                      label="Total Raised"
                      value={fmtGHS(data.donationStats?.total)}
                      sub={`${data.donationStats?.count} total`}
                      accent
                    />
                    <Stat
                      label="Today"
                      value={fmtGHS(data.donationStats?.todayAmt)}
                      sub={`${data.donationStats?.todayCount} today`}
                    />
                    <Stat
                      label="Recurring"
                      value={data.donationStats?.recurring ?? 0}
                      sub="subscriptions"
                    />
                    <Stat
                      label="One-time"
                      value={
                        (data.donationStats?.count ?? 0) -
                        (data.donationStats?.recurring ?? 0)
                      }
                      sub="single gifts"
                    />
                  </div>
                  <Section title={`All Donations (${data.total ?? 0})`}>
                    {data.records?.length ? (
                      data.records.map((d) => <DonationRow key={d.id} d={d} />)
                    ) : (
                      <Empty label="No donations yet" />
                    )}
                  </Section>
                </div>
              )}

              {/* ── CONTACTS ── */}
              {["general", "events", "booking"].includes(tab) && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <Stat label="Total" value={data.total ?? 0} />
                    <Stat
                      label="Unread"
                      value={data.contactStats?.unread ?? 0}
                      accent
                    />
                    <Stat
                      label="Replied"
                      value={
                        (data.total ?? 0) - (data.contactStats?.unread ?? 0)
                      }
                    />
                  </div>
                  <Section
                    title={`${NAV.find((n) => n.id === tab)?.label} (${data.total ?? 0})`}
                  >
                    {data.records?.length ? (
                      data.records.map((c) => (
                        <ContactRow key={c.id} c={c} onMark={handleMark} />
                      ))
                    ) : (
                      <Empty label={`No ${tab} submissions yet`} />
                    )}
                  </Section>
                </div>
              )}

              {/* ── SUBSCRIBERS ── */}
              {tab === "subscribers" && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <Stat
                      label="Total"
                      value={data.subscriberStats?.total ?? 0}
                      accent
                    />
                    <Stat
                      label="Active"
                      value={data.subscriberStats?.active ?? 0}
                    />
                    <Stat
                      label="Unsubscribed"
                      value={data.subscriberStats?.unsubscribed ?? 0}
                    />
                  </div>
                  <Section
                    title={`All Subscribers (${data.total ?? 0})`}
                    action={
                      data.records?.length ? (
                        <button
                          onClick={() => exportCSV(data.records)}
                          className="flex items-center gap-1 text-xs text-violet-500 hover:text-violet-700"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>
                          Export CSV
                        </button>
                      ) : null
                    }
                  >
                    {data.records?.length ? (
                      data.records.map((s) => <SubRow key={s.id} s={s} />)
                    ) : (
                      <Empty label="No subscribers yet" />
                    )}
                  </Section>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
