"use client";

import Call from "@/public/Call.png";
import Clock from "@/public/Clock.png";
import Hero from "@/public/ContactBack.png";
import Email from "@/public/Email.png";
import Hero2 from "@/public/mobile-contact.png";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "general",
    label: "General",
    description: "Prayer requests, general inquiries, or just say hello.",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
  },
  {
    id: "events",
    label: "Events",
    description: "Inquire about attending or partnering with our events.",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
        />
      </svg>
    ),
  },
  {
    id: "booking",
    label: "Booking",
    description: "Book Minister Nii Kwei for your program or ministry.",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
];

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm " +
  "placeholder:text-white/30 outline-none focus:border-violet-500 focus:bg-white/8 " +
  "focus:ring-2 focus:ring-violet-500/20 transition-all duration-200";

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/40">
      {label}
      {required && <span className="text-violet-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

// ─── Contact info ─────────────────────────────────────────────────────────────
const INFO = [
  { icon: Call, alt: "Phone", value: "+233 201 964 639  ·  +233 558 861 040" },
  { icon: Email, alt: "Email", value: "info@niikweiministries.com" },
  { icon: Clock, alt: "Hours", value: "Monday – Friday, 9:00 AM – 5:00 PM" },
];

const EMPTY = { name: "", email: "", phone: "", message: "" };

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-linear", once: false });
  }, []);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setFormData(EMPTY);
  };
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: activeTab, ...formData }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to send. Please try again.");
        return;
      }
      toast.success("Message sent! We'll be in touch soon.");
      setFormData(EMPTY);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeTabConfig = TABS.find((t) => t.id === activeTab);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* ── Hero ── */}
      <div className="h-[60vh] lg:h-[70vh] relative flex items-end overflow-hidden">
        <Image
          placeholder="blur"
          src={Hero}
          alt="Contact hero"
          fill
          className="object-cover max-lg:hidden"
        />
        <Image
          placeholder="blur"
          src={Hero2}
          alt="Contact hero"
          fill
          className="object-cover lg:hidden"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div
          className="relative z-10 w-full px-6 lg:px-20 pb-16"
          data-aos="fade-right"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-violet-400 mb-3">
            Nii Kwei Ministries
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold relative pb-3 mb-4 w-fit">
            Contact Us
            <span className="absolute left-0 bottom-0 w-1/2 h-1 bg-violet-500 rounded-full" />
          </h1>
          <p className="text-sm lg:text-base text-white/60 max-w-lg">
            Reach out for inquiries, prayer requests, event partnerships, or to
            book Minister Nii Kwei.
          </p>
        </div>
      </div>

      {/* ── Form section ── */}
      <div className="relative py-20 px-6 lg:px-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Tab switcher */}
          <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={[
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5",
                ].join(" ")}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab heading */}
          <div className="mb-8" data-aos="fade-up">
            <h2 className="text-2xl font-semibold text-white mb-1">
              {activeTab === "general" && "Send Us a Message"}
              {activeTab === "events" && "Event Inquiry"}
              {activeTab === "booking" && "Book Minister Nii Kwei"}
            </h2>
            <p className="text-sm text-white/40">
              {activeTabConfig.description}
            </p>
            <div className="w-12 h-0.5 bg-violet-500 mt-3 rounded-full" />
          </div>

          {/* Form card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 lg:p-9"
          >
            {/* ── GENERAL ── */}
            {activeTab === "general" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </Field>
                <Field label="Email Address" required>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </Field>
                <Field label="Phone Number">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+233 20 000 0000"
                    className={inputCls}
                  />
                </Field>
                <Field label="Subject">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject ?? ""}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className={inputCls}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Message" required>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={5}
                      className={inputCls + " resize-none"}
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* ── EVENTS ── */}
            {activeTab === "events" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </Field>
                <Field label="Email Address" required>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </Field>
                <Field label="Phone Number" required>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+233 20 000 0000"
                    className={inputCls}
                  />
                </Field>
                <Field label="Organisation / Church">
                  <input
                    type="text"
                    name="organisation"
                    value={formData.organisation ?? ""}
                    onChange={handleChange}
                    placeholder="Your church or organisation"
                    className={inputCls}
                  />
                </Field>
                <Field label="Event Name" required>
                  <input
                    type="text"
                    name="event_name"
                    value={formData.event_name ?? ""}
                    onChange={handleChange}
                    placeholder="Name of the event"
                    className={inputCls}
                  />
                </Field>
                <Field label="Expected Date">
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date ?? ""}
                    onChange={handleChange}
                    className={inputCls + " [color-scheme:dark]"}
                  />
                </Field>
                <Field label="Event Venue">
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue ?? ""}
                    onChange={handleChange}
                    placeholder="Event location or city"
                    className={inputCls}
                  />
                </Field>
                <Field label="Expected Attendance">
                  <select
                    name="attendance"
                    value={formData.attendance ?? ""}
                    onChange={handleChange}
                    className={inputCls + " [color-scheme:dark]"}
                  >
                    <option value="" disabled>
                      Select range
                    </option>
                    {[
                      "Under 50",
                      "50 – 200",
                      "200 – 500",
                      "500 – 1,000",
                      "1,000+",
                    ].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Additional Details">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about the event, theme, or how we can participate…"
                      rows={4}
                      className={inputCls + " resize-none"}
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* ── BOOKING ── */}
            {activeTab === "booking" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </Field>
                <Field label="Email Address" required>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </Field>
                <Field label="Phone Number" required>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+233 20 000 0000"
                    className={inputCls}
                  />
                </Field>
                <Field label="Organisation / Church">
                  <input
                    type="text"
                    name="organisation"
                    value={formData.organisation ?? ""}
                    onChange={handleChange}
                    placeholder="Your church or organisation"
                    className={inputCls}
                  />
                </Field>
                <Field label="Type of Program" required>
                  <select
                    name="program_type"
                    value={formData.program_type ?? ""}
                    onChange={handleChange}
                    className={inputCls + " [color-scheme:dark]"}
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    {[
                      "Church Service",
                      "Concert / Worship Night",
                      "Conference / Summit",
                      "Youth Program",
                      "Crusade / Outreach",
                      "Recording Session",
                      "Other",
                    ].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Preferred Date">
                  <input
                    type="date"
                    name="preferred_date"
                    value={formData.preferred_date ?? ""}
                    onChange={handleChange}
                    className={inputCls + " [color-scheme:dark]"}
                  />
                </Field>
                <Field label="Alternate Date">
                  <input
                    type="date"
                    name="alternate_date"
                    value={formData.alternate_date ?? ""}
                    onChange={handleChange}
                    className={inputCls + " [color-scheme:dark]"}
                  />
                </Field>
                <Field label="Program Location">
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue ?? ""}
                    onChange={handleChange}
                    placeholder="City or venue name"
                    className={inputCls}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Program Description" required>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe the program, expected audience, and any special requirements…"
                      rows={4}
                      className={inputCls + " resize-none"}
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* Submit bar */}
            <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-white/8">
              <p className="text-xs text-white/25">
                Fields marked <span className="text-violet-400">*</span> are
                required
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2.5 px-8 py-3 bg-button hover:opacity-90 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Contact info cards ── */}
      <div className="pb-20 px-6 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-2" data-aos="fade-up">
            Contact Information
          </h2>
          <div className="w-12 h-0.5 bg-violet-500 rounded-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {INFO.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-xl p-5 hover:border-violet-500/30 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                  <Image
                    placeholder="blur"
                    src={item.icon}
                    alt={item.alt}
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-white/30 mb-1">
                    {item.alt}
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
