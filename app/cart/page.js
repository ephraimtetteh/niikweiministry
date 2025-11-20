"use client"

import { useCart } from '@/context/CartContext'
import Hero from '@/public/stores/hero.png'
import Hero2 from '@/public/stores/mobile-hero.png'
import Image from 'next/image'
import Link from 'next/link'
import { FiPhoneCall } from "react-icons/fi"
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }
    updateQuantity(item.id, newQuantity);
    toast.success('Cart updated');
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.id);
    toast.success('Item removed from cart');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div className="max-[340px]:h-[90vh] max-sm:h-[60vh] md:h-[60vh] flex items-center justify-center w-full">
        <Image src={Hero} alt='hero' className="bg-cover max-lg:hidden bg-center relative w-full h-full" />
        <Image src={Hero2} alt='hero' className="bg-cover lg:hidden bg-center relative w-full h-full" />
        <div className='bg-black absolute w-full bg-opacity-20'></div>
        <div className='absolute max-md:mt-10 w-full flex flex-col gap-5 justify-center text-white px-6 lg:px-20'>
          <div className="w-full flex flex-col gap-5 justify-center text-white">
            <h1 className='text-3xl lg:text-5xl font-semibold w-[65%] leading-tight relative'>
              Shopping Cart
              <span className="absolute left-0 bottom-0 w-40 h-1 bg-violet-500"></span>
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full px-6 lg:px-20 relative -top-20 flex flex-col gap-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border p-8 shadow-md bg-white rounded-md">
            <p className="text-xl">Your cart is empty</p>
            <Link href="/store">
              <button className="bg-button text-white py-2 px-6 rounded-md hover:bg-purple-600 transition duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-8 border p-6 shadow-md bg-white rounded-md">
              <div className="flex flex-col gap-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.size && <p className="text-sm text-gray-500">Size {item.size}</p>}
                      <div className="mt-1 flex items-center gap-2">
                        <button 
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="h-6 w-6 border p-2 rounded flex items-center"
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="h-6 w-6 border p-2 rounded flex items-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        onClick={() => handleRemoveItem(item)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input type="text" placeholder="Enter promo code" className="max-w-[240px] border p-3 rounded-md" />
                <button className="border p-3 rounded-md">Apply</button>
              </div>
            </div>

            <div className="p-6 border rounded-md bg-white shadow-md flex flex-col gap-6">
              <h2 className="font-semibold text-2xl">Order Summary</h2>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-lg">Subtotal</span>
                  <span>{getCartTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-lg">Shipping</span>
                  <span>$5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-lg">Tax</span>
                  <span>$0</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <span className='text-xl font-semibold'>Total</span>
                  <span className='text-xl font-semibold'>{getCartTotal()}</span>
                </div>
              </div>
              
                <div className="flex items-center gap-6">
                  <Link href="tel:+233558861040">
                    <div className='flex border p-3 rounded border-button'>
                      <FiPhoneCall className='text-2xl text-button'/>
                    </div>
                  </Link>
                  <Link href="/checkout" className='w-full'>
                    <button className="w-full bg-button p-3 rounded-md text-white">Checkout</button>
                  </Link>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage