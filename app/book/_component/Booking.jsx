"use client"

import { validateForm } from "@/utils/bookingUtils";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import BookingConfirmation from "./BookingConfirmation";
import Form2 from "./Form2";
import Form3 from "./Form3";

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventType: "",
    fullName: "",
    email: "",
    phone: "",
    additionalInfo: "",
    guestCount: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    const validation = validateForm(formData, currentStep);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Format the data to match the backend DTO
      const bookingData = {
        eventName: formData.eventName,
        date: formData.eventDate,
        time: formData.eventTime,
        eventType: formData.eventType,
        location: "To be confirmed", // Add this field to your form if needed
        description: formData.additionalInfo || "No description provided",
        fullName: formData.fullName,
        emailAddress: formData.email,
        phoneNumber: formData.phone,
        numberOfPeople: parseInt(formData.guestCount),
        specialRequests: formData.additionalInfo || "No special requests"
      };

      console.log('Sending booking data:', bookingData); // For debugging

      const response = await fetch("https://nii-kwei-server.onrender.com/api/booking/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Server error response:', errorData); // For debugging
        throw new Error(errorData.message || "Failed to submit booking");
      }

      const data = await response.json();
      setSubmittedData({ 
        ...formData, 
        bookingId: data.bookingId || Date.now().toString(),
        submissionDate: new Date().toLocaleDateString()
      });
      setIsSubmitted(true);
      toast.success("Booking request submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit booking request. Please try again.");
      setErrors({ submit: "Failed to submit booking request. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    const validation = validateForm(formData, currentStep);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      setErrors({});
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const renderStep1 = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label>Event Name</label>
        <input
          type="text"
          name="eventName"
          value={formData.eventName}
          onChange={handleInputChange}
          placeholder="Enter event name"
          className="border rounded-md p-2"
        />
        {errors?.eventName && (
          <span className="text-red-500 text-sm">{errors.eventName}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Date</label>
        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleInputChange}
          className="border rounded-md p-2"
        />
        {errors?.eventDate && (
          <span className="text-red-500 text-sm">{errors.eventDate}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Time</label>
        <input
          type="time"
          name="eventTime"
          value={formData.eventTime}
          onChange={handleInputChange}
          className="border rounded-md p-2"
        />
        {errors?.eventTime && (
          <span className="text-red-500 text-sm">{errors.eventTime}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Event Type</label>
        <select
          name="eventType"
          value={formData.eventType}
          onChange={handleInputChange}
          className="border rounded-md p-2"
        >
          <option value="">Select event type</option>
          <option value="wedding">Wedding</option>
          <option value="birthday">Birthday</option>
          <option value="corporate">Corporate</option>
          <option value="other">Other</option>
        </select>
        {errors?.eventType && (
          <span className="text-red-500 text-sm">{errors.eventType}</span>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <Form2 formData={formData} onChange={handleInputChange} errors={errors} />
  );

  const renderStep3 = () => (
    <Form3 formData={formData} onChange={handleInputChange} errors={errors} />
  );

  if (isSubmitted && submittedData) {
    return <BookingConfirmation bookingData={submittedData} />;
  }

  return (
    <div>
      <div className="w-full">
        <div className="flex items-center justify-start py-10">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                    currentStep >= step ? "bg-purple-500" : "bg-gray-200"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 w-16 ${
                      currentStep > step ? "bg-purple-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="p-6 border rounded-md mb-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {errors.submit && (
            <div className="mt-4 text-red-500 text-center">{errors.submit}</div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className={`px-6 py-2 rounded-md ${
                currentStep === 1
                  ? "bg-gray-300 bg-opacity-0 text-transparent"
                  : "text-black"
              }`}
              disabled={currentStep === 1 || isSubmitting}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-10 py-2 bg-button text-white rounded-md disabled:opacity-50"
              disabled={isSubmitting}
            >
              {currentStep === 3
                ? isSubmitting
                  ? "Submitting..."
                  : "Submit Booking Request"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
