// app/api/newsletter/route.js
import { addSubscriber } from "@/lib/store";
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

function shell(body) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#F8F7F5;font-family:Helvetica,Arial,sans-serif}
    .wrap{max-width:540px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee;box-shadow:0 2px 16px rgba(0,0,0,.06)}
    .header{background:#6D28D9;padding:32px 40px;text-align:center}
    .eyebrow{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.7);font-weight:600;margin-bottom:8px}
    .header h1{font-size:22px;font-weight:700;color:#fff;font-family:Georgia,serif}
    .header p{font-size:13px;color:rgba(255,255,255,.65);margin-top:5px}
    .body{padding:28px 40px}
    .note-box{background:#F5F0FF;border:1px solid #E4D4FF;border-radius:10px;padding:14px 18px;margin-top:4px}
    .note-box p{font-size:13px;color:#5B21B6;line-height:1.75}
    .list{list-style:none;margin:14px 0 0;display:flex;flex-direction:column;gap:8px}
    .list li{font-size:13px;color:#374151;padding-left:18px;position:relative}
    .list li::before{content:"✦";position:absolute;left:0;color:#7C3AED;font-size:10px;top:2px}
    .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F3F4F6}
    .row:last-child{border-bottom:none}
    .rl{font-size:12.5px;color:#6B7280}
    .rv{font-size:13px;font-weight:600;color:#111827}
    .cta-btn{display:inline-block;margin-top:18px;padding:11px 26px;background:#6D28D9;color:#fff!important;text-decoration:none;border-radius:10px;font-size:13px;font-weight:700}
    .footer{background:#F8F7F5;padding:18px 40px;text-align:center;border-top:1px solid #F3F4F6}
    .footer p{font-size:11.5px;color:#9CA3AF;margin-top:3px}
    .footer a{color:#7C3AED;text-decoration:none}
  </style></head>
  <body><div class="wrap">${body}</div></body></html>`;
}

function welcomeHtml(email) {
  return shell(`
    <div class="header">
      <p class="eyebrow">✦ Nii Kwei Ministries</p>
      <h1>You're on the list!</h1>
      <p>Welcome to the Nii Kwei Ministries newsletter.</p>
    </div>
    <div class="body">
      <div class="note-box">
        <p>Thank you for subscribing! Here's what you can look forward to:</p>
        <ul class="list">
          <li>Upcoming events and worship nights</li>
          <li>New music and worship releases</li>
          <li>Devotionals and spiritual encouragement</li>
          <li>Ways to partner and give</li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Accra, Ghana</p>
      <p style="margin-top:6px">You subscribed with ${email}. <a href="${BASE_URL}/unsubscribe">Unsubscribe</a></p>
    </div>`);
}

function adminNotifyHtml(email) {
  return shell(`
    <div class="header">
      <p class="eyebrow">New Subscriber</p>
      <h1>Newsletter Subscription</h1>
      <p>Someone just joined the mailing list.</p>
    </div>
    <div class="body">
      <div class="row"><span class="rl">Email</span><span class="rv">${email}</span></div>
      <div class="row"><span class="rl">Date</span><span class="rv">${new Date().toLocaleDateString("en-GH", { day: "numeric", month: "long", year: "numeric" })}</span></div>
      <a href="${BASE_URL}/admin" class="cta-btn">View in Dashboard →</a>
    </div>
    <div class="footer"><p>Nii Kwei Ministries · Internal</p></div>`);
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const result = addSubscriber(email);

    if (result.duplicate) {
      return Response.json(
        { error: "You're already subscribed!" },
        { status: 409 },
      );
    }

    // Fire emails non-blocking
    (async () => {
      try {
        const transporter = createTransport();
        const admins = (process.env.ADMIN_EMAIL ?? "")
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
        await Promise.allSettled(
          [
            transporter.sendMail({
              from: FROM,
              to: email,
              subject: "Welcome to Nii Kwei Ministries Newsletter! ✦",
              html: welcomeHtml(email),
            }),
            admins.length > 0 &&
              transporter.sendMail({
                from: FROM,
                to: admins.join(", "),
                subject: `New Subscriber: ${email}`,
                html: adminNotifyHtml(email),
              }),
          ].filter(Boolean),
        );
      } catch (err) {
        console.error("[newsletter] Email error:", err.message);
      }
    })();

    return Response.json({ success: true, count: result.count });
  } catch (err) {
    console.error("[newsletter] Error:", err.message);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
