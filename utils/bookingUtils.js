// Form validation
export const validateForm = (formData, step) => {
  const errors = {};

  if (step === 1) {
    if (!formData.eventName?.trim()) errors.eventName = "Event name is required";
    if (!formData.eventDate) errors.eventDate = "Event date is required";
    if (!formData.eventTime) errors.eventTime = "Event time is required";
    if (!formData.eventType) errors.eventType = "Event type is required";
  }

  if (step === 2) {
    if (!formData.fullName?.trim()) errors.fullName = "Full name is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    if (!formData.phone?.trim()) errors.phone = "Phone number is required";
  }

  if (step === 3) {
    if (!formData.guestCount) errors.guestCount = "Expected audience size is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Submit booking request
export const submitBookingRequest = async (formData) => {
  // This would be replaced with an actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        bookingId: `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: 'Your booking request has been submitted successfully!'
      });
    }, 1500);
  });
};

// Process form data before submission
export const processFormData = (formData) => {
  return {
    ...formData,
    submissionDate: new Date().toISOString(),
    status: 'pending',
    bookingReference: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  };
};
