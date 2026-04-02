"use client";

import { useEffect, useState, useCallback } from "react";
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

const pill = (status) =>
  ({
    unread: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    read: "bg-white/8 text-white/40 border-white/10",
    replied: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    unsubscribed: "bg-white/8 text-white/35 border-white/10",
    paystack: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    offline: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  })[status] ?? "bg-white/8 text-white/40 border-white/10";

// Export subscribers as CSV
const exportCSV = (records) => {
  const rows = [
    ["Email", "Status", "Subscribed"].join(","),
    ...records.map((r) =>
      [r.email, r.status, new Date(r.createdAt).toLocaleDateString()].join(","),
    ),
  ];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `subscribers-${Date.now()}.csv`;
  a.click();
};

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "donations", label: "Donations", icon: "coin" },
  { id: "general", label: "Messages", icon: "mail" },
  { id: "events", label: "Events", icon: "cal" },
  { id: "booking", label: "Bookings", icon: "user" },
  { id: "subscribers", label: "Subscribers", icon: "bell" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ id, cls = "w-4 h-4" }) => {
  const p = {
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2,
  };
  const paths = {
    grid: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
    coin: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    mail: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
    cal: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5",
    user: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0",
    bell: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
    out: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75",
    refresh:
      "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
    dl: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3",
    check: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };
  return (
    <svg className={cls} {...p}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[id]} />
    </svg>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const Stat = ({ label, value, sub, iconId, accent }) => (
  <div
    className={`bg-white/5 border ${accent ?? "border-white/10"} rounded-2xl p-5 flex flex-col gap-3`}
  >
    <div className="flex items-start justify-between">
      <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-white/35">
        {label}
      </p>
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent ? "bg-violet-500/15 border border-violet-500/20" : "bg-white/5 border border-white/8"}`}
      >
        <Icon
          id={iconId}
          cls={`w-4 h-4 ${accent ? "text-violet-400" : "text-white/35"}`}
        />
      </div>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    {sub && <p className="text-xs text-white/30">{sub}</p>}
  </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, action, children }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

const Empty = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-14 gap-3">
    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/8 flex items-center justify-center">
      <Icon id="check" cls="w-5 h-5 text-white/15" />
    </div>
    <p className="text-sm text-white/25">{label}</p>
  </div>
);

// ─── Row: Donation ────────────────────────────────────────────────────────────
const DonationRow = ({ d }) => (
  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
    <div className="min-w-0">
      <p className="text-sm font-medium text-white truncate">{d.guestName}</p>
      <p className="text-xs text-white/30 truncate">{d.guestEmail}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-violet-400">{fmtGHS(d.amount)}</p>
      <p className="text-xs text-white/30 capitalize">{d.frequency}</p>
    </div>
    <span
      className={`text-[10px] font-semibold uppercase tracking-[1px] px-2 py-1 rounded-full border ${pill(d.method)}`}
    >
      {d.method ?? "—"}
    </span>
    <p className="text-xs text-white/25 text-right whitespace-nowrap">
      {timeAgo(d.createdAt)}
    </p>
  </div>
);

// ─── Row: Contact ─────────────────────────────────────────────────────────────
const ContactRow = ({ c, onMark }) => (
  <div className="px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
    <div className="flex items-start justify-between gap-4 mb-1.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white">{c.name}</p>
          {c.status === "unread" && (
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
          )}
        </div>
        <p className="text-xs text-white/30">
          {c.email}
          {c.phone ? ` · ${c.phone}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[10px] font-semibold uppercase tracking-[1px] px-2 py-1 rounded-full border ${pill(c.status)}`}
        >
          {c.status}
        </span>
        <p className="text-xs text-white/25 whitespace-nowrap">
          {timeAgo(c.createdAt)}
        </p>
      </div>
    </div>
    {c.event_name && (
      <p className="text-xs text-white/45 mb-1">
        📅 <strong className="text-white/65">{c.event_name}</strong>
        {c.event_date ? ` · ${c.event_date}` : ""}
        {c.venue ? ` · ${c.venue}` : ""}
      </p>
    )}
    {c.program_type && (
      <p className="text-xs text-white/45 mb-1">
        🎤 <strong className="text-white/65">{c.program_type}</strong>
        {c.preferred_date ? ` · ${c.preferred_date}` : ""}
      </p>
    )}
    {c.subject && (
      <p className="text-xs text-white/45 mb-1">
        Re: <span className="text-white/65">{c.subject}</span>
      </p>
    )}
    <p className="text-xs text-white/35 line-clamp-2 mt-1">{c.message}</p>
    {c.status !== "replied" && (
      <div className="flex gap-2 mt-3">
        {c.status === "unread" && (
          <button
            onClick={() => onMark(c.id, "read")}
            className="text-[11px] px-3 py-1 rounded-lg bg-white/8 hover:bg-white/12 text-white/55 hover:text-white transition-all border border-white/10"
          >
            Mark Read
          </button>
        )}
        <a
          href={`mailto:${c.email}`}
          onClick={() => onMark(c.id, "replied")}
          className="text-[11px] px-3 py-1 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 transition-all border border-violet-500/20"
        >
          Reply via Email ↗
        </a>
      </div>
    )}
  </div>
);

// ─── Row: Subscriber ─────────────────────────────────────────────────────────
const SubRow = ({ s }) => (
  <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
    <p className="text-sm text-white/80 font-medium">{s.email}</p>
    <div className="flex items-center gap-3">
      <span
        className={`text-[10px] font-semibold uppercase tracking-[1px] px-2 py-1 rounded-full border ${pill(s.status)}`}
      >
        {s.status}
      </span>
      <p className="text-xs text-white/25 whitespace-nowrap">
        {timeAgo(s.createdAt)}
      </p>
    </div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  const handleMark = async (id, action) => {
    await fetch("/api/admin/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    fetchData(activeTab);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const unreadCount = data?.contactStats?.unread ?? 0;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-white/3 border-r border-white/20 fixed top-0 left-0 z-40">
        <div className="px-5 py-6 border-b border-white/20">
          <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-violet-400 mb-0.5">
            Admin Portal
          </p>
          <h1 className="text-sm font-bold text-white leading-snug">
            Nii Kwei Ministries
          </h1>
        </div>

        <nav className="flex-1 px-2.5 py-4 flex flex-col gap-0.5">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveTab(n.id)}
              className={[
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full",
                activeTab === n.id
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                  : "text-white/40 hover:text-white/75 hover:bg-white/5",
              ].join(" ")}
            >
              <Icon
                id={n.icon}
                cls={`w-4 h-4 shrink-0 ${activeTab === n.id ? "text-violet-400" : "text-white/30"}`}
              />
              {n.label}
              {n.id === "general" && unreadCount > 0 && activeTab !== n.id && (
                <span className="ml-auto text-[10px] bg-violet-500 text-white rounded-full px-1.5 py-0.5 font-bold leading-none">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-2.5 py-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-red-400 hover:bg-red-500/8 transition-all w-full"
          >
            <Icon id="out" cls="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 lg:ml-56 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-5 bg-black/90 backdrop-blur-sm border-b border-white/20">
          <div>
            <h2 className="text-base font-semibold text-white capitalize">
              {NAV.find((n) => n.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-white/25">
              {new Date().toLocaleDateString("en-GH", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile nav */}
            <div className="flex lg:hidden gap-1 overflow-x-auto">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setActiveTab(n.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${activeTab === n.id ? "bg-violet-500 text-white" : "text-white/35 hover:text-white"}`}
                >
                  {n.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => fetchData(activeTab)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/40 hover:text-white"
            >
              <Icon id="refresh" cls="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="hidden lg:flex p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-white/40 hover:text-red-400"
            >
              <Icon id="out" cls="w-4 h-4" />
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
              {activeTab === "overview" && (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Stat
                      label="Total Raised"
                      value={fmtGHS(data.donationStats?.total)}
                      sub={`${data.donationStats?.count} donations`}
                      iconId="coin"
                      accent="border-violet-500/25"
                    />
                    <Stat
                      label="Unread Messages"
                      value={data.contactStats?.unread ?? 0}
                      sub={`${data.contactStats?.total} total`}
                      iconId="mail"
                    />
                    <Stat
                      label="Bookings"
                      value={data.contactStats?.bookings ?? 0}
                      sub={`${data.contactStats?.events} event inquiries`}
                      iconId="user"
                    />
                    <Stat
                      label="Subscribers"
                      value={data.subscriberStats?.active ?? 0}
                      sub={`${data.subscriberStats?.total} total`}
                      iconId="bell"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <Section
                      title="Recent Donations"
                      action={
                        <button
                          onClick={() => setActiveTab("donations")}
                          className="text-xs text-violet-400 hover:text-violet-300"
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
                          onClick={() => setActiveTab("general")}
                          className="text-xs text-violet-400 hover:text-violet-300"
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

                  <Section
                    title="Recent Subscribers"
                    action={
                      <button
                        onClick={() => setActiveTab("subscribers")}
                        className="text-xs text-violet-400 hover:text-violet-300"
                      >
                        View all →
                      </button>
                    }
                  >
                    {data.recentSubscribers?.length ? (
                      data.recentSubscribers.map((s) => (
                        <SubRow key={s.id} s={s} />
                      ))
                    ) : (
                      <Empty label="No subscribers yet" />
                    )}
                  </Section>
                </div>
              )}

              {/* ── DONATIONS ── */}
              {activeTab === "donations" && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Stat
                      label="Total Raised"
                      value={fmtGHS(data.donationStats?.total)}
                      sub={`${data.donationStats?.count} donations`}
                      iconId="coin"
                      accent="border-violet-500/25"
                    />
                    <Stat
                      label="Today"
                      value={fmtGHS(data.donationStats?.todayAmt)}
                      sub={`${data.donationStats?.todayCount} today`}
                      iconId="cal"
                    />
                    <Stat
                      label="Recurring"
                      value={data.donationStats?.recurring ?? 0}
                      sub="active subscriptions"
                      iconId="refresh"
                    />
                    <Stat
                      label="One-time"
                      value={
                        (data.donationStats?.count ?? 0) -
                        (data.donationStats?.recurring ?? 0)
                      }
                      sub="single gifts"
                      iconId="check"
                    />
                  </div>
                  <Section title={`All Donations (${data.total ?? 0})`}>
                    {data.records?.length ? (
                      data.records.map((d) => <DonationRow key={d.id} d={d} />)
                    ) : (
                      <Empty label="No donations recorded yet" />
                    )}
                  </Section>
                </div>
              )}

              {/* ── CONTACTS ── */}
              {["general", "events", "booking"].includes(activeTab) && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <Stat label="Total" value={data.total ?? 0} iconId="mail" />
                    <Stat
                      label="Unread"
                      value={data.contactStats?.unread ?? 0}
                      iconId="bell"
                      accent="border-violet-500/25"
                    />
                    <Stat
                      label="Replied"
                      value={
                        (data.total ?? 0) - (data.contactStats?.unread ?? 0)
                      }
                      iconId="check"
                    />
                  </div>
                  <Section
                    title={`${NAV.find((n) => n.id === activeTab)?.label} (${data.total ?? 0})`}
                  >
                    {data.records?.length ? (
                      data.records.map((c) => (
                        <ContactRow key={c.id} c={c} onMark={handleMark} />
                      ))
                    ) : (
                      <Empty label={`No ${activeTab} submissions yet`} />
                    )}
                  </Section>
                </div>
              )}

              {/* ── SUBSCRIBERS ── */}
              {activeTab === "subscribers" && (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <Stat
                      label="Total"
                      value={data.subscriberStats?.total ?? 0}
                      iconId="bell"
                      accent="border-violet-500/25"
                    />
                    <Stat
                      label="Active"
                      value={data.subscriberStats?.active ?? 0}
                      iconId="check"
                    />
                    <Stat
                      label="Unsubscribed"
                      value={data.subscriberStats?.unsubscribed ?? 0}
                      iconId="out"
                    />
                  </div>
                  <Section
                    title={`All Subscribers (${data.total ?? 0})`}
                    action={
                      data.records?.length ? (
                        <button
                          onClick={() => exportCSV(data.records)}
                          className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          <Icon id="dl" cls="w-3.5 h-3.5" />
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
