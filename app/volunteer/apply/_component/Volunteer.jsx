"use client";

import { processFormData, submitVolunteerApplication, validateForm } from "@/utils/volunteerFormUtils";
import React, { useState } from "react";
import Confirmation from "./Confirmation";
import Form2 from "./Form2";
import Form3 from "./Form3";
import Form4 from "./Form4";

const Volunteer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhoneNumber: "",
    guestBirthDay: "",
    guestCountry: "",
    guestProfilePicture: null,
    guestFrontIdCard: null,
    guestBackIdCard: null,
    guestGovernmentIdType: "",
    guestGovernmentIdNumber: "",
    roles: {
      worshipTeam: false,
      outreachPrograms: false,
      youthMinistry: false,
      eventSupport: false,
      administrativeRoles: false,
    },
    availability: "",
    skills: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    userRole: "guest-admin",
    userType: "guest",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    const validation = validateForm(formData, currentStep);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      setErrors({});
    } else {
      setIsSubmitting(true);
      try {
        const processedData = processFormData(formData);
        const result = await submitVolunteerApplication(processedData);
        if (result.success) {
          setShowConfirmation(true);
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        setErrors({ submit: 'Failed to submit application. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
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
      <div className="flex flex-col gap-4 text-3xl">Personal Details</div>
      <div className="flex flex-col gap-2">
        <label>Name</label>
        <input
          type="text"
          name="guestName"
          value={formData.guestName}
          onChange={handleInputChange}
          placeholder="Tom Kin"
          className="border rounded-md p-2"
        />
        {errors?.guestName && (
          <span className="text-red-500 text-sm">{errors.guestName}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Email Address</label>
        <input
          type="email"
          name="guestEmail"
          value={formData.guestEmail}
          onChange={handleInputChange}
          placeholder="email@example.com"
          className="border rounded-md p-2"
        />
        {errors?.guestEmail && (
          <span className="text-red-500 text-sm">{errors.guestEmail}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Phone Number</label>
        <input
          type="text"
          name="guestPhoneNumber"
          value={formData.guestPhoneNumber}
          onChange={handleInputChange}
          placeholder="+1234567890"
          className="border rounded-md p-2"
        />
        {errors?.guestPhoneNumber && (
          <span className="text-red-500 text-sm">{errors.guestPhoneNumber}</span>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="">
      <Form2 formData={formData} onChange={handleInputChange} errors={errors} />
    </div>
  );

  const renderStep3 = () => (
    <div className="">
      <Form3 formData={formData} onChange={handleInputChange} errors={errors} />
    </div>
  );

  const renderStep4 = () => (
    <div className="">
      <Form4 formData={formData} onChange={handleInputChange} errors={errors} />
    </div>
  );

  return (
    <div>
      {showConfirmation ? (
        <Confirmation />
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-start py-10">
            {/* Step Indicators */}
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                      currentStep >= step ? "bg-purple-500" : "bg-gray-200"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && <div className={`h-1 w-16 ${currentStep > step ? "bg-purple-500" : "bg-gray-200"}`} />}
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="p-6 border rounded-md mb-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {errors.submit && (
              <div className="mt-4 text-red-500 text-center">{errors.submit}</div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                className={`px-6 py-2 rounded-md ${
                  currentStep === 1 ? "bg-gray-300 bg-opacity-0 text-transparent" : "text-black"
                }`}
                disabled={currentStep === 1 || isSubmitting}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-10 py-2 bg-button text-white rounded-md"
                disabled={isSubmitting}
              >
                {currentStep === 4 
                  ? (isSubmitting ? "Submitting..." : "Submit Application")
                  : "Continue"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteer;
