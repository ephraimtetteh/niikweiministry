"use client"

import { createContext, useContext, useState } from 'react';
import { useCart } from './CartContext';
import { toast } from 'react-hot-toast';

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [checkoutData, setCheckoutData] = useState({
    // Contact Information
    email: '',
    phone: '',
    
    // Shipping Information
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Payment Information
    paymentMethod: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    saveCard: false,
  });

  const [errors, setErrors] = useState({});

  const updateCheckoutData = (newData) => {
    setCheckoutData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const validateContactInfo = () => {
    const newErrors = {};
    
    if (!checkoutData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(checkoutData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!checkoutData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateShippingInfo = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country'];
    
    requiredFields.forEach(field => {
      if (!checkoutData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentInfo = () => {
    const newErrors = {};
    
    if (!checkoutData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
      setErrors(newErrors);
      return false;
    }
    
    if (checkoutData.paymentMethod === 'creditCard') {
      if (!checkoutData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      }
      if (!checkoutData.cardExpiry) {
        newErrors.cardExpiry = 'Expiry date is required';
      }
      if (!checkoutData.cardCvc) {
        newErrors.cardCvc = 'CVC is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processOrder = async () => {
    try {
      // In a real application, you would:
      // 1. Send the order to your backend
      // 2. Process payment through a payment gateway
      // 3. Create order in your database
      // 4. Send confirmation email
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Clear cart after successful order
      clearCart();
      
      return {
        success: true,
        orderNumber,
        message: 'Order placed successfully!'
      };
    } catch (error) {
      console.error('Error processing order:', error);
      return {
        success: false,
        message: 'Failed to process order. Please try again.'
      };
    }
  };

  const calculateTotals = () => {
    const subtotal = parseFloat(getCartTotal().replace('$', '')) || 0;
    const shipping = 5; 
    const tax = 0; 
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total
    };
  };

  return (
    <CheckoutContext.Provider
      value={{
        checkoutData,
        updateCheckoutData,
        errors,
        validateContactInfo,
        validateShippingInfo,
        validatePaymentInfo,
        processOrder,
        calculateTotals,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
