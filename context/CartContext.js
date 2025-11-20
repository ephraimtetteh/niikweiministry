"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import {
  initializeCart,
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateQuantity as updateQuantityUtil,
  clearCart as clearCartUtil,
  calculateTotal,
  formatPrice
} from '../utils/shoppingCart';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCart = initializeCart();
    setCartItems(savedCart);
  }, []);

  const addToCart = (product, quantity = 1, size) => {
    const updatedCart = addToCartUtil({
      ...product,
      size,
    }, quantity);
    setCartItems(updatedCart);
  };

  const removeFromCart = (productId, size) => {
    const itemToRemove = cartItems.find(
      item => item.id === productId && (!size || item.size === size)
    );
    if (itemToRemove) {
      const updatedCart = removeFromCartUtil(itemToRemove.id);
      setCartItems(updatedCart);
    }
  };

  const updateQuantity = (productId, quantity, size) => {
    const itemToUpdate = cartItems.find(
      item => item.id === productId && (!size || item.size === size)
    );
    if (itemToUpdate) {
      const updatedCart = updateQuantityUtil(itemToUpdate.id, quantity);
      setCartItems(updatedCart);
    }
  };

  const clearCart = () => {
    const emptyCart = clearCartUtil();
    setCartItems(emptyCart);
  };

  const getCartTotal = () => {
    return formatPrice(calculateTotal(cartItems));
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}