// utils/donationUtils.js

// ─── Currency ─────────────────────────────────────────────────────────────────
export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount);

// ─── Constants ────────────────────────────────────────────────────────────────
export const predefinedAmounts = [50, 100, 200, 500];

export const donationFrequencies = [
  { value: "one-time", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

// ─── Transaction ID ───────────────────────────────────────────────────────────
export const generateTransactionId = () => {
  const prefix = "DON";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// ─── Validation ───────────────────────────────────────────────────────────────
export const validateDonationForm = (formData, step) => {
  const errors = {};

  if (step === 1) {
    if (!formData.amount || Number(formData.amount) <= 0)
      errors.amount = "Please enter a valid donation amount";
    if (!formData.frequency) errors.frequency = "Please select a frequency";
  }

  if (step === 2) {
    if (!formData.guestName?.trim()) errors.guestName = "Name is required";
    if (!formData.guestEmail?.trim()) errors.guestEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.guestEmail))
      errors.guestEmail = "Invalid email format";
    if (
      formData.guestPhoneNumber?.trim() &&
      !/^\+?[\d\s-]{10,}$/.test(formData.guestPhoneNumber.replace(/\s+/g, ""))
    )
      errors.guestPhoneNumber = "Invalid phone number";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// ─── Process donation data ────────────────────────────────────────────────────
export const processDonationData = (formData) => ({
  ...formData,
  transactionId: generateTransactionId(),
  submissionDate: new Date().toISOString(),
  status: "pending",
});
