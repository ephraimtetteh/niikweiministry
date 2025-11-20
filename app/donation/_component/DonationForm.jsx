"use client"

import React, { useState } from "react"
import PaymentForm from "./PaymentForm"
import ConfirmationPage from "./ComfirmationPage"
import { validateDonationForm, submitDonation, processDonationData, formatCurrency, predefinedAmounts, donationFrequencies } from "@/utils/donationUtils"
import { toast } from "react-hot-toast"

const DonationForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    amount: "",
    frequency: "one-time",
    guestName: "",
    guestEmail: "",
    guestPhoneNumber: "",
    guestDedication: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [donationDetails, setDonationDetails] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleAmountSelect = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString()
    }))
    if (errors.amount) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.amount
        return newErrors
      })
    }
  }

  const handleSubmit = async () => {
    const validation = validateDonationForm(formData, currentStep)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    try {
      const processedData = processDonationData(formData)
      const response = await submitDonation(processedData)
      if (response.success) {
        setDonationDetails({
          amount: formData.amount,
          donor: formData.guestName || "Anonymous",
          transactionId: response.transactionId,
          date: new Date().toLocaleDateString()
        })
        setShowConfirmation(true)
        toast.success("Donation processed successfully!")
      } else {
        throw new Error("Donation failed")
      }
    } catch (error) {
      console.error("Donation error:", error)
      toast.error("Failed to process donation. Please try again.")
      setErrors({ submit: "Failed to process donation. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    const validation = validateDonationForm(formData, currentStep)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
      setErrors({})
    } else {
      await handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setErrors({})
    }
  }

  const renderStep1 = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-medium">Select Amount</label>
        <div className="grid grid-cols-2 gap-4">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className={`p-3 rounded-md transition-all ${
                formData.amount === amount.toString()
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {formatCurrency(amount)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="Custom Amount"
          className="border rounded-md p-2"
        />
        {errors.amount && (
          <span className="text-red-500 text-sm">{errors.amount}</span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label className="font-medium">Frequency</label>
        <select
          name="frequency"
          value={formData.frequency}
          onChange={handleInputChange}
          className="border rounded-md p-3"
        >
          {donationFrequencies.map((freq) => (
            <option key={freq.value} value={freq.value}>
              {freq.label}
            </option>
          ))}
        </select>
        {errors.frequency && (
          <span className="text-red-500 text-sm">{errors.frequency}</span>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="flex flex-col gap-4 py-10 font-medium">
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="guestName"
          value={formData.guestName}
          onChange={handleInputChange}
          placeholder="Your name"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        {errors.guestName && (
          <span className="text-red-500 text-sm">{errors.guestName}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="guestEmail"
          value={formData.guestEmail}
          onChange={handleInputChange}
          placeholder="youremail@example.com"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        {errors.guestEmail && (
          <span className="text-red-500 text-sm">{errors.guestEmail}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Phone Number (optional)</label>
        <input
          type="tel"
          name="guestPhoneNumber"
          value={formData.guestPhoneNumber}
          onChange={handleInputChange}
          placeholder="+233 123 456 789"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        {errors.guestPhoneNumber && (
          <span className="text-red-500 text-sm">{errors.guestPhoneNumber}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Dedication (optional)</label>
        <textarea
          name="guestDedication"
          value={formData.guestDedication}
          onChange={handleInputChange}
          placeholder="Your message here..."
          rows="4"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="flex flex-col gap-4">
      <PaymentForm formData={formData} onChange={handleInputChange} errors={errors} />
    </div>
  )

  if (showConfirmation && donationDetails) {
    return <ConfirmationPage {...donationDetails} />
  }

  return (
    <div className="max-w-4xl mx-auto p-6 my-10 border rounded-md">
      <h1 className="text-3xl font-semibold text-center py-4">Make A Donation</h1>
      <div className="flex items-center justify-center mb-8">
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
            currentStep === 1 ? "bg-gray-300 bg-opacity-0 text-transparent" : "text-black"
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
              ? "Processing..."
              : "Complete Donation"
            : "Continue"}
        </button>
      </div>
    </div>
  )
}

export default DonationForm
