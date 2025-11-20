"use client"

import Link from "next/link";
import React, { useState } from "react";
import { BsCheckCircle } from "react-icons/bs"
import { useCart } from "@/context/CartContext";
import Image from "next/image";

const OrderConfirmation = ({ orderNumber, formData }) => {
  const { cartItems, getCartTotal } = useCart();
  const [showInvoice, setShowInvoice] = useState(false);
  
  const orderDate = new Date();
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(orderDate.getDate() + 7);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTotals = () => {
    const subtotal = parseFloat(getCartTotal()) || 0;
    const shipping = 5;
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + shipping + tax;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const totals = calculateTotals();

  // const handlePrintInvoice = () => {
  //   const printWindow = window.open('', '_blank');
  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Invoice - Order #${orderNumber}</title>
  //         <style>
  //           body { font-family: Arial, sans-serif; padding: 20px; }
  //           .header { text-align: center; margin-bottom: 30px; }
  //           .details { margin-bottom: 30px; }
  //           .items { margin-bottom: 30px; }
  //           .item { margin-bottom: 10px; }
  //           .totals { text-align: right; }
  //           table { width: 100%; border-collapse: collapse; }
  //           th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="header">
  //           <h1>Invoice</h1>
  //           <p>Order #${orderNumber}</p>
  //           <p>Date: ${formatDate(orderDate)}</p>
  //         </div>
  //         <div class="details">
  //           <h2>Billing Details</h2>
  //           <p>${formData.firstName} ${formData.lastName}</p>
  //           <p>${formData.address}</p>
  //           <p>${formData.city}, ${formData.state} ${formData.zipCode}</p>
  //           <p>${formData.country}</p>
  //           <p>Email: ${formData.email}</p>
  //           <p>Phone: ${formData.phone}</p>
  //         </div>
  //         <div class="items">
  //           <h2>Items</h2>
  //           <table>
  //             <thead>
  //               <tr>
  //                 <th>Item</th>
  //                 <th>Quantity</th>
  //                 <th>Price</th>
  //                 <th>Total</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               ${cartItems.map(item => `
  //                 <tr>
  //                   <td>${item.name}</td>
  //                   <td>${item.quantity}</td>
  //                   <td>$${item.price}</td>
  //                   <td>$${(item.price * item.quantity).toFixed(2)}</td>
  //                 </tr>
  //               `).join('')}
  //             </tbody>
  //           </table>
  //         </div>
  //         <div class="totals">
  //           <p>Subtotal: $${totals.subtotal}</p>
  //           <p>Shipping: $${totals.shipping}</p>
  //           <p>Tax: $${totals.tax}</p>
  //           <h3>Total: $${totals.total}</h3>
  //         </div>
  //       </body>
  //     </html>
  //   `);
  //   printWindow.document.close();
  //   printWindow.print();
  // };

  return (
    <div className="max-w-3xl mx-auto border rounded-lg shadow-md p-6 bg-white -mt-24">
      {/* Header */}
      <div className="text-center mb-6 flex flex-col gap-2 items-center">
        <BsCheckCircle className="w-16 h-16 text-purple-500" />
        <h1 className="text-3xl font-bold text-purple-500">Thank You for Your Order!</h1>
        <p className="text-gray-500">
          Order confirmation has been sent to <span className="font-medium">{formData.email}</span>
        </p>
      </div>

      {/* Order Details */}
      <div className="rounded-lg p-4 mb-6 flex flex-col gap-8 bg-gray-50">
        <div className="">
          <div className="flex justify-between">
            <p className="text-xl">Order# <span className="font-medium">{orderNumber}</span></p>
            <button
              className="text-blue-600 text-sm font-medium border p-2"
            >
              View Invoice
            </button>
          </div>
          <p className="text-sm text-gray-500">Placed on: <span className="font-medium">{formatDate(orderDate)}</span></p>
        </div>
        <div>
          <p className="text-xl">Estimated Delivery:</p>
          <p className="font-medium text-gray-500 text-sm">{formatDate(estimatedDelivery)}</p>
        </div>
        <div>
          <p className="text-xl">Confirmation Sent To:</p>
          <p className="font-medium text-sm text-gray-500">{formData.email}</p>
        </div>
        <div>
          <p className="text-xl">Order Date:</p>
          <p className="font-medium text-sm text-gray-500">{formatDate(orderDate)}</p>
        </div>
      </div>

      {/* Order Summary */}
      {/* <div className="border rounded-lg p-4">
        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-4">
            <div className="flex">
              <div className="w-16 h-16 rounded-md mr-4 relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
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
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-4">
          <div className="flex justify-between text-gray-500 mb-2">
            <span className="text-xl">Subtotal</span>
            <span>${totals.subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-500 mb-2">
            <span className="text-xl">Shipping</span>
            <span>${totals.shipping}</span>
          </div>
          <div className="flex justify-between text-gray-500 mb-4">
            <span className="text-xl">Tax</span>
            <span>${totals.tax}</span>
          </div>
          <hr className="py-3" />
          <div className="flex justify-between font-semibold text-xl">
            <span className="text-xl">Total</span>
            <span>${totals.total}</span>
          </div>
        </div>
      </div> */}

      {/* Buttons */}
      <div className="mt-6 flex flex-col w-full gap-2">
        <Link href={`/track-order?order=${orderNumber}`}>
          <button className="border w-full text-gray-700 font-medium py-2 px-4 rounded">
            Track Order
          </button>
        </Link>
        <Link href="/store">
          <button className="bg-button w-full text-white font-medium py-2 px-4 rounded">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;