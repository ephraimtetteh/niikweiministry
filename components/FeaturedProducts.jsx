"use client"

import { store } from '@/constants/store';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState({});
  // Get first 3 products from the store
  const featuredProducts = store.slice(0, 3);

  const handleAddToCart = async (e, product) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    setLoading(prev => ({ ...prev, [product.id]: true }));
    
    try {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(prev => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <div className='py-10'>
      <h2 className="text-3xl font-semibold relative pb-1 mb-6" data-aos="fade-up">
        Featured Products
        <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
      </h2>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        {featuredProducts.map((item, id) => (
          <Link href={`/store/${id}`} key={id}>
            <div className='flex flex-col gap-2 shadow-xl pb-4 rounded-md transition duration-300 hover:shadow-2xl' data-aos="zoom-in">
              <Image src={item.images} alt={item.name} className='rounded-t-md'/>
              <div className='flex flex-col gap-1 px-4'>
                <p>{item.category}</p>
                <p className='text-xl font-semibold'>{item.name}</p>
                <p className='text-purple-500 text-medium'>GH₵{item.price.toFixed(2)}</p>
              </div>
              <button 
                onClick={(e) => handleAddToCart(e, item)}
                disabled={loading[item.id]}
                className='border border-button py-2 rounded-md text-button mx-4 hover:bg-button hover:text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading[item.id] ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/store" className='max-md:w-full'>
          <button className="bg-button text-white py-3 px-8 rounded-lg hover:bg-purple-600 transition duration-300 max-lg:w-full">
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProducts;