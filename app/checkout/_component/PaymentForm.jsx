"use client"

import Image from "next/image";
import { useCheckout } from "@/context/CheckoutContext";
import { IoLockClosedOutline } from "react-icons/io5";
import Card from '@/public/donate/card.png'
import Bank from '@/public/donate/bank.png'
import Paystack from '@/public/donate/paystack.png'
import { useState } from "react"
import { toast } from "react-hot-toast"

const CheckoutPaymentForm = ({ formData, onChange }) => {
  const { checkoutData, updateCheckoutData, errors } = useCheckout();
  const [formErrors, setFormErrors] = useState({})

  const validateCardNumber = (number) => {
    const regex = /^[\d\s]{16,19}$/
    return regex.test(number.replace(/\s/g, ""))
  }

  const validateExpiry = (expiry) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    if (!regex.test(expiry)) return false

    const [month, year] = expiry.split("/")
    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1)
    const today = new Date()
    return expDate > today
  }

  const validateCVC = (cvc) => {
    const regex = /^[0-9]{3,4}$/
    return regex.test(cvc)
  }

  const handlePaymentMethodChange = (method) => {
    setFormErrors({})
    onChange({ target: { name: "paymentMethod", value: method } })
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  }

  const handleCardNumberChange = (e) => {
    const value = formatCardNumber(e.target.value)
    if (!validateCardNumber(value) && value.length > 0) {
      setFormErrors(prev => ({ ...prev, cardNumber: "Invalid card number" }))
    } else {
      setFormErrors(prev => ({ ...prev, cardNumber: undefined }))
    }
    onChange({ target: { name: "cardNumber", value } })
  };

  const handleExpiryChange = (e) => {
    const value = formatExpiry(e.target.value)
    if (!validateExpiry(value) && value.length === 5) {
      setFormErrors(prev => ({ ...prev, expiry: "Invalid expiry date" }))
    } else {
      setFormErrors(prev => ({ ...prev, expiry: undefined }))
    }
    onChange({ target: { name: "cardExpiry", value } })
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3)
    if (!validateCVC(value) && value.length > 0) {
      setFormErrors(prev => ({ ...prev, cvc: "Invalid CVC" }))
    } else {
      setFormErrors(prev => ({ ...prev, cvc: undefined }))
    }
    onChange({ target: { name: "cardCvc", value } })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateCheckoutData({ [name]: value });
  };

  const handleSaveCardChange = (e) => {
    updateCheckoutData({ saveCard: e.target.checked });
  };

  return (
    <div className="p-4 bg-white">
      {/* Secured Payment Header */}
      <div className="mb-6 bg-purple-50 flex flex-col gap-2 rounded-md">
        <h2 className="text-lg font-semibold text-gray-800 p-4 gap-4 flex items-center">
          <IoLockClosedOutline className="text-4xl flex items-center gap-4 text-purple-500" />
          <div className="flex flex-col gap-1">
            <p>Secured Payment</p>
            <p className="text-sm text-gray-500">
              Your payment information is encrypted and secure.
            </p>
          </div>
        </h2>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handlePaymentMethodChange("creditCard")}
            className={`p-4 border rounded-lg flex items-center gap-3 ${
              formData.paymentMethod === "creditCard"
                ? "border-purple-500 bg-purple-50"
                : "hover:border-purple-500"
            }`}
          >
            <Image src={Card} alt="Card" width={30} height={20} />
            <span>Credit/Debit Card</span>
          </button>

          <button
            onClick={() => handlePaymentMethodChange("bankTransfer")}
            className={`p-4 border rounded-lg flex items-center gap-3 ${
              formData.paymentMethod === "bankTransfer"
                ? "border-purple-500 bg-purple-50"
                : "hover:border-purple-500"
            }`}
          >
            <Image src={Bank} alt="bank" width={30} height={20} />
            <span>Bank Transfer</span>
          </button>

          <button
            onClick={() => handlePaymentMethodChange("paystack")}
            className={`p-4 border rounded-lg flex items-center gap-3 ${
              formData.paymentMethod === "paystack"
                ? "border-purple-500 bg-purple-50"
                : "hover:border-purple-500"
            }`}
          >
            <Image src={Paystack} alt="paystack" width={60} height={40} />
            <span>Paystack</span>
          </button>
        </div>
        {errors.paymentMethod && (
          <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
        )}
      </div>

      {/* Credit Card Form */}
      {formData.paymentMethod === "creditCard" && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={checkoutData.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className={`border rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                formErrors.cardNumber || errors.cardNumber ? 'border-red-500' : ''
              }`}
            />
            {(formErrors.cardNumber || errors.cardNumber) && (
              <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber || errors.cardNumber}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                name="cardExpiry"
                value={checkoutData.cardExpiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength="5"
                className={`border rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                  formErrors.expiry || errors.cardExpiry ? 'border-red-500' : ''
                }`}
              />
              {(formErrors.expiry || errors.cardExpiry) && (
                <p className="text-red-500 text-sm mt-1">{formErrors.expiry || errors.cardExpiry}</p>
              )}
            </div>
            
            <div className="flex-1">
              <label className="block font-medium text-gray-700 mb-2">
                CVC
              </label>
              <input
                type="text"
                name="cardCvc"
                value={checkoutData.cardCvc}
                onChange={handleCvcChange}
                placeholder="123"
                maxLength="3"
                className={`border rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                  formErrors.cvc || errors.cardCvc ? 'border-red-500' : ''
                }`}
              />
              {(formErrors.cvc || errors.cardCvc) && (
                <p className="text-red-500 text-sm mt-1">{formErrors.cvc || errors.cardCvc}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="saveCard"
                checked={checkoutData.saveCard}
                onChange={handleSaveCardChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">
                Save this card for future purchases
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Bank Transfer Instructions */}
      {formData.paymentMethod === "bankTransfer" && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Bank Transfer Instructions</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please transfer the total amount to the following bank account:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Bank Name:</strong> Example Bank</p>
            <p><strong>Account Name:</strong> Your Company Name</p>
            <p><strong>Account Number:</strong> 1234567890</p>
            <p><strong>Sort Code:</strong> 12-34-56</p>
            <p><strong>Reference:</strong> Order-{Date.now()}</p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Please use the reference number when making the transfer. Your order will be processed once we receive the payment.
          </p>
        </div>
      )}

      {/* Paystack Information */}
      {formData.paymentMethod === "paystack" && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            You will be redirected to Paystack's secure payment page to complete your purchase.
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckoutPaymentForm;
