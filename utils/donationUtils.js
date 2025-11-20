// Form validation
export const validateDonationForm = (formData, currentStep) => {
  const errors = {};

  switch (currentStep) {
    case 1:
      if (!formData.amount || formData.amount <= 0) {
        errors.amount = 'Please enter a valid donation amount';
      }
      if (!formData.frequency) {
        errors.frequency = 'Please select a donation frequency';
      }
      break;

    case 2:
      if (!formData.guestName?.trim()) {
        errors.guestName = 'Name is required';
      }
      if (!formData.guestEmail?.trim()) {
        errors.guestEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) {
        errors.guestEmail = 'Invalid email format';
      }
      // Phone number is optional, but validate format if provided
      if (formData.guestPhoneNumber?.trim() && !/^\+?[\d\s-]{10,}$/.test(formData.guestPhoneNumber.replace(/\s+/g, ''))) {
        errors.guestPhoneNumber = 'Invalid phone number format';
      }
      break;

    case 3:
      if (!formData.cardNumber?.trim()) {
        errors.cardNumber = 'Card number is required';
      }
      if (!formData.cardExpiry?.trim()) {
        errors.cardExpiry = 'Card expiry date is required';
      }
      if (!formData.cardCvc?.trim()) {
        errors.cardCvc = 'CVC is required';
      }
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Process donation data before submission
export const processDonationData = (formData) => {
  return {
    ...formData,
    transactionId: generateTransactionId(),
    submissionDate: new Date().toISOString(),
    status: 'pending'
  };
};

// Submit donation request
export const submitDonation = async (donationData) => {
  // This would be replaced with an actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: generateTransactionId(),
        message: 'Your donation has been processed successfully!'
      });
    }, 1500);
  });
};

// Generate a unique transaction ID
const generateTransactionId = () => {
  const prefix = 'DON';
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Predefined donation amounts
export const predefinedAmounts = [50, 100, 150, 200];

// Donation frequencies
export const donationFrequencies = [
  { value: 'one-time', label: 'One Time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];
