"use client"

import Image from 'next/image'
import React, { useEffect } from 'react'
import Hero from '@/public/donate/hero.png'
import Hero2 from '@/public/mobile-contact.png'
import Banner from '@/public/donate/banner.png'
import { give, impact } from '@/constants/donation'
import DonationForm from './_component/DonationForm'
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
        <div className="max-[340px]:h-[90vh] max-sm:h-[70vh] md:h-[100vh] flex items-center justify-center w-full">
            <Image placeholder='blur' src={Hero} alt='hero' className="bg-cover max-lg:hidden bg-center relative w-full h-full" />
            <Image placeholder='blur' src={Hero2} alt='hero' className="bg-cover bg-center lg:hidden relative w-full h-full" />
            <div className='bg-black absolute w-full bg-opacity-20'></div>
            <div className='absolute max-md:mt-10 w-full flex flex-col gap-5 justify-center text-white px-6 lg:px-20'>
              <div className="w-full flex flex-col gap-5 justify-center text-white">
                <p className="lg:text-lg relative pb-1" data-aos="slide-right" data-aos-delay="100">
                  Donation
                  <span className="absolute left-0 bottom-0 w-10 h-1 bg-violet-500"></span>
                </p>
                <h1 className='text-3xl lg:text-5xl font-semibold w-full lg:w-[55%] leading-tight' data-aos="slide-right" data-aos-delay="300">Partner With Us To Transform Lives</h1>
                <p className='lg:w-[57%]' data-aos="slide-right" data-aos-delay="500">Your generosity helps us spread the Gospel, serve communities, and empower believers worldwide.</p>
              </div>
              <div className="flex items-center gap-6" data-aos="zoom-in">
                <button className="bg-button max-lg:w-full border border-button py-2 px-6 text-lg rounded-md">Donate Now</button>
              </div>
            </div>
        </div>
        <div className="h-[160vh] lg:h-[55vh] flex items-center justify-center w-full">
            <Image placeholder='blur' src={Banner} alt='hero' className="bg-cover bg-center relative w-full h-full" />
            <div className='bg-black absolute w-full bg-opacity-20'></div>
            <div className='absolute max-md:mt-10 w-full flex flex-col gap-5 justify-center text-white px-6 lg:px-20'>
                <h1 className="text-3xl font-semibold relative pb-1 lg:py-10" data-aos="fade-up">
                    Your Impact
                    <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
                </h1>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                    {impact.map((item, id) => {
                        return (
                            <div key={id} className='flex flex-col gap-3 items-center text-black bg-white p-4 rounded-md' data-aos="zoom-in">
                                <Image placeholder='blur' src={item.image} alt="family" className='w-24' />
                                <h1 className='text-xl font-semibold'>{item.number}</h1>
                                <p className='text-center text-sm'>{item.text}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
        <div className='px-6 lg:px-16'>
            <DonationForm />
        </div>
        <div className="h-[120vh] lg:h-[75vh] flex items-center justify-center w-full">
            <Image placeholder='blur' src={Banner} alt='hero' className="bg-cover bg-center relative w-full h-full" />
            <div className='bg-black absolute w-full bg-opacity-20'></div>
            <div className='absolute  w-full flex flex-col gap-5 justify-center text-white px-6 lg:px-20'>
                <h1 className="text-3xl font-semibold relative pb-1 py-10"  data-aos="fade-up">
                    Why Give?
                    <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
                </h1>
                <p data-aos="zoom-in">Your support enables us to:</p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {give.map((item, id) => {
                        return (
                            <div key={id} className='flex flex-col items-center text-black bg-white p-4 rounded-md'  data-aos="zoom-in">
                                <Image placeholder='blur' src={item.image} alt="family" className='w-24' />
                                <p className='text-sm text-center'>{item.text}</p>
                            </div>
                        )
                    })}
                </div>
                <div className='flex flex-col gap-3 w-full items-center' data-aos="zoom-in">
                    <p>Every gifts, no matter the size, makes the difference</p>
                    <button className="bg-button border border-white py-2 px-6 text-lg rounded-md text-white w-fit">Read More</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default page