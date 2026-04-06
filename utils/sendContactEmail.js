// utils/sendContactEmail.js
// Server-side only. Same SMTP env vars as sendDonationEmails.js

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
    .cta-btn{display:inline-block;margin-top:18px;padding:11px 26px;background:#6D28D9;color:#fff!important;text-decoration:none;border-radius:10px;font-size:13px;font-weight:700}
    .footer{background:#F8F7F5;padding:20px 40px;text-align:center;border-top:1px solid #F3F4F6}
    .footer p{font-size:11.5px;color:#9CA3AF;margin-top:3px}
    .footer a{color:#7C3AED;text-decoration:none}
  </style></head>
  <body><div class="wrap">${body}</div></body></html>`;
}

// ─── Auto-reply to submitter ──────────────────────────────────────────────────
function autoReplyHtml({ name, formType }) {
  const label =
    formType === "events"
      ? "Events Inquiry"
      : formType === "booking"
        ? "Booking Request"
        : "Message";
  const eta =
    formType === "booking" ? "3 – 5 business days" : "1 – 2 business days";

  return shell(`
    <div class="header">
      <p class="eyebrow">✦ Nii Kwei Ministries</p>
      <h1>We received your ${label}!</h1>
      <p>Thank you for reaching out, ${name}.</p>
      <div class="badge">${label}</div>
    </div>
    <div class="body">
      <div class="note-box">
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
  return shell(`
    <div class="header">
      <p class="eyebrow">New Message</p>
      <h1>General Inquiry</h1>
      <p>Received via the contact form.</p>
      <div class="badge">General</div>
    </div>
    <div class="body">
      <p class="section-label">Sender</p>
      <div class="row"><span class="rl">Name</span><span class="rv">${d.name}</span></div>
      <div class="row"><span class="rl">Email</span><span class="rv">${d.email}</span></div>
      ${d.phone ? `<div class="row"><span class="rl">Phone</span><span class="rv">${d.phone}</span></div>` : ""}
      ${d.subject ? `<div class="row"><span class="rl">Subject</span><span class="rv">${d.subject}</span></div>` : ""}
      <div class="message-box"><p>${d.message}</p></div>
      <a href="${BASE_URL}/admin" class="cta-btn">Open Dashboard →</a>
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Internal</p>
      <p>Reply to: <a href="mailto:${d.email}">${d.email}</a></p>
    </div>`);
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

  return shell(`
    <div class="header">
      <p class="eyebrow">New Inquiry</p>
      <h1>Events Inquiry</h1>
      <p>A new events inquiry has been submitted.</p>
      <div class="badge">Events</div>
    </div>
    <div class="body">
      <p class="section-label">Details</p>
      ${rows.map(([l, v]) => `<div class="row"><span class="rl">${l}</span><span class="rv">${v}</span></div>`).join("")}
      ${d.message ? `<div class="message-box"><p>${d.message}</p></div>` : ""}
      <a href="${BASE_URL}/admin" class="cta-btn">Open Dashboard →</a>
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Internal</p>
      <p>Reply to: <a href="mailto:${d.email}">${d.email}</a></p>
    </div>`);
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

  return shell(`
    <div class="header">
      <p class="eyebrow">New Request</p>
      <h1>Booking Request</h1>
      <p>A booking request has been submitted.</p>
      <div class="badge">Booking</div>
    </div>
    <div class="body">
      <p class="section-label">Request Details</p>
      ${rows.map(([l, v]) => `<div class="row"><span class="rl">${l}</span><span class="rv">${v}</span></div>`).join("")}
      ${d.message ? `<div class="message-box"><p>${d.message}</p></div>` : ""}
      <a href="${BASE_URL}/admin" class="cta-btn">Open Dashboard →</a>
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Internal</p>
      <p>Reply to: <a href="mailto:${d.email}">${d.email}</a></p>
    </div>`);
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
