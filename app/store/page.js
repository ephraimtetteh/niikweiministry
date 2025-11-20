"use client"

import React, {useEffect} from 'react'
import Hero from '@/public/stores/hero.png'
import Hero2 from '@/public/stores/mobile-hero.png'
import Banner from '@/public/stores/banner.png'
import Image from 'next/image'
import { category } from '@/constants/store'
import StoreCard from './_component/StoreCard'
import AOS from 'aos';
import 'aos/dist/aos.css';

const page = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-linear",
      once: false,
    });
  }, []);

  return (
    <div>
        <div className="max-[340px]:h-[90vh] max-sm:h-[70vh] md:h-[90vh] flex items-center justify-center w-full">
            <Image src={Hero} alt='hero' className="bg-cover max-lg:hidden bg-center relative w-full h-full" />
            <Image src={Hero2} alt='hero' className="bg-cover bg-center lg:hidden relative w-full h-full" />
            <div className='bg-black absolute w-full bg-opacity-20'></div>
            <div className='absolute max-md:mt-10 w-full flex flex-col gap-5 justify-center text-white px-6 lg:px-20'>
              <div className="w-full flex flex-col gap-5 justify-center text-white">
                <p className="text-lg relative pb-1" data-aos="slide-right" data-aos-delay="100">
                  Shop
                  <span className="absolute left-0 bottom-0 w-10 h-1 bg-violet-500"></span>
                </p>
                <h1 className='text-3xl lg:text-5xl font-semibold lg:w-[65%] leading-tight' data-aos="slide-right" data-aos-delay="300">Shop Nii Kwei Ministry Merchandise</h1>
                <p className='lg:w-[60%]' data-aos="slide-right" data-aos-delay="500">Explore our collection of ministry-branded apparel, accessories, and digital products. Every purchase supports our mission to transform lives through worship and service</p>
              </div>
              <div className="flex items-center gap-6">
                <button className="bg-button border border-button py-2 px-6 text-lg rounded-md max-lg:w-full" data-aos="zoom-in">Shop Now</button>
              </div>
            </div>
        </div>
        <div className="h-20 flex items-center justify-center w-full">
            <Image src={Banner} alt='hero' className="bg-cover bg-center relative w-full h-full" />
            <div className='bg-black absolute w-full bg-opacity-20'></div>
            <div className='absolute w-full flex flex-col items-center gap-5 justify-center text-white px-6 lg:px-20' data-aos="zoom-in">
                <p className='absolute text-white lg:text-xl text-center'>First-time shopper? Get 10% off your order with code WELCOME10</p>
            </div>
        </div>
        <div className="py-10 px-6 lg:px-20 flex flex-col gap-6">
            <h1 className="text-3xl font-semibold relative pb-1" data-aos="fade-up">
              Categories
              <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
            </h1>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {category.map((item, id) => {
                    return (
                        <div key={id} className='relative rounded-md' data-aos="zoom-in">
                            <Image src={item.image} alt="category" className='object-cover rounded-md'/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 opacity-100 hover:opacity-0"></div>
                            <div className="absolute bottom-0 left-0 p-2 md:p-4 text-white">
                                <h3 className="text-xl font-semibold">{item.category}</h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
        <div className="py-10 px-6 lg:px-20">
            <h1 className="text-3xl font-semibold relative pb-1" data-aos="fade-up">
              New Arrivals
              <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
            </h1>
            <StoreCard />
        </div>
    </div>
  )
}

export default page