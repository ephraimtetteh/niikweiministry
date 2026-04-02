// app/api/contact/route.js  (Next.js App Router)
//
// Receives POST from the contact page, validates required fields,
// then calls sendContactEmail() which fires:
//   1. Auto-reply to the submitter
//   2. Admin notification to ADMIN_EMAIL

import { sendContactEmail } from "@/utils/sendContactEmail";

const REQUIRED = {
  general: ["name", "email", "message"],
  events: ["name", "email", "phone", "event_name", "message"],
  booking: ["name", "email", "phone", "program_type", "message"],
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { formType, ...data } = body;

    // Validate form type
    if (!["general", "events", "booking"].includes(formType)) {
      return Response.json({ error: "Invalid form type" }, { status: 400 });
    }

    // Validate required fields
    const missing = (REQUIRED[formType] ?? []).filter(
      (field) => !data[field]?.toString().trim(),
    );
    if (missing.length > 0) {
      return Response.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 422 },
      );
    }

    // Fire emails — decoupled so an email error never blocks the 200
    sendContactEmail(formType, data).catch((err) => {
      console.error("[contact] Email dispatch error:", err.message);
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[contact] Error:", err.message);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
