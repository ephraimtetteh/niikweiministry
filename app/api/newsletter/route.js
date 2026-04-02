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

function welcomeHtml(email) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#F4F2EE;font-family:Helvetica,Arial,sans-serif}
    .wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10)}
    .header{background:#0D0D12;padding:36px 40px;text-align:center}
    .eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8B5CF6;font-weight:600;margin-bottom:10px}
    .header h1{font-size:24px;font-weight:700;color:#fff;font-family:Georgia,serif}
    .header p{font-size:13px;color:rgba(255,255,255,.5);margin-top:6px}
    .body{padding:32px 40px}
    .body p{font-size:14px;color:#555;line-height:1.75;margin-bottom:14px}
    .list{padding-left:0;list-style:none;display:flex;flex-direction:column;gap:8px;margin:16px 0}
    .list li{font-size:13.5px;color:#444;padding-left:20px;position:relative}
    .list li::before{content:"✦";position:absolute;left:0;color:#7C3AED;font-size:11px;top:2px}
    .footer{background:#F4F2EE;padding:20px 40px;text-align:center}
    .footer p{font-size:12px;color:#bbb;margin-top:3px}
  </style></head>
  <body><div class="wrap">
    <div class="header">
      <p class="eyebrow">✦ Nii Kwei Ministries</p>
      <h1>You're on the list!</h1>
      <p>Welcome to the Nii Kwei Ministries newsletter.</p>
    </div>
    <div class="body">
      <p>Thank you for subscribing! Here's what you can look forward to:</p>
      <ul class="list">
        <li>Upcoming events and worship nights</li>
        <li>New music and worship releases</li>
        <li>Devotionals and spiritual encouragement</li>
        <li>Ways to partner and give</li>
      </ul>
      <p>We're glad to have you as part of our community. Stay connected and be blessed!</p>
    </div>
    <div class="footer">
      <p>Nii Kwei Ministries · Accra, Ghana</p>
      <p>You subscribed with ${email}. <a href="${BASE_URL}/unsubscribe" style="color:#7C3AED">Unsubscribe</a></p>
    </div>
  </div></body></html>`;
}

function adminNotifyHtml(email) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#F4F2EE;font-family:Helvetica,Arial,sans-serif}
    .wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10)}
    .header{background:#0D0D12;padding:28px 40px}
    .eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8B5CF6;font-weight:600;margin-bottom:8px}
    .header h1{font-size:20px;font-weight:700;color:#fff;font-family:Georgia,serif}
    .body{padding:24px 40px}
    .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0}
    .rl{font-size:12.5px;color:#999}
    .rv{font-size:13px;font-weight:600;color:#0D0D12}
    .dash-btn{display:inline-block;margin-top:16px;padding:10px 24px;background:#6D28D9;color:#fff!important;text-decoration:none;border-radius:10px;font-size:13px;font-weight:600}
    .footer{background:#F4F2EE;padding:16px 40px;text-align:center}
    .footer p{font-size:12px;color:#bbb}
  </style></head>
  <body><div class="wrap">
    <div class="header">
      <p class="eyebrow">New Subscriber</p>
      <h1>Newsletter Subscription</h1>
    </div>
    <div class="body">
      <div class="row"><span class="rl">Email</span><span class="rv">${email}</span></div>
      <div class="row"><span class="rl">Date</span><span class="rv">${new Date().toLocaleDateString("en-GH", { day: "numeric", month: "long", year: "numeric" })}</span></div>
      <a href="${BASE_URL}/admin" class="dash-btn">View in Dashboard →</a>
    </div>
    <div class="footer"><p>Nii Kwei Ministries · Internal</p></div>
  </div></body></html>`;
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

    // Save to store
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
        const adminEmails = (process.env.ADMIN_EMAIL ?? "")
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);

        await Promise.allSettled(
          [
            transporter.sendMail({
              from: FROM,
              to: email,
              subject: "Welcome to Nii Kwei Ministries Newsletter!",
              html: welcomeHtml(email),
            }),
            adminEmails.length > 0 &&
              transporter.sendMail({
                from: FROM,
                to: adminEmails.join(", "),
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
