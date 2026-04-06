"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Logo from "@/public/logo.png";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

const SOCIALS = [
  {
    href: "https://www.facebook.com/freyblanks?mibextid=rS40aB7S9Ucbxw6v",
    icon: <FaFacebook />,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/niikweiworld?igsh=YzljYTk1ODg3Zg==",
    icon: <FaInstagram />,
    label: "Instagram",
  },
  {
    href: "https://www.tiktok.com/t/ZT2M4dfXa/",
    icon: <FaTiktok />,
    label: "TikTok",
  },
  { href: "https://www.linkedin.com", icon: <FaLinkedin />, label: "LinkedIn" },
  {
    href: "https://youtube.com/@niikweimusic?si=nRaE4IrDUBmcnmXF",
    icon: <FaYoutube />,
    label: "YouTube",
  },
];

const LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Shop Now", href: "/store" },
  { label: "Contact Us", href: "/contact" },
  { label: "Donate Now", href: "/donation" },
  { label: "Join Us", href: "/volunteer" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Something went wrong.");
        return;
      }
      setSubscribed(true);
      setEmail("");
      toast.success("You're subscribed! Check your inbox.");
    } catch {
      toast.error("Could not subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* ── Top band ── */}
      <div className="px-6 lg:px-16 pt-14 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-lg:gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Image src={Logo} alt="Nii Kwei Ministries" className="w-20" />
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Transforming lives through worship, discipleship, and outreach.
              Building a Christ-centered legacy for generations.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              {SOCIALS.map(({ href, icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center
                             text-gray-400 hover:text-violet-400 hover:bg-violet-500/15 hover:border-violet-500/25
                             transition-all duration-200 text-base"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[2.5px] text-violet-400">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-violet-500/50 group-hover:bg-violet-400 transition-colors shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[2.5px] text-violet-400">
              Newsletter
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Join our newsletter for upcoming events, worship releases,
              devotionals, and ways to partner with us.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-green-400 font-medium">
                  You're subscribed! Check your inbox.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    placeholder="your@email.com"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white
                               placeholder:text-gray-500 outline-none focus:border-violet-500 focus:ring-2
                               focus:ring-violet-500/20 transition-all disabled:opacity-50"
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="px-4 py-2.5 bg-button hover:opacity-90 disabled:opacity-50 text-white
                               font-semibold text-sm rounded-xl transition-all duration-200 shrink-0
                               flex items-center gap-2 shadow-md hover:shadow-violet-900/30"
                  >
                    {loading ? (
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
                    ) : (
                      "Join"
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  By subscribing, you agree to our Privacy Policy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/8 mx-6 lg:mx-16" />

      {/* ── Bottom bar ── */}
      <div className="px-6 lg:px-16 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Nii Kwei Ministries. All Rights
          Reserved.
        </p>
        <div className="flex items-center gap-5 text-xs text-gray-500">
          <span className="hover:text-gray-300 cursor-pointer transition-colors">
            Privacy Policy
          </span>
          <span className="hover:text-gray-300 cursor-pointer transition-colors">
            Terms of Service
          </span>
          <span className="hover:text-gray-300 cursor-pointer transition-colors">
            Cookie Settings
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
