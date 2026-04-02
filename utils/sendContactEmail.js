// utils/sendContactEmail.js
// Server-side only. Same SMTP env vars as sendDonationEmails.js
// Also add NEXT_PUBLIC_BASE_URL=https://yourdomain.com for the dashboard link in admin emails.

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

const adminEmails = () =>
  (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

// ─── Shared shell ─────────────────────────────────────────────────────────────
function baseHtml(body) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#F4F2EE;font-family:Helvetica,Arial,sans-serif}
    .wrap{max-width:580px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10)}
    .header{background:#0D0D12;padding:36px 40px;text-align:center}
    .eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8B5CF6;font-weight:600;margin-bottom:10px}
    .header h1{font-size:22px;font-weight:700;color:#fff;font-family:Georgia,serif;line-height:1.3}
    .header p{font-size:13px;color:rgba(255,255,255,.5);margin-top:6px}
    .badge{display:inline-block;margin:18px auto 0;padding:5px 16px;border-radius:50px;border:1.5px solid rgba(139,92,246,.4);background:rgba(139,92,246,.12);font-size:11px;font-weight:600;color:#A78BFA;letter-spacing:1px;text-transform:uppercase}
    .body{padding:28px 40px}
    .label{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;margin-bottom:12px}
    .row{display:flex;justify-content:space-between;align-items:flex-start;padding:10px 0;border-bottom:1px solid #f0f0f0}
    .row:last-child{border-bottom:none}
    .rl{font-size:12.5px;color:#999;min-width:130px}
    .rv{font-size:13px;font-weight:600;color:#0D0D12;text-align:right;max-width:60%}
    .msg{margin-top:18px;background:#FAFAF8;border-left:3px solid #7C3AED;border-radius:0 8px 8px 0;padding:14px 18px}
    .msg p{font-size:13.5px;color:#444;line-height:1.75;white-space:pre-wrap}
    .info{background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);border-radius:10px;padding:14px 18px;margin-top:18px}
    .info p{font-size:13px;color:#555;line-height:1.7}
    .dash-btn{display:inline-block;margin-top:18px;padding:10px 24px;background:#6D28D9;color:#fff!important;text-decoration:none;border-radius:10px;font-size:13px;font-weight:600}
    .footer{background:#F4F2EE;padding:20px 40px;text-align:center}
    .footer p{font-size:12px;color:#bbb;margin-top:3px}
  </style></head>
  <body><div class="wrap">${body}</div></body></html>`;
}

// ─── Auto-reply ───────────────────────────────────────────────────────────────
function autoReplyHtml({ name, formType }) {
  const label =
    formType === "events"
      ? "Events Inquiry"
      : formType === "booking"
        ? "Booking Request"
        : "Message";
  const eta =
    formType === "booking" ? "3 – 5 business days" : "1 – 2 business days";
  return baseHtml(`
    <div class="header">
      <p class="eyebrow">✦ Nii Kwei Ministries</p>
      <h1>We received your ${label}!</h1>
      <p>Thank you for reaching out, ${name}.</p>
      <div class="badge">${label}</div>
    </div>
    <div class="body">
      <div class="info">
        <p>Thank you for contacting Nii Kwei Ministries. We have received your ${label.toLowerCase()} and our team will get back to you within <strong>${eta}</strong>.<br/><br/>Follow us on social media for the latest updates, events, and music releases.</p>
      </div>
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Accra, Ghana</p>
      <p>Please do not reply to this automated email.</p>
    </div>`);
}

// ─── Admin: general ───────────────────────────────────────────────────────────
function generalAdminHtml(d) {
  return baseHtml(`
    <div class="header">
      <p class="eyebrow">New Message</p><h1>General Inquiry</h1>
      <p>Received via the contact form.</p>
      <div class="badge">General</div>
    </div>
    <div class="body">
      <p class="label">Sender</p>
      <div class="row"><span class="rl">Name</span><span class="rv">${d.name}</span></div>
      <div class="row"><span class="rl">Email</span><span class="rv">${d.email}</span></div>
      ${d.phone ? `<div class="row"><span class="rl">Phone</span><span class="rv">${d.phone}</span></div>` : ""}
      ${d.subject ? `<div class="row"><span class="rl">Subject</span><span class="rv">${d.subject}</span></div>` : ""}
      <div class="msg"><p>${d.message}</p></div>
      <a href="${BASE_URL}/admin" class="dash-btn">Open Dashboard →</a>
    </div>
    <div class="footer"><p>Nii Kwei Ministries · Internal</p><p>Reply to: ${d.email}</p></div>`);
}

// ─── Admin: events ────────────────────────────────────────────────────────────
function eventsAdminHtml(d) {
  const rows = [
    ["Name", d.name],
    ["Email", d.email],
    d.phone && ["Phone", d.phone],
    d.organisation && ["Organisation", d.organisation],
    d.event_name && ["Event Name", d.event_name],
    d.event_date && ["Event Date", d.event_date],
    d.venue && ["Venue", d.venue],
    d.attendance && ["Attendance", d.attendance],
  ].filter(Boolean);
  return baseHtml(`
    <div class="header">
      <p class="eyebrow">New Inquiry</p><h1>Events Inquiry</h1>
      <p>A new events inquiry has been submitted.</p>
      <div class="badge">Events</div>
    </div>
    <div class="body">
      <p class="label">Details</p>
      ${rows.map(([l, v]) => `<div class="row"><span class="rl">${l}</span><span class="rv">${v}</span></div>`).join("")}
      ${d.message ? `<div class="msg"><p>${d.message}</p></div>` : ""}
      <a href="${BASE_URL}/admin" class="dash-btn">Open Dashboard →</a>
    </div>
    <div class="footer"><p>Nii Kwei Ministries · Internal</p><p>Reply to: ${d.email}</p></div>`);
}

// ─── Admin: booking ───────────────────────────────────────────────────────────
function bookingAdminHtml(d) {
  const rows = [
    ["Name", d.name],
    ["Email", d.email],
    d.phone && ["Phone", d.phone],
    d.organisation && ["Organisation", d.organisation],
    d.program_type && ["Program Type", d.program_type],
    d.preferred_date && ["Preferred Date", d.preferred_date],
    d.alternate_date && ["Alternate Date", d.alternate_date],
    d.venue && ["Location", d.venue],
  ].filter(Boolean);
  return baseHtml(`
    <div class="header">
      <p class="eyebrow">New Request</p><h1>Booking Request</h1>
      <p>A booking request has been submitted.</p>
      <div class="badge">Booking</div>
    </div>
    <div class="body">
      <p class="label">Request Details</p>
      ${rows.map(([l, v]) => `<div class="row"><span class="rl">${l}</span><span class="rv">${v}</span></div>`).join("")}
      ${d.message ? `<div class="msg"><p>${d.message}</p></div>` : ""}
      <a href="${BASE_URL}/admin" class="dash-btn">Open Dashboard →</a>
    </div>
    <div class="footer"><p>Nii Kwei Ministries · Internal</p><p>Reply to: ${d.email}</p></div>`);
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function sendContactEmail(formType, data) {
  const transporter = createTransport();
  const admins = adminEmails();
  const labelMap = {
    general: "General Inquiry",
    events: "Events Inquiry",
    booking: "Booking Request",
  };
  const label = labelMap[formType] ?? "Contact";
  const extra =
    formType === "events"
      ? data.event_name
        ? ` — ${data.event_name}`
        : ""
      : formType === "booking"
        ? data.program_type
          ? ` — ${data.program_type}`
          : ""
        : data.subject
          ? ` — ${data.subject}`
          : "";

  const adminHtml =
    formType === "events"
      ? eventsAdminHtml(data)
      : formType === "booking"
        ? bookingAdminHtml(data)
        : generalAdminHtml(data);

  const jobs = [
    transporter.sendMail({
      from: FROM,
      to: data.email,
      subject: `We received your ${label} — Nii Kwei Ministries`,
      html: autoReplyHtml({ name: data.name, formType }),
    }),
  ];

  if (admins.length > 0) {
    jobs.push(
      transporter.sendMail({
        from: FROM,
        to: admins.join(", "),
        replyTo: data.email,
        subject: `New ${label} from ${data.name}${extra}`,
        html: adminHtml,
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r, i) => {
    if (r.status === "rejected")
      console.error(
        `[sendContactEmail] ${i === 0 ? "Auto-reply" : "Admin"} failed:`,
        r.reason,
      );
    else
      console.log(
        `[sendContactEmail] ${i === 0 ? "Auto-reply" : "Admin"} sent:`,
        r.value.messageId,
      );
  });
  return results;
}
