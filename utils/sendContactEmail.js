// utils/sendContactEmail.js
// Server-side only. Reuses the same SMTP transport as sendDonationEmails.js
//
// Env vars (already set for donations — nothing new needed):
//   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
//   FROM_NAME, ADMIN_EMAIL

import nodemailer from "nodemailer";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = `${process.env.FROM_NAME ?? "Nii Kwei Ministries"} <${process.env.SMTP_USER}>`;

const adminEmails = () =>
  (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

// ─── Shared HTML shell ────────────────────────────────────────────────────────
function baseHtml(body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #F4F2EE; font-family: Helvetica, Arial, sans-serif; }
    .wrap { max-width: 580px; margin: 40px auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.10); }
    .header { background: #0D0D12; padding: 36px 40px; text-align: center; }
    .eyebrow { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #8B5CF6; font-weight: 600; margin-bottom: 10px; }
    .header h1 { font-size: 24px; font-weight: 700; color: #fff; font-family: Georgia, serif; line-height: 1.3; }
    .header p  { font-size: 13px; color: rgba(255,255,255,.5); margin-top: 6px; }
    .badge { display: inline-block; margin: 20px auto 0; padding: 6px 18px; border-radius: 50px; border: 1.5px solid rgba(139,92,246,.4); background: rgba(139,92,246,.12); font-size: 12px; font-weight: 600; color: #A78BFA; letter-spacing: 1px; text-transform: uppercase; }
    .body { padding: 32px 40px; }
    .section-label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #aaa; margin-bottom: 14px; }
    .row { display: flex; justify-content: space-between; align-items: flex-start; padding: 11px 0; border-bottom: 1px solid #f0f0f0; }
    .row:last-child { border-bottom: none; }
    .row-label { font-size: 12.5px; color: #999; min-width: 120px; }
    .row-value { font-size: 13.5px; font-weight: 600; color: #0D0D12; text-align: right; max-width: 65%; }
    .message-box { margin-top: 20px; background: #FAFAF8; border-left: 3px solid #7C3AED; border-radius: 0 8px 8px 0; padding: 16px 20px; }
    .message-box p { font-size: 14px; color: #444; line-height: 1.75; white-space: pre-wrap; }
    .auto-reply { background: rgba(139,92,246,.06); border: 1px solid rgba(139,92,246,.15); border-radius: 10px; padding: 16px 20px; margin-top: 20px; }
    .auto-reply p { font-size: 13px; color: #555; line-height: 1.7; }
    .footer { background: #F4F2EE; padding: 22px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #bbb; margin-top: 3px; }
  </style>
</head>
<body><div class="wrap">${body}</div></body>
</html>`;
}

// ─── Auto-reply sent to the person who submitted ──────────────────────────────
function autoReplyHtml({ name, formType }) {
  const typeLabel =
    formType === "events"
      ? "Events Inquiry"
      : formType === "booking"
        ? "Booking Request"
        : "Message";
  const turnaround =
    formType === "booking" ? "3 – 5 business days" : "1 – 2 business days";

  return baseHtml(`
    <div class="header">
      <p class="eyebrow">✦ Nii Kwei Ministries</p>
      <h1>We've received your ${typeLabel}!</h1>
      <p>Thank you for reaching out, ${name}.</p>
      <div class="badge">${typeLabel}</div>
    </div>
    <div class="body">
      <div class="auto-reply">
        <p>
          Thank you for contacting Nii Kwei Ministries. We have received your ${typeLabel.toLowerCase()}
          and our team will review it and get back to you within <strong>${turnaround}</strong>.
          <br /><br />
          In the meantime, feel free to follow us on social media for the latest updates, events, and music releases.
        </p>
      </div>
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Accra, Ghana</p>
      <p>Please do not reply to this automated email.</p>
    </div>
  `);
}

// ─── Admin notification: General ─────────────────────────────────────────────
function generalAdminHtml({ name, email, phone, subject, message }) {
  const phoneRow = phone
    ? `<div class="row"><span class="row-label">Phone</span><span class="row-value">${phone}</span></div>`
    : "";
  const subjectRow = subject
    ? `<div class="row"><span class="row-label">Subject</span><span class="row-value">${subject}</span></div>`
    : "";

  return baseHtml(`
    <div class="header">
      <p class="eyebrow">New Message</p>
      <h1>General Inquiry</h1>
      <p>Someone has sent a message via the contact form.</p>
      <div class="badge">General</div>
    </div>
    <div class="body">
      <p class="section-label">Sender Details</p>
      <div class="row"><span class="row-label">Name</span><span class="row-value">${name}</span></div>
      <div class="row"><span class="row-label">Email</span><span class="row-value">${email}</span></div>
      ${phoneRow}
      ${subjectRow}
      <div class="message-box"><p>${message}</p></div>
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Internal Notification</p>
      <p>Reply directly to ${email}</p>
    </div>
  `);
}

// ─── Admin notification: Events ──────────────────────────────────────────────
function eventsAdminHtml({
  name,
  email,
  phone,
  organisation,
  event_name,
  event_date,
  venue,
  attendance,
  message,
}) {
  const rows = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    phone && { label: "Phone", value: phone },
    organisation && { label: "Organisation", value: organisation },
    event_name && { label: "Event Name", value: event_name },
    event_date && { label: "Event Date", value: event_date },
    venue && { label: "Venue", value: venue },
    attendance && { label: "Attendance", value: attendance },
  ].filter(Boolean);

  return baseHtml(`
    <div class="header">
      <p class="eyebrow">New Inquiry</p>
      <h1>Events Inquiry</h1>
      <p>An event inquiry has been submitted.</p>
      <div class="badge">Events</div>
    </div>
    <div class="body">
      <p class="section-label">Inquiry Details</p>
      ${rows.map((r) => `<div class="row"><span class="row-label">${r.label}</span><span class="row-value">${r.value}</span></div>`).join("")}
      ${message ? `<div class="message-box"><p>${message}</p></div>` : ""}
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Internal Notification</p>
      <p>Reply directly to ${email}</p>
    </div>
  `);
}

// ─── Admin notification: Booking ─────────────────────────────────────────────
function bookingAdminHtml({
  name,
  email,
  phone,
  organisation,
  program_type,
  preferred_date,
  alternate_date,
  venue,
  message,
}) {
  const rows = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    phone && { label: "Phone", value: phone },
    organisation && { label: "Organisation", value: organisation },
    program_type && { label: "Program Type", value: program_type },
    preferred_date && { label: "Preferred Date", value: preferred_date },
    alternate_date && { label: "Alternate Date", value: alternate_date },
    venue && { label: "Location", value: venue },
  ].filter(Boolean);

  return baseHtml(`
    <div class="header">
      <p class="eyebrow">New Request</p>
      <h1>Booking Request</h1>
      <p>A booking request has been submitted.</p>
      <div class="badge">Booking</div>
    </div>
    <div class="body">
      <p class="section-label">Request Details</p>
      ${rows.map((r) => `<div class="row"><span class="row-label">${r.label}</span><span class="row-value">${r.value}</span></div>`).join("")}
      ${message ? `<div class="message-box"><p>${message}</p></div>` : ""}
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Internal Notification</p>
      <p>Reply directly to ${email}</p>
    </div>
  `);
}

// ─── Public API ───────────────────────────────────────────────────────────────
/**
 * Send auto-reply to submitter + admin notification.
 *
 * @param {"general"|"events"|"booking"} formType
 * @param {object} data  — form fields
 */
export async function sendContactEmail(formType, data) {
  const transporter = createTransport();
  const admins = adminEmails();

  const typeLabels = {
    general: "General Inquiry",
    events: "Events Inquiry",
    booking: "Booking Request",
  };
  const label = typeLabels[formType] ?? "Contact Form";

  // Pick the right admin template
  const adminHtml =
    formType === "events"
      ? eventsAdminHtml(data)
      : formType === "booking"
        ? bookingAdminHtml(data)
        : generalAdminHtml(data);

  const jobs = [
    // 1. Auto-reply to the submitter
    transporter.sendMail({
      from: FROM,
      to: data.email,
      subject: `We received your ${label} — Nii Kwei Ministries`,
      html: autoReplyHtml({ name: data.name, formType }),
    }),
  ];

  // 2. Admin notification
  if (admins.length > 0) {
    const subjectExtra =
      formType === "events"
        ? ` — ${data.event_name ?? ""}`
        : formType === "booking"
          ? ` — ${data.program_type ?? ""}`
          : data.subject
            ? ` — ${data.subject}`
            : "";

    jobs.push(
      transporter.sendMail({
        from: FROM,
        to: admins.join(", "),
        replyTo: data.email,
        subject: `New ${label} from ${data.name}${subjectExtra}`,
        html: adminHtml,
      }),
    );
  }

  const results = await Promise.allSettled(jobs);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `[sendContactEmail] ${i === 0 ? "Auto-reply" : "Admin"} failed:`,
        r.reason,
      );
    } else {
      console.log(
        `[sendContactEmail] ${i === 0 ? "Auto-reply" : "Admin"} sent:`,
        r.value.messageId,
      );
    }
  });

  return results;
}
