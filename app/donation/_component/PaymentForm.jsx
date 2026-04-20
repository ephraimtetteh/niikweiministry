"use client";

import React, { useState } from "react";
import { formatCurrency, donationFrequencies } from "@/utils/donationUtils";

const PAYSTACK_PUBLIC_KEY = "pk_live_4b3f240902e99cf54f92528524cfcb7aac2999b4";

function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("SSR"));
    if (window.PaystackPop) return resolve(window.PaystackPop);
    const existing = document.getElementById("paystack-js");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.PaystackPop));
      return;
    }
    const script = document.createElement("script");
    script.id = "paystack-js";
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    script.onload = () => resolve(window.PaystackPop);
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.head.appendChild(script);
  });
}

export function openPaystackPopup({
  email,
  amountPesewas,
  reference,
  metadata,
  onSuccess,
  onCancel,
}) {
  loadPaystackScript()
    .then((PaystackPop) => {
      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: amountPesewas,
        currency: "GHS",
        ref: reference,
        metadata: metadata ?? {},
        onSuccess: (txn) => onSuccess?.(txn),
        onCancel: () => onCancel?.(),
      });
      handler.openIframe();
    })
    .catch((err) => {
      console.error("Paystack load error:", err);
      alert(
        "Could not load payment processor. Check your connection and try again.",
      );
    });
}

const inputCls =
  "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm " +
  "placeholder:text-white/30 outline-none focus:border-violet-500 focus:bg-white/8 " +
  "focus:ring-2 focus:ring-violet-500/20 transition-all duration-200";

const Field = ({ label, optional, error, children }) => (
  <div className="flex flex-col gap-2 mb-5">
    <label className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/40">
      {label}
      {optional && (
        <span className="ml-1 normal-case tracking-normal font-normal text-white/25">
          (optional)
        </span>
      )}
    </label>
    {children}
    {error && <p className="text-red-400 text-xs">{error}</p>}
  </div>
);

const METHODS = [
  {
    id: "paystack",
    label: "Paystack",
    sub: "Recommended · Fast & secure",
    icon: "⚡",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    sub: "Visa, Mastercard",
    icon: "💳",
  },
  {
    id: "bank",
    label: "Bank Transfer",
    sub: "UBA · Manual transfer",
    icon: "🏦",
  },
];

export default function PaymentStep({
  formData,
  onChange,
  errors,
  amount,
  frequency,
}) {
  const [method, setMethod] = useState("paystack");
  const freqLabel =
    donationFrequencies.find((f) => f.value === frequency)?.label ?? "One-time";

  return (
    <div>
      {/* Amount summary */}
      <div className="relative rounded-xl overflow-hidden mb-7">
        {/* background matches site's dark overlay style */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-violet-500/10 to-transparent" />
        <div className="absolute inset-0 border border-violet-500/20 rounded-xl" />
        <div className="relative flex items-center justify-between px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[2px] text-violet-400/70 mb-1">
              Donating
            </p>
            <p className="text-3xl font-bold text-white leading-none">
              {formatCurrency(amount || 0)}
            </p>
            <p className="text-xs text-white/40 mt-1.5 capitalize">
              {freqLabel} contribution
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
            <span className="text-violet-400 text-lg">✦</span>
          </div>
        </div>
      </div>

      {/* Method picker */}
      <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/40 mb-3">
        Payment Method
      </p>
      <div className="flex flex-col gap-2.5 mb-6">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={[
              "flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200",
              method === m.id
                ? "border-violet-500 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.2)]"
                : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5",
            ].join(" ")}
          >
            {/* Radio */}
            <span
              className={[
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                method === m.id ? "border-violet-500" : "border-white/20",
              ].join(" ")}
            >
              {method === m.id && (
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 block" />
              )}
            </span>
            <span className="text-xl leading-none shrink-0">{m.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{m.label}</p>
              <p className="text-xs text-white/35 mt-0.5">{m.sub}</p>
            </div>
            {m.id === "paystack" && (
              <span className="ml-auto text-[10px] font-bold uppercase tracking-[1px] bg-violet-500 text-white px-2.5 py-1 rounded-full shrink-0">
                Recommended
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Paystack ── */}
      {method === "paystack" && (
        <div>
          <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3.5 mb-5">
            <svg
              className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-xs text-emerald-400 leading-relaxed">
              You'll be redirected to Paystack's encrypted checkout. Your
              receipt will be emailed instantly after payment.
            </p>
          </div>
          <Field label="Email for Receipt" error={errors?.guestEmail}>
            <input
              type="email"
              name="guestEmail"
              value={formData.guestEmail}
              onChange={onChange}
              placeholder="you@example.com"
              className={inputCls}
            />
          </Field>
        </div>
      )}

      {/* ── Card ── */}
      {method === "card" && (
        <div>
          <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3.5 mb-5">
            <svg
              className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-xs text-emerald-400 leading-relaxed">
              Your card details are encrypted and never stored on our servers.
            </p>
          </div>
          <Field label="Card Number" error={errors?.cardNumber}>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={onChange}
              placeholder="1234 5678 9012 3456"
              className={inputCls}
              maxLength={19}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry Date" error={errors?.cardExpiry}>
              <input
                type="text"
                name="cardExpiry"
                value={formData.cardExpiry}
                onChange={onChange}
                placeholder="MM / YY"
                className={inputCls}
                maxLength={5}
              />
            </Field>
            <Field label="CVC" error={errors?.cardCvc}>
              <input
                type="text"
                name="cardCvc"
                value={formData.cardCvc}
                onChange={onChange}
                placeholder="•••"
                className={inputCls}
                maxLength={4}
              />
            </Field>
          </div>
        </div>
      )}

      {/* ── Bank ── */}
      {method === "bank" && (
        <div>
          <div className="rounded-xl border border-white/10 bg-white/3 overflow-hidden mb-5">
            <div className="px-5 py-3 border-b border-white/8">
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/30">
                Bank Details
              </p>
            </div>
            {[
              { label: "Bank Name", value: "UBA" },
              { label: "Account No.", value: "00916769302511" },
              { label: "Account Name", value: "Nii Kwei Ministries" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center px-5 py-3.5 border-b border-white/5 last:border-0"
              >
                <span className="text-sm text-white/35">{row.label}</span>
                <span className="text-sm font-semibold text-white">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <Field label="Transfer Reference" optional>
            <input
              type="text"
              name="transferRef"
              onChange={onChange}
              placeholder="Your name or a short note"
              className={inputCls}
            />
          </Field>
          <p className="text-xs text-white/30 leading-relaxed">
            After transferring, click{" "}
            <strong className="text-white/50">Complete Donation</strong> to
            confirm your giving record and receive your receipt.
          </p>
        </div>
      )}
    </div>
  );
}
