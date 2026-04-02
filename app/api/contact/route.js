// app/api/contact/route.js
import { sendContactEmail } from "@/utils/sendContactEmail";
import { addContact } from "@/lib/store";

const REQUIRED = {
  general: ["name", "email", "message"],
  events: ["name", "email", "phone", "event_name", "message"],
  booking: ["name", "email", "phone", "program_type", "message"],
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { formType, ...data } = body;

    if (!["general", "events", "booking"].includes(formType)) {
      return Response.json({ error: "Invalid form type" }, { status: 400 });
    }

    const missing = (REQUIRED[formType] ?? []).filter(
      (f) => !data[f]?.toString().trim(),
    );
    if (missing.length > 0) {
      return Response.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 422 },
      );
    }

    // Save to store
    addContact(formType, data);

    // Fire emails (non-blocking)
    sendContactEmail(formType, data).catch((err) =>
      console.error("[contact] Email error:", err.message),
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error("[contact] Error:", err.message);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
