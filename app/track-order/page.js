"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { FaCheckCircle, FaTruck, FaBox } from "react-icons/fa"
import { FiPackage, FiAlertCircle } from "react-icons/fi"
import Hero from '@/public/stores/hero.png'
import Hero2 from '@/public/stores/mobile-hero.png'
import Image from 'next/image'
import Link from "next/link"
import { toast } from "react-hot-toast"

const TrackOrderPageContent = () => {
  const searchParams = useSearchParams()
  const initialOrderNumber = searchParams.get("order") || ""
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber)
  const [isTracking, setIsTracking] = useState(!!initialOrderNumber)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [orderDetails, setOrderDetails] = useState(null)

  // Mock order tracking data - In a real app, this would come from an API
  const mockTrackingData = {
    "12345": {
      status: "in_transit",
      steps: [
        {
          label: "Order Placed",
          date: "January 19, 2024 2:30 PM",
          icon: <FaCheckCircle className="w-5 h-5" />,
          status: "completed",
        },
        {
          label: "Order Confirmed",
          date: "January 19, 2024 2:35 PM",
          icon: <FaCheckCircle className="w-5 h-5" />,
          status: "completed",
        },
        {
          label: "Shipped",
          date: "January 20, 2024 10:15 AM",
          icon: <FiPackage className="w-5 h-5" />,
          status: "completed",
        },
        {
          label: "In transit",
          date: "January 20, 2024 10:15 AM",
          icon: <FiPackage className="w-5 h-5" />,
          status: "current",
        },
        {
          label: "Out for Delivery",
          date: "Pending",
          icon: <FaTruck className="w-5 h-5" />,
          status: "upcoming",
        },
        {
          label: "Delivered",
          date: "Pending",
          icon: <FaCheckCircle className="w-5 h-5" />,
          status: "upcoming",
        },
      ],
      items: [
        {
          name: "Mighty Logo T-Shirt",
          quantity: 2,
          size: "M",
          color: "Black",
          price: 29.99
        },
        {
          name: "Inspirational Mug",
          quantity: 1,
          color: "White",
          price: 19.99
        }
      ],
      shipping: {
        address: "123 Main St, Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10001",
        method: "Standard Shipping",
        estimatedDelivery: "January 23, 2024"
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!orderNumber.trim()) {
        throw new Error("Please enter an order number");
      }

      const orderData = mockTrackingData[orderNumber];
      if (!orderData) {
        throw new Error("Order not found. Please check your order number and try again.");
      }

      setOrderDetails(orderData);
      setIsTracking(true);
      toast.success("Order found!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setIsTracking(false);
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'current':
        return 'text-blue-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="w-full">
      <div className="max-[340px]:h-[90vh] max-sm:h-[50vh] md:h-[60vh] flex items-center justify-center w-full">
        <Image src={Hero} alt="hero" className="bg-cover max-lg:hidden bg-center relative w-full h-full" />
        <Image src={Hero2} alt="hero" className="bg-cover lg:hidden bg-center relative w-full h-full" />
        <div className="bg-black absolute w-full bg-opacity-20"></div>
        <div className="absolute max-md:mt-10 w-full flex flex-col gap-5 justify-center text-white px-20">
          <h1 className="text-3xl lg:text-5xl font-semibold relative">
            Track Order
            <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
          </h1>
        </div>
      </div>

      <div className="max-w-md lg:max-w-5xl mx-auto bg-white relative -top-24 p-6 rounded-md border shadow-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to track your shipment</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter your order number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="flex-1 border p-3 rounded-md"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-button px-6 py-3 text-white rounded-md disabled:bg-gray-400 transition-colors"
              >
                {loading ? "Searching..." : "Track Order"}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 mb-4">
            <FiAlertCircle />
            <p>{error}</p>
          </div>
        )}

        {isTracking && orderDetails && (
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Order #{orderNumber}</h2>
                <p className="text-sm text-gray-600">
                  Last updated: {orderDetails.steps.find(step => step.status === 'current')?.date || 'N/A'}
                </p>
              </div>

              {/* Estimated Delivery */}
              <div className="py-4 border-t border-b">
                <h3 className="text-lg font-medium mb-1">Estimated Delivery</h3>
                <p className="text-gray-600">{orderDetails.shipping.estimatedDelivery}</p>
              </div>

              {/* Tracking Timeline */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Tracking Timeline</h3>
                <div className="space-y-6">
                  {orderDetails.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`mt-1 ${getStatusColor(step.status)}`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{step.label}</p>
                        <p className="text-sm text-gray-600">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Order Details</h3>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                        {item.size && `, Size: ${item.size}`}
                        {item.color && `, Color: ${item.color}`}
                      </p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <p className="text-gray-600">
                  {orderDetails.shipping.address}<br />
                  {orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.zip}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Method: {orderDetails.shipping.method}
                </p>
              </div>
            </div>

            {/* Need Help Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, we're here to help!
              </p>
              <Link 
                href="/contact" 
                className="text-button hover:text-purple-600 font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const TrackOrderPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <TrackOrderPageContent />
  </Suspense>
)

export default TrackOrderPage;
