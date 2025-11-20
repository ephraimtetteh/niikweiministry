// Form validation
export const validateForm = (formData, currentStep) => {
  const errors = {};

  switch (currentStep) {
    case 1:
      if (!formData.guestName?.trim()) {
        errors.guestName = 'Name is required';
      }
      if (!formData.guestEmail?.trim()) {
        errors.guestEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) {
        errors.guestEmail = 'Invalid email format';
      }
      if (!formData.guestPhoneNumber?.trim()) {
        errors.guestPhoneNumber = 'Phone number is required';
      }
      break;

    case 2:
      if (!Object.values(formData.roles || {}).some(role => role)) {
        errors.roles = 'Please select at least one role';
      }
      if (!formData.availability?.trim()) {
        errors.availability = 'Please specify your availability';
      }
      break;

    case 3:
      if (!formData.skills?.trim()) {
        errors.skills = 'Please tell us about your skills and motivation';
      }
      break;

    case 4:
      if (!formData.fullName?.trim()) {
        errors.fullName = 'Reference name is required';
      }
      if (!formData.phoneNumber?.trim()) {
        errors.phoneNumber = 'Reference phone number is required';
      }
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Submit volunteer application
export const submitVolunteerApplication = async (formData) => {
  // This would be replaced with an actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        applicationId: `VOL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: 'Your volunteer application has been submitted successfully!'
      });
    }, 1500);
  });
};

// Process form data before submission
export const processFormData = (formData) => {
  const selectedRoles = Object.entries(formData.roles || {})
    .filter(([_, value]) => value)
    .map(([key]) => key);

  return {
    ...formData,
    roles: selectedRoles,
    submissionDate: new Date().toISOString(),
  };
};
