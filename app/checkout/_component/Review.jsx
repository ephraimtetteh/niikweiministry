"use client"

import { useCart } from '@/context/CartContext'
import { useState, useEffect } from "react"
import { ReviewSection } from "./ReviewSection"
import Image from 'next/image'

const ReviewPage = ({ formData, onEdit }) => {
  const { cartItems, getCartTotal } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const calculateTotals = () => {
    const subtotal = parseFloat(getCartTotal().replace('$', '')) || 0
    const shipping = 5
    const tax = subtotal * 0.05 // 5% tax
    const total = subtotal + shipping + tax

    return {
      subtotal,
      shipping,
      tax,
      total
    }
  }

  const totals = calculateTotals()

  const formatCardNumber = (number) => {
    if (!number) return ''
    return `•••• ${number.slice(-4)}`
  }

  return (
    <div className="my-5">
      <h1 className="text-2xl font-medium mb-6">Review Your Order</h1>

      <ReviewSection 
        title="Contact Information"
        onEdit={() => onEdit(1)}
      >
        <p className="text-gray-700">{formData.email}</p>
        <p className="text-gray-700">{formData.phone}</p>
      </ReviewSection>

      <ReviewSection 
        title="Delivery Address"
        onEdit={() => onEdit(1)}
      >
        <p className="text-gray-700">
          {formData.firstName} {formData.lastName}
        </p>
        <p className="text-gray-700">{formData.address}</p>
        {formData.apartment && (
          <p className="text-gray-700">{formData.apartment}</p>
        )}
        <p className="text-gray-700">
          {formData.city}, {formData.state} {formData.zipCode}
        </p>
        <p className="text-gray-700">{formData.country}</p>
      </ReviewSection>

      <ReviewSection 
        title="Payment Information"
        onEdit={() => onEdit(2)}
      >
        {formData.paymentMethod === 'creditCard' && (
          <>
            <p className="text-gray-700">
              Credit/Debit Card: {formatCardNumber(formData.cardNumber)}
            </p>
            <p className="text-gray-700">Expires: {formData.cardExpiry}</p>
          </>
        )}
        {formData.paymentMethod === 'bankTransfer' && (
          <p className="text-gray-700">Bank Transfer</p>
        )}
        {formData.paymentMethod === 'paystack' && (
          <p className="text-gray-700">Paystack</p>
        )}
      </ReviewSection>

      <div className="border rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between mb-4">
            <div className="flex">
              <div className="w-12 h-12 rounded-md mr-4 bg-gray-100 relative overflow-hidden">
                <Image
                  src={item.imageUrl || item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{item.name}</h3>
                {item.size && (
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                )}
                {item.color && (
                  <p className="text-sm text-gray-500">Color: {item.color}</p>
                )}
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
            </div>
            <p className="font-medium">${item.price * item.quantity}</p>
          </div>
        ))}

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Subtotal</p>
            <p className="font-medium">${totals.subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Shipping</p>
            <p className="font-medium">${totals.shipping.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-4">
            <p className="text-gray-600">Tax</p>
            <p className="font-medium">${totals.tax.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <p>Total</p>
            <p>${totals.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewPage
