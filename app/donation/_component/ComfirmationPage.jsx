"use client";

import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/donationUtils";

export default function ConfirmationPage({
  amount,
  donor,
  transactionId,
  date,
  onReset,
}) {
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* ── Success card ── */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {/* Hero section — mimics site's dark overlay hero style */}
        <div className="relative px-8 py-10 text-center overflow-hidden">
          {/* Violet radial glow — matches site's violet-500 accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.25)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-violet-500/60 to-transparent" />

          {/* Check circle */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping opacity-30" />
            <div className="relative w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-violet-400"
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
          </div>

          {/* matches site's violet-500 underline decoration style */}
          <p className="relative text-[11px] font-semibold uppercase tracking-[2px] text-violet-400 mb-3">
            Donation Confirmed
          </p>
          <h1 className="relative text-2xl font-semibold text-white mb-2">
            Thank You{donor ? `, ${donor.split(" ")[0]}` : ""}!
          </h1>
          <p className="relative text-sm text-white/40">
            Your generosity helps us transform lives and spread the Gospel.
          </p>
        </div>

        {/* Amount highlight */}
        <div className="mx-8 mb-6 rounded-xl bg-violet-500/10 border border-violet-500/20 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[2px] text-violet-400/70 mb-0.5">
              Amount Given
            </p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(amount)}
            </p>
          </div>
          <span className="text-violet-400 text-2xl opacity-40">✦</span>
        </div>

        {/* Details table */}
        <div className="mx-8 mb-6 rounded-xl border border-white/8 overflow-hidden">
          {[
            donor && { label: "Donor", value: donor },
            { label: "Transaction ID", value: transactionId, mono: true },
            { label: "Date", value: date },
          ]
            .filter(Boolean)
            .map((row, i, arr) => (
              <div
                key={row.label}
                className={[
                  "flex justify-between items-center px-5 py-3.5",
                  i < arr.length - 1 ? "border-b border-white/6" : "",
                ].join(" ")}
              >
                <span className="text-xs text-white/35 uppercase tracking-[1px]">
                  {row.label}
                </span>
                <span
                  className={[
                    "font-medium text-white text-right max-w-[60%]",
                    row.mono
                      ? "text-[11px] font-mono tracking-wide text-white/70"
                      : "text-sm",
                  ].join(" ")}
                >
                  {row.value}
                </span>
              </div>
            ))}
        </div>

        {/* Note */}
        <p className="text-center text-xs text-white/25 mb-6 px-8">
          A confirmation email has been sent to your inbox.
        </p>

        {/* Actions */}
        <div className="px-8 pb-8 flex flex-col gap-3">
          <button
            onClick={onReset}
            className="w-full py-3.5 bg-button hover:opacity-90 text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
          >
            Make Another Donation
          </button>
          <Link href="/" className="w-full">
            <button className="w-full py-3.5 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-medium text-sm rounded-lg transition-all duration-200">
              Return to Homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
