"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  formatCurrency,
  predefinedAmounts,
  donationFrequencies,
  validateDonationForm,
  generateTransactionId,
} from "@/utils/donationUtils";
import PaymentStep, { openPaystackPopup } from "./PaymentForm";
import ConfirmationPage from "./ComfirmationPage.jsx";


const STEPS = [
  { label: "Amount", icon: "01" },
  { label: "Details", icon: "02" },
  { label: "Payment", icon: "03" },
];

const EMPTY_FORM = {
  amount: "",
  frequency: "one-time",
  guestName: "",
  guestEmail: "",
  guestPhoneNumber: "",
  guestDedication: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
};

/* ── shared input style matching site's form aesthetic ── */
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

export default function DonationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name])
      setErrors((p) => {
        const n = { ...p };
        delete n[name];
        return n;
      });
  };

  const selectAmount = (a) => {
    setFormData((p) => ({ ...p, amount: String(a) }));
    setErrors((p) => {
      const n = { ...p };
      delete n.amount;
      return n;
    });
  };

  const resetForm = () => {
    setConfirmation(null);
    setStep(1);
    setFormData(EMPTY_FORM);
    setErrors({});
  };

  const triggerPaystack = () =>
    new Promise((resolve, reject) => {
      openPaystackPopup({
        email: formData.guestEmail,
        amountPesewas: Math.round(Number(formData.amount) * 100),
        reference: generateTransactionId(),
        metadata: {
          custom_fields: [
            {
              display_name: "Donor Name",
              variable_name: "donor_name",
              value: formData.guestName,
            },
            {
              display_name: "Frequency",
              variable_name: "frequency",
              value: formData.frequency,
            },
            {
              display_name: "Dedication",
              variable_name: "dedication",
              value: formData.guestDedication,
            },
          ],
        },
        onSuccess: (txn) => resolve(txn),
        onCancel: () => reject(new Error("cancelled")),
      });
    });

  const verifyAndComplete = async (paystackRef) => {
    const res = await fetch("/api/donation/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: paystackRef,
        donorMeta: {
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhoneNumber: formData.guestPhoneNumber,
          guestDedication: formData.guestDedication,
          frequency: formData.frequency,
        },
      }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error ?? "Verification failed");
    }
    return res.json();
  };

  const submitOffline = async () => {
    const transactionId = generateTransactionId();
    const date = new Date().toLocaleDateString("en-GH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    await fetch("/api/donation/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: transactionId,
        donorMeta: {
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhoneNumber: formData.guestPhoneNumber,
          guestDedication: formData.guestDedication,
          frequency: formData.frequency,
          offlineAmount: Number(formData.amount),
          offlineDate: date,
        },
      }),
    });
    return {
      donation: {
        guestName: formData.guestName,
        amount: formData.amount,
        transactionId,
        date,
      },
    };
  };

  const handleNext = async () => {
    const v = validateDonationForm(formData, step);
    if (!v.isValid) {
      setErrors(v.errors);
      return;
    }
    if (step < 3) {
      setStep((p) => p + 1);
      setErrors({});
      return;
    }

    setSubmitting(true);
    try {
      let donation;
      try {
        const txn = await triggerPaystack();
        const res = await verifyAndComplete(txn.reference ?? txn.trxref);
        donation = res.donation;
      } catch (err) {
        if (err.message === "cancelled") {
          toast.error("Payment was cancelled.");
          setSubmitting(false);
          return;
        }
        const res = await submitOffline();
        donation = res.donation;
      }
      setConfirmation({
        amount: donation.amount,
        donor: donation.guestName || "Anonymous",
        transactionId: donation.transactionId,
        date:
          donation.date ??
          new Date().toLocaleDateString("en-GH", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
      });
      toast.success("Donation processed — check your inbox!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setErrors({ submit: "Failed to process donation. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation)
    return <ConfirmationPage {...confirmation} onReset={resetForm} />;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ── Stepper ── */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => {
          const num = i + 1;
          const active = step === num;
          const done = step > num;
          return (
            <React.Fragment key={s.label}>
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 shrink-0",
                    active
                      ? "bg-violet-500 border-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                      : "",
                    done
                      ? "bg-violet-500/20 border-violet-500 text-violet-400"
                      : "",
                    !active && !done
                      ? "bg-white/5 border-white/15 text-white/30"
                      : "",
                  ].join(" ")}
                >
                  {done ? (
                    <svg
                      className="w-4 h-4"
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
                  ) : (
                    s.icon
                  )}
                </div>
                <span
                  className={[
                    "text-sm font-medium hidden sm:block",
                    active
                      ? "text-white"
                      : done
                        ? "text-violet-400"
                        : "text-white/30",
                  ].join(" ")}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={[
                    "flex-1 h-px mx-4 transition-all duration-500",
                    done ? "bg-violet-500/60" : "bg-white/10",
                  ].join(" ")}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Card ── */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {/* Step label bar */}
        <div className="px-8 pt-8 pb-6 border-b border-white/8">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-violet-400 mb-1">
            Step {step} of 3
          </p>
          <h2 className="text-2xl font-semibold text-white">
            {step === 1 && "Choose Your Giving Amount"}
            {step === 2 && "Your Information"}
            {step === 3 && "Complete Your Gift"}
          </h2>
          <p className="text-sm text-white/40 mt-1">
            {step === 1 && "Select a preset amount or enter your own."}
            {step === 2 && "Tell us a little about yourself."}
            {step === 3 && "Choose how you'd like to give."}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-7">
          {/* ── Step 1: Amount ── */}
          {step === 1 && (
            <div>
              {/* Preset amounts */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {predefinedAmounts.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => selectAmount(a)}
                    className={[
                      "py-4 rounded-xl border text-sm font-semibold transition-all duration-200",
                      formData.amount === String(a)
                        ? "bg-violet-500 border-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                        : "bg-white/5 border-white/10 text-white/70 hover:border-violet-400/60 hover:text-white hover:bg-violet-500/10",
                    ].join(" ")}
                  >
                    {formatCurrency(a)}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <Field label="Custom Amount" error={errors.amount}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium">
                    GHS
                  </span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={inputCls + " pl-14"}
                  />
                </div>
              </Field>

              {/* Frequency */}
              <Field label="Giving Frequency" error={errors.frequency}>
                <div className="grid grid-cols-4 gap-2">
                  {donationFrequencies.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, frequency: f.value }))
                      }
                      className={[
                        "py-2.5 rounded-lg border text-xs font-semibold transition-all duration-200",
                        formData.frequency === f.value
                          ? "bg-violet-500/20 border-violet-500 text-violet-300"
                          : "bg-white/5 border-white/10 text-white/40 hover:border-white/25 hover:text-white/60",
                      ].join(" ")}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Live preview */}
              {formData.amount && Number(formData.amount) > 0 && (
                <div className="mt-4 rounded-xl bg-violet-500/10 border border-violet-500/20 px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[1.5px] text-violet-400/80 mb-0.5">
                      Your Gift
                    </p>
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(formData.amount)}
                    </p>
                  </div>
                  <span className="text-xs text-violet-400 bg-violet-500/20 px-3 py-1 rounded-full font-medium capitalize">
                    {
                      donationFrequencies.find(
                        (f) => f.value === formData.frequency,
                      )?.label
                    }
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Details ── */}
          {step === 2 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Field label="Full Name" error={errors.guestName}>
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </Field>
                <Field label="Email Address" error={errors.guestEmail}>
                  <input
                    type="email"
                    name="guestEmail"
                    value={formData.guestEmail}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field
                label="Phone Number"
                optional
                error={errors.guestPhoneNumber}
              >
                <input
                  type="tel"
                  name="guestPhoneNumber"
                  value={formData.guestPhoneNumber}
                  onChange={handleChange}
                  placeholder="+233 20 000 0000"
                  className={inputCls}
                />
              </Field>
              <Field label="Dedication or Message" optional>
                <textarea
                  name="guestDedication"
                  value={formData.guestDedication}
                  onChange={handleChange}
                  placeholder="In honor of, or in memory of…"
                  rows={3}
                  className={inputCls + " resize-none"}
                />
              </Field>

              {/* Giving summary pill */}
              <div className="mt-2 flex items-center gap-3 text-sm text-white/40">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                Giving{" "}
                <span className="text-white font-medium">
                  {formatCurrency(formData.amount)}
                </span>
                <span className="text-white/30">·</span>
                <span className="capitalize">
                  {
                    donationFrequencies.find(
                      (f) => f.value === formData.frequency,
                    )?.label
                  }
                </span>
              </div>
            </div>
          )}

          {/* ── Step 3: Payment ── */}
          {step === 3 && (
            <PaymentStep
              formData={formData}
              onChange={handleChange}
              errors={errors}
              amount={formData.amount}
              frequency={formData.frequency}
            />
          )}

          {errors.submit && (
            <p className="text-red-400 text-sm text-center mt-4">
              {errors.submit}
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-5 border-t border-white/8 flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              setStep((p) => p - 1);
              setErrors({});
            }}
            disabled={step === 1 || submitting}
            className="text-sm font-medium text-white/40 hover:text-white transition-colors disabled:opacity-0 disabled:pointer-events-none"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="flex items-center gap-2.5 px-8 py-3 bg-button hover:opacity-90 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 disabled:hover:translate-y-0"
          >
            {submitting && (
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
            )}
            {step === 3
              ? submitting
                ? "Processing…"
                : "Complete Donation"
              : "Continue"}
          </button>
        </div>
      </div>

      {/* Security note */}
      <p className="text-center text-xs text-white/25 mt-5 flex items-center justify-center gap-2">
        <svg
          className="w-3.5 h-3.5"
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
        Secured by Paystack · Your payment is encrypted end-to-end
      </p>
    </div>
  );
}