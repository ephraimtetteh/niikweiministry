// app/api/admin/data/route.js
import {
  getDonations,
  getDonationStats,
  getContacts,
  getContactStats,
  markContactRead,
  markContactReplied,
  getSubscribers,
  getSubscriberStats,
} from "@/lib/store";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view") ?? "overview";
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = 25;

    const donationStats = getDonationStats();
    const contactStats = getContactStats();
    const subscriberStats = getSubscriberStats();

    if (view === "overview") {
      return Response.json({
        donationStats,
        contactStats,
        subscriberStats,
        recentDonations: getDonations().slice(0, 5),
        recentContacts: getContacts().slice(0, 5),
        recentSubscribers: getSubscribers().slice(0, 5),
      });
    }

    if (view === "donations") {
      const all = getDonations();
      return Response.json({
        records: all.slice((page - 1) * pageSize, page * pageSize),
        total: all.length,
        donationStats,
      });
    }

    if (["general", "events", "booking"].includes(view)) {
      const all = getContacts(view);
      return Response.json({
        records: all.slice((page - 1) * pageSize, page * pageSize),
        total: all.length,
        contactStats,
      });
    }

    if (view === "subscribers") {
      const all = getSubscribers();
      return Response.json({
        records: all.slice((page - 1) * pageSize, page * pageSize),
        total: all.length,
        subscriberStats,
      });
    }

    return Response.json({ error: "Invalid view" }, { status: 400 });
  } catch (err) {
    console.error("[admin/data]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, action } = await request.json();
    const record =
      action === "replied" ? markContactReplied(id) : markContactRead(id);
    if (!record) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ success: true, record });
  } catch (err) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
