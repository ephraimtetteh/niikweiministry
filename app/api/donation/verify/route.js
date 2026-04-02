// app/api/donation/verify/route.js
//import { sendDonationEmails } from "@/utils/sendDonationEmails";
import { addDonation } from "@/lib/store";
import { sendDonationEmails } from "@/utils/sendDonationEmail.js";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET || !PAYSTACK_SECRET.startsWith("sk_")) {
  console.error(
    "\n[donation/verify] ⚠️  PAYSTACK_SECRET_KEY must start with sk_test_ or sk_live_\n",
  );
}

async function verifyPaystackTransaction(reference) {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const hint = res.status === 401 ? " — use sk_test_… not pk_test_…" : "";
    throw new Error(
      `Paystack verify failed (${res.status}): ${err.message ?? res.statusText}${hint}`,
    );
  }
  const data = await res.json();
  if (!data.status)
    throw new Error(data.message ?? "Paystack returned status: false");
  return data.data;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { reference, donorMeta } = body;

    if (!reference)
      return Response.json(
        { error: "Missing payment reference" },
        { status: 400 },
      );

    let donation;

    if (donorMeta?.offlineAmount != null) {
      donation = {
        guestName: donorMeta.guestName ?? "Anonymous",
        guestEmail: donorMeta.guestEmail ?? "",
        guestPhoneNumber: donorMeta.guestPhoneNumber ?? "",
        guestDedication: donorMeta.guestDedication ?? "",
        frequency: donorMeta.frequency ?? "one-time",
        amount: donorMeta.offlineAmount,
        transactionId: reference,
        method: "offline",
        date:
          donorMeta.offlineDate ??
          new Date().toLocaleDateString("en-GH", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
      };
    } else {
      const transaction = await verifyPaystackTransaction(reference);
      if (transaction.status !== "success") {
        return Response.json(
          {
            error: "Payment not successful",
            paystackStatus: transaction.status,
          },
          { status: 402 },
        );
      }
      donation = {
        guestName:
          donorMeta?.guestName ??
          transaction.customer?.first_name ??
          "Anonymous",
        guestEmail: donorMeta?.guestEmail ?? transaction.customer?.email ?? "",
        guestPhoneNumber: donorMeta?.guestPhoneNumber ?? "",
        guestDedication: donorMeta?.guestDedication ?? "",
        frequency: donorMeta?.frequency ?? "one-time",
        amount: transaction.amount / 100,
        transactionId: transaction.reference,
        method: "paystack",
        date: new Date(transaction.paid_at ?? Date.now()).toLocaleDateString(
          "en-GH",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          },
        ),
      };
    }

    const record = addDonation(donation);

    sendDonationEmails(donation).catch((err) =>
      console.error("[donation/verify] Email error:", err.message),
    );

    return Response.json({ success: true, donation: record });
  } catch (err) {
    console.error("[donation/verify] Error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
