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
        toast.error(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubscribed(true);
      setEmail("");
      toast.success("You're subscribed! Check your inbox for a welcome email.");
    } catch {
      toast.error("Could not subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white w-full px-6 lg:px-16">
      <div className="lg:grid flex flex-wrap lg:grid-cols-3 max-lg:gap-6 pt-10 pb-24">
        {/* Logo */}
        <Image src={Logo} alt="logo" className="max-lg:w-20" />

        {/* Quick links */}
        <div className="flex flex-col gap-3">
          <h1 className="text-purple-500 text-xl font-semibold">Quick Links</h1>
          <ul className="flex flex-col gap-4 max-lg:text-sm">
            <Link href="/about">About Us</Link>
            <Link href="/store">Shop Now</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/donation">Donate Now</Link>
            <Link href="/volunteer">Join Us</Link>
          </ul>
        </div>

        {/* Subscribe */}
        <div className="flex flex-col gap-3 max-lg:text-sm">
          <h1 className="text-purple-500 text-xl font-semibold">Subscribe</h1>
          <p className="text-white/70 leading-relaxed">
            Join our newsletter to receive updates on upcoming events, worship
            releases, devotionals, and ways to partner with us.
          </p>

          {subscribed ? (
            /* Success state */
            <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/25 rounded-lg px-4 py-3 mt-1">
              <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-violet-400"
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
              <p className="text-sm text-violet-300 font-medium">
                You're subscribed! Check your inbox.
              </p>
            </div>
          ) : (
            /* Input row */
            <div className="flex items-center gap-2 mt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Enter your email"
                disabled={loading}
                className="p-3 w-full border border-button placeholder:text-white/40 bg-transparent rounded-md text-sm outline-none focus:border-violet-400 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="border border-button py-3 px-4 text-button rounded-md hover:bg-violet-500/10 transition-all duration-200 disabled:opacity-50 shrink-0 flex items-center gap-2"
              >
                {loading ? (
                  <svg
                    className="animate-spin w-4 h-4 text-button"
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
                  "Subscribe"
                )}
              </button>
            </div>
          )}

          <p className="text-white/40 text-xs mt-1">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates.
          </p>
        </div>
      </div>

      <hr className="border-white/10" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between pt-3 pb-5 max-lg:gap-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 text-sm text-white/60">
          <p>
            &copy; {new Date().getFullYear()} Nii Kwei Ministries. All Rights
            Reserved.
          </p>
          <div className="flex gap-5 items-center">
            <span className="underline cursor-pointer hover:text-white transition-colors">
              Privacy Policy
            </span>
            <span className="underline cursor-pointer hover:text-white transition-colors">
              Terms of Service
            </span>
            <span className="underline cursor-pointer hover:text-white transition-colors">
              Cookie Settings
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xl text-white/60">
          {[
            {
              href: "https://www.facebook.com/freyblanks?mibextid=rS40aB7S9Ucbxw6v",
              icon: <FaFacebook />,
            },
            {
              href: "https://www.instagram.com/niikweiworld?igsh=YzljYTk1ODg3Zg==",
              icon: <FaInstagram />,
            },
            { href: "https://www.tiktok.com/t/ZT2M4dfXa/", icon: <FaTiktok /> },
            { href: "https://www.linkedin.com", icon: <FaLinkedin /> },
            {
              href: "https://youtube.com/@niikweimusic?si=nRaE4IrDUBmcnmXF",
              icon: <FaYoutube />,
            },
          ].map(({ href, icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-400 hover:scale-110 transition-all duration-200"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
