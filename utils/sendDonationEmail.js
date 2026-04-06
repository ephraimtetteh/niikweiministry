// utils/sendDonationEmails.js
// Server-side only. SMTP env vars: SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, FROM_NAME, ADMIN_EMAIL

import nodemailer from "nodemailer";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const FROM = `${process.env.FROM_NAME ?? "Nii Kwei Ministries"} <${process.env.SMTP_USER}>`;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

// ─── Shared shell ─────────────────────────────────────────────────────────────
function shell(body) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#F8F7F5;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a}
    .wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;box-shadow:0 2px 16px rgba(0,0,0,.06)}
    .header{background:#6D28D9;padding:32px 40px;text-align:center}
    .eyebrow{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.7);font-weight:600;margin-bottom:8px}
    .header h1{font-size:22px;font-weight:700;color:#fff;font-family:Georgia,serif}
    .header p{font-size:13px;color:rgba(255,255,255,.65);margin-top:5px}
    .badge{display:inline-block;margin:14px auto 0;padding:4px 14px;border-radius:50px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.12);font-size:11px;font-weight:600;color:#fff;letter-spacing:1px;text-transform:uppercase}
    .hero-amount{background:#F5F0FF;border:1px solid #E4D4FF;margin:0 32px;border-radius:12px;padding:20px;text-align:center;margin-top:-1px}
    .amount-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#7C3AED;margin-bottom:4px}
    .amount-value{font-size:34px;font-weight:800;color:#5B21B6;font-family:Georgia,serif}
    .amount-freq{font-size:12px;color:#9CA3AF;margin-top:4px;text-transform:capitalize}
    .body{padding:28px 40px}
    .section-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:12px}
    .row{display:flex;justify-content:space-between;align-items:flex-start;padding:10px 0;border-bottom:1px solid #F3F4F6}
    .row:last-child{border-bottom:none}
    .rl{font-size:12.5px;color:#6B7280;min-width:120px}
    .rv{font-size:13px;font-weight:600;color:#111827;text-align:right;max-width:60%}
    .message-box{background:#FAFAFA;border-left:3px solid #7C3AED;border-radius:0 8px 8px 0;padding:14px 18px;margin-top:16px}
    .message-box p{font-size:13.5px;color:#374151;line-height:1.75;white-space:pre-wrap}
    .note-box{background:#F5F0FF;border:1px solid #E4D4FF;border-radius:10px;padding:14px 18px;margin-top:18px}
    .note-box p{font-size:13px;color:#5B21B6;line-height:1.7}
    .cta-btn{display:inline-block;margin-top:18px;padding:11px 26px;background:#6D28D9;color:#fff!important;text-decoration:none;border-radius:10px;font-size:13px;font-weight:700;letter-spacing:.3px}
    .footer{background:#F8F7F5;padding:20px 40px;text-align:center;border-top:1px solid #F3F4F6}
    .footer p{font-size:11.5px;color:#9CA3AF;margin-top:3px}
    .footer a{color:#7C3AED;text-decoration:none}
  </style></head>
  <body><div class="wrap">${body}</div></body></html>`;
}

// ─── Donor receipt ────────────────────────────────────────────────────────────
function donorReceiptHtml({
  guestName,
  amount,
  frequency,
  transactionId,
  date,
  guestDedication,
}) {
  const amtFmt = Number(amount).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
  });
  const freqNote =
    frequency === "one-time" ? "One-time gift" : `${frequency} contribution`;
  const dedRow = guestDedication
    ? `<div class="row"><span class="rl">Dedication</span><span class="rv">${guestDedication}</span></div>`
    : "";

  return shell(`
    <div class="header">
      <p class="eyebrow">✦ Nii Kwei Ministries</p>
      <h1>Thank You, ${guestName}!</h1>
      <p>Your generous gift has been received and recorded.</p>
    </div>
    <div style="background:#6D28D9;padding:0 0 28px">
      <div class="hero-amount">
        <p class="amount-label">Total Donated</p>
        <p class="amount-value">GHS ${amtFmt}</p>
        <p class="amount-freq">${freqNote}</p>
      </div>
    </div>
    <div class="body">
      <p class="section-label">Donation Details</p>
      <div class="row"><span class="rl">Transaction ID</span><span class="rv" style="font-size:11px;letter-spacing:.5px;font-family:monospace">${transactionId}</span></div>
      <div class="row"><span class="rl">Date</span><span class="rv">${date}</span></div>
      <div class="row"><span class="rl">Frequency</span><span class="rv">${freqNote}</span></div>
      ${dedRow}
      <div class="note-box">
        <p>Your gift makes a real difference — helping us spread the Gospel, serve communities, and empower believers nation wide. We are deeply grateful for your partnership.</p>
      </div>
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Accra, Ghana</p>
      <p style="margin-top:6px">This is your official donation receipt. Please keep it for your records.</p>
    </div>`);
}

// ─── Admin notification ───────────────────────────────────────────────────────
function adminDonationHtml({
  guestName,
  guestEmail,
  guestPhoneNumber,
  amount,
  frequency,
  transactionId,
  date,
  guestDedication,
}) {
  const amtFmt = Number(amount).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
  });
  const freqNote = frequency === "one-time" ? "One-time" : frequency;
  const phoneRow = guestPhoneNumber
    ? `<div class="row"><span class="rl">Phone</span><span class="rv">${guestPhoneNumber}</span></div>`
    : "";
  const dedRow = guestDedication
    ? `<div class="row"><span class="rl">Dedication</span><span class="rv">${guestDedication}</span></div>`
    : "";

  return shell(`
    <div class="header">
      <p class="eyebrow">New Donation</p>
      <h1>Payment Received 🎉</h1>
      <p>A new donation has been processed successfully.</p>
      <div class="badge">${freqNote}</div>
    </div>
    <div style="background:#6D28D9;padding:0 0 28px">
      <div class="hero-amount">
        <p class="amount-label">Amount</p>
        <p class="amount-value">GHS ${amtFmt}</p>
        <p class="amount-freq">${freqNote}</p>
      </div>
    </div>
    <div class="body">
      <p class="section-label">Donor Information</p>
      <div class="row"><span class="rl">Name</span><span class="rv">${guestName}</span></div>
      <div class="row"><span class="rl">Email</span><span class="rv">${guestEmail}</span></div>
      ${phoneRow}
      <div class="row"><span class="rl">Transaction ID</span><span class="rv" style="font-size:11px;letter-spacing:.5px;font-family:monospace">${transactionId}</span></div>
      <div class="row"><span class="rl">Date</span><span class="rv">${date}</span></div>
      ${dedRow}
      <a href="${BASE_URL}/admin" class="cta-btn">View in Dashboard →</a>
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Internal Notification</p>
      <p>Reply to: <a href="mailto:${guestEmail}">${guestEmail}</a></p>
    </div>`);
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function sendDonationEmails(donation) {
  const transporter = createTransport();
  const admins = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const amtFmt = Number(donation.amount).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
  });

  const jobs = [
    transporter.sendMail({
      from: FROM,
      to: donation.guestEmail,
      subject: `Your donation of GHS ${amtFmt} — Nii Kwei Ministries`,
      html: donorReceiptHtml(donation),
    }),
  ];

  if (admins.length > 0) {
    jobs.push(
      transporter.sendMail({
        from: FROM,
        to: admins.join(", "),
        subject: `New Donation: GHS ${amtFmt} from ${donation.guestName}`,
        html: adminDonationHtml(donation),
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r, i) => {
    if (r.status === "rejected")
      console.error(
        `[sendDonationEmails] ${i === 0 ? "Receipt" : "Admin"} failed:`,
        r.reason,
      );
    else
      console.log(
        `[sendDonationEmails] ${i === 0 ? "Receipt" : "Admin"} sent:`,
        r.value.messageId,
      );
  });
  return results;
}
