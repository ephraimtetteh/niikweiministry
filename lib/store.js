// lib/store.js
// In-memory store — survives hot-reloads in dev via globalThis singleton.
// For production, swap each function body for database calls (MongoDB, Prisma, etc.)
// — the public API stays the same across all files.

const g = globalThis;
if (!g.__nkm_store) {
  g.__nkm_store = { donations: [], contacts: [], subscribers: [] };
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

// ── Newsletter Subscribers ────────────────────────────────────────────────────
export function addSubscriber(email) {
  const normalised = email.toLowerCase().trim();
  const exists = store.subscribers.find((s) => s.email === normalised);
  if (exists) return { duplicate: true, count: store.subscribers.length };

  const record = {
    id: uid(),
    email: normalised,
    createdAt: new Date().toISOString(),
    status: "active", // "active" | "unsubscribed"
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
