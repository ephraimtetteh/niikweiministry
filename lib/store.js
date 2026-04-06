// lib/store.js
// In-memory store — survives hot-reloads in dev via globalThis singleton.
// For production, swap each function body for database calls (MongoDB, Prisma, etc.)

const g = globalThis;
if (!g.__nkm_store) {
  g.__nkm_store = {
    donations: [],
    contacts: [],
    subscribers: [],
    visits: [], // { id, path, referrer, device, createdAt }
    activeSessions: {}, // sessionId -> { path, lastSeen, pageViews }
  };
}
const store = g.__nkm_store;

let _seq = 1;
const uid = () => `${Date.now()}-${_seq++}`;

// ── Donations ─────────────────────────────────────────────────────────────────
export function addDonation(data) {
  const record = {
    id: uid(),
    createdAt: new Date().toISOString(),
    status: "completed",
    ...data,
  };
  store.donations.unshift(record);
  return record;
}
export function getDonations() {
  return [...store.donations];
}
export function getDonationStats() {
  const d = store.donations;
  const total = d.reduce((s, x) => s + Number(x.amount), 0);
  const today = new Date().toDateString();
  return {
    total,
    count: d.length,
    todayAmt: d
      .filter((x) => new Date(x.createdAt).toDateString() === today)
      .reduce((s, x) => s + Number(x.amount), 0),
    todayCount: d.filter((x) => new Date(x.createdAt).toDateString() === today)
      .length,
    recurring: d.filter((x) => x.frequency !== "one-time").length,
  };
}



// ── Contacts ──────────────────────────────────────────────────────────────────
export function addContact(formType, data) {
  const record = {
    id: uid(),
    formType,
    createdAt: new Date().toISOString(),
    status: "unread",
    ...data,
  };
  store.contacts.unshift(record);
  return record;
}
export function getContacts(formType) {
  return formType
    ? store.contacts.filter((c) => c.formType === formType)
    : [...store.contacts];
}
export function markContactRead(id) {
  const c = store.contacts.find((c) => c.id === id);
  if (c) c.status = "read";
  return c;
}
export function markContactReplied(id) {
  const c = store.contacts.find((c) => c.id === id);
  if (c) c.status = "replied";
  return c;
}
export function getContactStats() {
  const c = store.contacts;
  return {
    total: c.length,
    unread: c.filter((x) => x.status === "unread").length,
    general: c.filter((x) => x.formType === "general").length,
    events: c.filter((x) => x.formType === "events").length,
    bookings: c.filter((x) => x.formType === "booking").length,
  };
}




// ── Subscribers ───────────────────────────────────────────────────────────────
export function addSubscriber(email) {
  const norm = email.toLowerCase().trim();
  const exists = store.subscribers.find((s) => s.email === norm);
  if (exists) return { duplicate: true, count: store.subscribers.length };
  const record = {
    id: uid(),
    email: norm,
    createdAt: new Date().toISOString(),
    status: "active",
  };
  store.subscribers.unshift(record);
  return { duplicate: false, count: store.subscribers.length, record };
}
export function getSubscribers() {
  return [...store.subscribers];
}
export function unsubscribe(email) {
  const s = store.subscribers.find(
    (s) => s.email === email.toLowerCase().trim(),
  );
  if (s) s.status = "unsubscribed";
  return s;
}
export function getSubscriberStats() {
  const s = store.subscribers;
  return {
    total: s.length,
    active: s.filter((x) => x.status === "active").length,
    unsubscribed: s.filter((x) => x.status === "unsubscribed").length,
  };
}

// ── Visitor Tracking ──────────────────────────────────────────────────────────
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 min inactivity = session ended

/** Record a page view and upsert the active session */
export function recordVisit({ sessionId, path, referrer, device, userAgent }) {
  const now = new Date();

  // Log the page view
  store.visits.push({
    id: uid(),
    path,
    referrer: referrer ?? "",
    device: device ?? "unknown",
    userAgent: userAgent ?? "",
    createdAt: now.toISOString(),
  });

  // Keep only last 5000 visits to avoid unbounded memory growth
  if (store.visits.length > 5000) store.visits = store.visits.slice(-5000);

  // Upsert active session
  if (sessionId) {
    if (!store.activeSessions[sessionId]) {
      store.activeSessions[sessionId] = {
        path,
        pageViews: 0,
        createdAt: now.toISOString(),
      };
    }
    store.activeSessions[sessionId].path = path;
    store.activeSessions[sessionId].lastSeen = now.toISOString();
    store.activeSessions[sessionId].pageViews =
      (store.activeSessions[sessionId].pageViews ?? 0) + 1;
  }

  // Prune stale sessions
  pruneSessions();
}

/** Heartbeat — keeps a session alive */
export function heartbeat(sessionId, path) {
  if (!sessionId) return;
  if (!store.activeSessions[sessionId]) {
    store.activeSessions[sessionId] = {
      path,
      pageViews: 1,
      createdAt: new Date().toISOString(),
    };
  }
  store.activeSessions[sessionId].lastSeen = new Date().toISOString();
  store.activeSessions[sessionId].path = path;
  pruneSessions();
}

function pruneSessions() {
  const cutoff = Date.now() - SESSION_TIMEOUT_MS;
  for (const [id, s] of Object.entries(store.activeSessions)) {
    if (!s.lastSeen || new Date(s.lastSeen).getTime() < cutoff) {
      delete store.activeSessions[id];
    }
  }
}

export function getVisitorStats() {
  pruneSessions();

  const visits = store.visits;
  const now = Date.now();
  const oneDay = 86400000;
  const oneWeek = 7 * oneDay;

  const today = visits.filter(
    (v) => now - new Date(v.createdAt).getTime() < oneDay,
  );
  const thisWeek = visits.filter(
    (v) => now - new Date(v.createdAt).getTime() < oneWeek,
  );

  // Unique by rough session (group by device+hour bucket)
  const uniqueToday = new Set(
    today.map(
      (v) => `${v.device}-${new Date(v.createdAt).toISOString().slice(0, 13)}`,
    ),
  ).size;

  // Top pages (today)
  const pageCounts = {};
  today.forEach((v) => {
    pageCounts[v.path] = (pageCounts[v.path] ?? 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, count]) => ({ path, count }));

  // Device breakdown (all time, last 1000)
  const recent = visits.slice(-1000);
  const deviceCounts = {};
  recent.forEach((v) => {
    deviceCounts[v.device] = (deviceCounts[v.device] ?? 0) + 1;
  });

  // Active right now
  const activeSessions = Object.values(store.activeSessions);
  const activeNow = activeSessions.length;
  const activePages = {};
  activeSessions.forEach((s) => {
    activePages[s.path] = (activePages[s.path] ?? 0) + 1;
  });

  return {
    totalVisits: visits.length,
    todayVisits: today.length,
    uniqueToday,
    weekVisits: thisWeek.length,
    activeNow,
    activePages: Object.entries(activePages)
      .sort((a, b) => b[1] - a[1])
      .map(([path, count]) => ({ path, count })),
    topPages,
    deviceCounts,
    recentVisits: visits.slice(-10).reverse(),
  };
}
