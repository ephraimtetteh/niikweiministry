// utils/sendDonationEmails.js
// Server-side only — uses Nodemailer with an SMTP transport.
//
// Required .env.local vars:
//   SMTP_HOST      e.g. smtp.gmail.com | smtp.zoho.com | mail.yourdomain.com
//   SMTP_PORT      e.g. 465 (SSL) or 587 (STARTTLS)
//   SMTP_SECURE    "true" for port 465, "false" for 587
//   SMTP_USER      your sending email address
//   SMTP_PASS      your email password or app-specific password
//   FROM_NAME      e.g. "Nii Kwei Ministries"
//   ADMIN_EMAIL    comma-separated admin recipients

import nodemailer from "nodemailer";

// ─── Transport (created once, reused per invocation) ─────────────────────────
function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = `${process.env.FROM_NAME ?? "Nii Kwei Ministries"} <${process.env.SMTP_USER}>`;

// ─── Shared email wrapper ─────────────────────────────────────────────────────
function baseHtml(body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #F4F2EE; font-family: Georgia, 'Times New Roman', serif; }
    .wrap { max-width: 580px; margin: 40px auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.10); }
    .header { background: #0D0D12; padding: 36px 40px; text-align: center; }
    .eyebrow { font-family: Helvetica, Arial, sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #C9A84C; font-weight: 600; margin-bottom: 10px; }
    .header h1 { font-size: 26px; font-weight: 700; color: #fff; line-height: 1.25; }
    .header p  { font-size: 14px; color: rgba(255,255,255,.5); margin-top: 6px; font-family: Helvetica, Arial, sans-serif; }
    .amount-box { margin: 0 40px; background: rgba(201,168,76,.10); border: 1.5px solid rgba(201,168,76,.35); border-radius: 12px; padding: 20px; text-align: center; margin-top: -1px; }
    .amount-label { font-family: Helvetica, Arial, sans-serif; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: rgba(13,13,18,.45); margin-bottom: 4px; }
    .amount-value { font-size: 36px; font-weight: 700; color: #C9A84C; }
    .amount-freq  { font-family: Helvetica, Arial, sans-serif; font-size: 13px; color: rgba(13,13,18,.45); margin-top: 4px; text-transform: capitalize; }
    .body { padding: 32px 40px; }
    .section-label { font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #aaa; margin-bottom: 16px; }
    .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-family: Helvetica, Arial, sans-serif; }
    .row:last-child { border-bottom: none; }
    .row-label { font-size: 13px; color: #888; }
    .row-value { font-size: 14px; font-weight: 600; color: #0D0D12; text-align: right; max-width: 65%; }
    .accent-bar { border-left: 3px solid #C9A84C; border-radius: 0 8px 8px 0; padding: 16px 20px; background: #FAFAF8; margin-top: 24px; }
    .accent-bar p { font-family: Helvetica, Arial, sans-serif; font-size: 14px; color: #555; line-height: 1.7; }
    .footer { background: #F4F2EE; padding: 24px 40px; text-align: center; }
    .footer p { font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: #aaa; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="wrap">${body}</div>
</body>
</html>`;
}

// ─── Donor receipt template ───────────────────────────────────────────────────
function donorReceiptHtml({
  guestName,
  amount,
  frequency,
  transactionId,
  date,
  guestDedication,
}) {
  const amountFormatted = Number(amount).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
  });
  const freqNote =
    frequency === "one-time" ? "One-time gift" : `${frequency} contribution`;
  const dedicationRow = guestDedication
    ? `<div class="row"><span class="row-label">Dedication</span><span class="row-value">${guestDedication}</span></div>`
    : "";

  return baseHtml(`
    <div class="header">
      <p class="eyebrow">✦ Nii Kwei Ministries</p>
      <h1>Thank You, ${guestName}!</h1>
      <p>Your generous gift has been received.</p>
    </div>

    <div style="background:#0D0D12;padding:0 40px 32px">
      <div class="amount-box">
        <p class="amount-label">Total Donated</p>
        <p class="amount-value">GHS ${amountFormatted}</p>
        <p class="amount-freq">${freqNote}</p>
      </div>
    </div>

    <div class="body">
      <p class="section-label">Donation Details</p>
      <div class="row"><span class="row-label">Transaction ID</span><span class="row-value" style="font-size:12px;letter-spacing:.5px">${transactionId}</span></div>
      <div class="row"><span class="row-label">Date</span><span class="row-value">${date}</span></div>
      <div class="row"><span class="row-label">Frequency</span><span class="row-value">${freqNote}</span></div>
      ${dedicationRow}

      <div class="accent-bar">
        <p>Your gift makes a real difference — helping us spread the Gospel, serve communities,
        and empower believers nationwide. We are deeply grateful for your partnership.</p>
      </div>
    </div>

    <div class="footer">
      <p>Nii Kwei Ministries · Accra, Ghana</p>
      <p>This is your official donation receipt. Please keep it for your records.</p>
    </div>
  `);
}

// ─── Admin notification template ─────────────────────────────────────────────
function adminNotificationHtml({
  guestName,
  guestEmail,
  guestPhoneNumber,
  amount,
  frequency,
  transactionId,
  date,
  guestDedication,
}) {
  const amountFormatted = Number(amount).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
  });
  const freqNote = frequency === "one-time" ? "One-time" : frequency;
  const phoneRow = guestPhoneNumber
    ? `<div class="row"><span class="row-label">Phone</span><span class="row-value">${guestPhoneNumber}</span></div>`
    : "";
  const dedicationRow = guestDedication
    ? `<div class="row"><span class="row-label">Dedication</span><span class="row-value">${guestDedication}</span></div>`
    : "";

  return baseHtml(`
    <div class="header">
      <p class="eyebrow">Admin Alert</p>
      <h1>New Donation 🎉</h1>
      <p>A new donation has just been processed.</p>
    </div>

    <div style="background:#0D0D12;padding:0 40px 32px">
      <div class="amount-box">
        <p class="amount-label">Amount Received</p>
        <p class="amount-value">GHS ${amountFormatted}</p>
        <p class="amount-freq">${freqNote}</p>
      </div>
    </div>

    <div class="body">
      <p class="section-label">Donor Information</p>
      <div class="row"><span class="row-label">Name</span><span class="row-value">${guestName}</span></div>
      <div class="row"><span class="row-label">Email</span><span class="row-value">${guestEmail}</span></div>
      ${phoneRow}
      <div class="row"><span class="row-label">Transaction ID</span><span class="row-value" style="font-size:12px;letter-spacing:.5px">${transactionId}</span></div>
      <div class="row"><span class="row-label">Date</span><span class="row-value">${date}</span></div>
      ${dedicationRow}
    </div>

    <div class="footer">
      <p>Nii Kwei Ministries · Internal Notification</p>
      <p>Do not reply to this email.</p>
    </div>
  `);
}

// ─── Public API ───────────────────────────────────────────────────────────────
/**
 * Send donor receipt + admin notification emails.
 *
 * @param {{
 *   guestName: string,
 *   guestEmail: string,
 *   guestPhoneNumber?: string,
 *   guestDedication?: string,
 *   amount: string|number,
 *   frequency: string,
 *   transactionId: string,
 *   date: string,
 * }} donation
 */
export async function sendDonationEmails(donation) {
  const transporter = createTransport();

  const adminEmails = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const jobs = [
    // 1. Donor receipt
    transporter.sendMail({
      from: FROM,
      to: donation.guestEmail,
      subject: `Your donation of GHS ${Number(donation.amount).toLocaleString("en-GH", { minimumFractionDigits: 2 })} — Nii Kwei Ministries`,
      html: donorReceiptHtml(donation),
    }),
  ];

  // 2. Admin notification(s)
  if (adminEmails.length > 0) {
    jobs.push(
      transporter.sendMail({
        from: FROM,
        to: adminEmails.join(", "),
        subject: `New Donation: GHS ${Number(donation.amount).toLocaleString("en-GH", { minimumFractionDigits: 2 })} from ${donation.guestName}`,
        html: adminNotificationHtml(donation),
      }),
    );
  }

  const results = await Promise.allSettled(jobs);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `[sendDonationEmails] ${i === 0 ? "Receipt" : "Admin"} email failed:`,
        r.reason,
      );
    } else {
      console.log(
        `[sendDonationEmails] ${i === 0 ? "Receipt" : "Admin"} email sent:`,
        r.value.messageId,
      );
    }
  });

  return results;
}
