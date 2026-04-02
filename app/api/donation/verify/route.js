// app/api/donation/verify/route.js  (Next.js App Router)
//
// Verifies a Paystack transaction then fires both emails via Nodemailer.
// For Pages Router: export default async function handler(req, res) { ... }
//
// Required .env.local:
//   PAYSTACK_SECRET_KEY   sk_test_… or sk_live_…
//   SMTP_HOST / SMTP_PORT / SMTP_SECURE / SMTP_USER / SMTP_PASS
//   FROM_NAME             e.g. "Nii Kwei Ministries"
//   ADMIN_EMAIL           comma-separated

import { sendDonationEmails } from "@/utils/sendDonationEmail";

// app/api/donation/verify/route.js  (Next.js App Router)
//
// Required .env.local:
//   PAYSTACK_SECRET_KEY   sk_test_… or sk_live_…   ← must start with sk_, NOT pk_
//   SMTP_HOST / SMTP_PORT / SMTP_SECURE / SMTP_USER / SMTP_PASS
//   FROM_NAME             e.g. "Nii Kwei Ministries"
//   ADMIN_EMAIL           comma-separated


const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY

// ─── Boot-time env sanity checks (printed once on server cold start) ──────────
if (!PAYSTACK_SECRET || !PAYSTACK_SECRET.startsWith("sk_")) {
  console.error(
    "\n[donation/verify] ⚠️  PAYSTACK_SECRET_KEY is missing or wrong." +
    "\n   Must start with sk_test_… or sk_live_… (NOT pk_test_…)" +
    "\n   Fix it in .env.local then restart the dev server.\n"
  )
}
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error(
    "\n[donation/verify] ⚠️  SMTP_USER or SMTP_PASS is missing." +
    "\n   Gmail: create an App Password at myaccount.google.com/apppasswords" +
    "\n   Your regular Gmail password will NOT work — Google blocks it.\n"
  )
}

// ─── Paystack verification ────────────────────────────────────────────────────
async function verifyPaystackTransaction(reference) {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const hint =
      res.status === 401
        ? " — PAYSTACK_SECRET_KEY is invalid. Use sk_test_… not pk_test_…"
        : ""
    throw new Error(
      `Paystack verify failed (${res.status}): ${err.message ?? res.statusText}${hint}`
    )
  }

  const data = await res.json()
  if (!data.status) throw new Error(data.message ?? "Paystack returned status: false")
  return data.data
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json()
    const { reference, donorMeta } = body

    if (!reference) {
      return Response.json({ error: "Missing payment reference" }, { status: 400 })
    }

    let donation

    // ── Offline path (bank transfer / manual card) ─────────────────────────
    if (donorMeta?.offlineAmount != null) {
      donation = {
        guestName:        donorMeta.guestName        ?? "Anonymous",
        guestEmail:       donorMeta.guestEmail        ?? "",
        guestPhoneNumber: donorMeta.guestPhoneNumber  ?? "",
        guestDedication:  donorMeta.guestDedication   ?? "",
        frequency:        donorMeta.frequency         ?? "one-time",
        amount:           donorMeta.offlineAmount,
        transactionId:    reference,
        date:             donorMeta.offlineDate ??
          new Date().toLocaleDateString("en-GH", {
            day: "numeric", month: "long", year: "numeric",
          }),
      }
    } else {
      // ── Paystack path ────────────────────────────────────────────────────
      const transaction = await verifyPaystackTransaction(reference)

      if (transaction.status !== "success") {
        return Response.json(
          { error: "Payment not successful", paystackStatus: transaction.status },
          { status: 402 }
        )
      }

      donation = {
        guestName:        donorMeta?.guestName        ?? transaction.customer?.first_name ?? "Anonymous",
        guestEmail:       donorMeta?.guestEmail        ?? transaction.customer?.email      ?? "",
        guestPhoneNumber: donorMeta?.guestPhoneNumber  ?? "",
        guestDedication:  donorMeta?.guestDedication   ?? "",
        frequency:        donorMeta?.frequency         ?? "one-time",
        amount:           transaction.amount / 100, // pesewas → GHS
        transactionId:    transaction.reference,
        date:             new Date(transaction.paid_at ?? Date.now()).toLocaleDateString("en-GH", {
          day: "numeric", month: "long", year: "numeric",
        }),
      }
    }

    // ── Fire emails — decoupled so an email failure never blocks the 200 ───
    // sendDonationEmails uses Promise.allSettled internally, but we still
    // wrap here so any unexpected throw doesn't reach the catch below.
    sendDonationEmails(donation).catch((err) => {
      console.error("[donation/verify] Email dispatch error:", err.message)
    })

    return Response.json({ success: true, donation })
  } catch (err) {
    console.error("[donation/verify] Error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}