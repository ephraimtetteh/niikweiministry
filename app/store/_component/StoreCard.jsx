"use client"

import { store } from '@/constants/store'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

const StoreCard = () => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState({});

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(prev => ({ ...prev, [product.id]: true }));
    
    try {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(prev => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-6'>
      {store.map((item, id) => {
        return (
          <Link href={`/store/${id}`} key={id}>
            <div className='flex flex-col gap-2 shadow-xl pb-4 rounded-md transition duration-300 hover:shadow-2xl' data-aos="zoom-in">
              <Image src={item.images} alt={item.name} className='rounded-t-md'/>
              <div className='flex flex-col gap-1 px-4'>
                <p>{item.category}</p>
                <p className='text-xl font-semibold'>{item.name}</p>
                <p className='text-purple-500 text-medium'>${item.price}.00</p>
              </div>
              <button 
                onClick={(e) => handleAddToCart(e, { ...item, id })}
                disabled={loading[id]}
                className='border border-button py-2 rounded-md text-button mx-4 hover:bg-button hover:text-white transition duration-300'
              >
                {loading[id] ? 'Adding...' : 'Add to cart'}
              </button>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default StoreCard