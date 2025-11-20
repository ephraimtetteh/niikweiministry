"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useCart } from "@/context/CartContext"
import CheckoutPaymentForm from "./PaymentForm"
import ReviewPage from "./Review"
import OrderConfirmation from "./OrderConfirmation"

const CheckoutForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const { cartItems, clearCart } = useCart()
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateStep1 = () => {
    console.log('Form Data:', formData)
    
    const requiredFields = {
      email: formData.email,
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country
    }

    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field)

    if (emptyFields.length > 0) {
      console.log('Empty fields:', emptyFields)
      toast.error("Please fill in all required fields")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    console.log('Payment Method:', formData.paymentMethod)
    console.log('Card Details:', {
      number: formData.cardNumber,
      expiry: formData.cardExpiry,
      cvc: formData.cardCvc
    })

    if (!formData.paymentMethod) {
      toast.error("Please select a payment method")
      return false
    }

    if (formData.paymentMethod === "creditCard") {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        toast.error("Please fill in all card details")
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    } else {
      handlePlaceOrder()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handlePlaceOrder = () => {
    const newOrderNumber = `ORD-${Math.random().toString(36).substr(2, 9)}`
    setOrderNumber(newOrderNumber)
    clearCart()
    setShowConfirmation(true)
    toast.success("Order placed successfully!")
  }

  const handleEdit = (step) => {
    setCurrentStep(step)
  }

  const renderStep1 = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4"></div>
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-medium">Contact Information</h1>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md border"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md border"
            />
          </div>
        </div>
        <h1 className="text-2xl font-medium mt-6">Shipping Address</h1>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md border"
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md border"
            placeholder="Last Name"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md border"
            placeholder="Address"
          />
          <input
            type="text"
            name="apartment"
            value={formData.apartment}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md border"
            placeholder="Apartment, suite etc. (optional)"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md border"
            placeholder="City"
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md border"
            placeholder="State"
          />
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md border"
            placeholder="Zip Code"
          />
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md border"
          >
            <option value="">Select Country</option>
            <option value="Ghana">Ghana</option>
            <option value="Nigeria">Nigeria</option>
            <option value="USA">USA</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="flex flex-col gap-4">
      <CheckoutPaymentForm formData={formData} onChange={handleInputChange} />
    </div>
  )

  const renderStep3 = () => (
    <div className="flex flex-col gap-4">
      <ReviewPage formData={formData} onEdit={handleEdit} />
    </div>
  )

  const renderStep4 = () => (
    <div className="flex flex-col gap-4">
      <OrderConfirmation orderNumber={orderNumber} formData={formData} />
    </div>
  );

  if (cartItems.length === 0 && !showConfirmation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some items to your cart to proceed with checkout</p>
        <button
          onClick={() => router.push("/store")}
          className="bg-button text-white px-6 py-2 rounded-md hover:bg-purple-600 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div>
      {showConfirmation ? (
        renderStep4()
      ) : (
        <div className="w-full p-6 pt-10 -mt-32 border rounded-md bg-white">
          <h1 className="text-3xl font-semibold py-3">Checkout</h1>
          <div className="flex items-center justify-start">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                  currentStep >= 1 ? "bg-purple-500" : "bg-gray-200"
                }`}
              >
                1
              </div>
              <div className={`h-1 w-16 ${currentStep >= 2 ? "bg-purple-500" : "bg-gray-200"}`} />
            </div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                  currentStep >= 2 ? "bg-purple-500" : "bg-gray-200"
                }`}
              >
                2
              </div>
              <div className={`h-1 w-16 ${currentStep >= 3 ? "bg-purple-500" : "bg-gray-200"}`} />
            </div>

            {/* Step 3 */}
            <div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                  currentStep >= 3 ? "bg-purple-500" : "bg-gray-200"
                }`}
              >
                3
              </div>
            </div>
          </div>

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className={`px-6 py-2 rounded-md ${
                currentStep === 1 ? "bg-gray-300 bg-opacity-0 text-transparent" : "text-black"
              }`}
              disabled={currentStep === 1}
            >
              Back
            </button>
            <button 
              onClick={handleNext} 
              className="px-10 py-2 bg-button text-white rounded-md"
            >
              {currentStep === 3 ? "Place Order" : "Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutForm
