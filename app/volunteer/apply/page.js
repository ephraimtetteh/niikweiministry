"use client"

import React, {useEffect} from 'react'
import { expect } from '@/constants/volunteer'
import Banner from '@/public/banner.png'
import Expect from '@/public/volunteer/expect.png'
import Hero from '@/public/volunteer/hero2.png'
import Image from 'next/image'
import Link from 'next/link'
import Volunteer from './_component/Volunteer'
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
        <div className="max-[340px]:h-[90vh] max-sm:h-[60vh] md:h-[70vh] flex items-center justify-center w-full">
            <Image src={Hero} alt='hero' className="bg-cover bg-center relative w-full h-full" />
            <div className='bg-black absolute w-full bg-opacity-20'></div>
            <div className='absolute max-md:mt-10 w-full flex flex-col gap-5 justify-center text-white px-6 lg:px-20'>
              <div className="w-full flex flex-col gap-5 justify-center text-white">
                <h1 className='text-3xl lg:text-5xl font-semibold w-full lg:w-[55%] leading-tight' data-aos="slide-right" data-aos-delay="100">Apply to Volunteer with Nii Kwei Ministries</h1>
                <p className='lg:w-[57%]' data-aos="slide-right" data-aos-delay="300">Your generosity helps us spread the Gospel, serve communities, and empower believers worldwide.</p>
              </div>
            </div>
        </div>
        <div className='px-6 lg:px-20 w-full'>
            <Volunteer />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 items-center gap-10 px-6 lg:px-20 py-16'>
            <div className='max-lg:order-2 ' data-aos="slide-right">
              <Image src={Expect} alt="expect" width={700} height={500} />
            </div>
            <div className='flex flex-col gap-4'>
                <h1 className="text-3xl font-semibold relative pb-1" data-aos="fade-up">
                How to Get Started
                <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
                </h1>
                <div className='flex flex-col gap-5 py-4'>
                    {expect.map((item, id) => {
                        return(
                            <div key={id} className='flex items-center gap-4' data-aos="slide-left">
                                <p className='py-4 px-8 flex items-center justify-center rounded-md bg-purple-500 text-white text-2xl font-bold'>{item.number}</p>
                                <p className='flex-wrap flex'>{item.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
        <div className="flex max-lg:h-[40vh] items-center justify-center w-full">
            <Image src={Banner} alt='banner' className="bg-cover bg-center relative w-full h-full" />
            <div className='bg-black absolute w-full bg-opacity-20'></div>
            <div className='absolute max-md:mt-10 w-full flex flex-col gap-5 items-center justify-center text-white px-6 lg:px-20'>
              <h1 className='text-3xl lg:text-5xl font-semibold lg:w-[50%] text-center leading-none' data-aos="zoom-in" data-aos-delay="100">Have Questions About Volunteering?</h1>
              <p className='lg:w-[60%] text-center' data-aos="zoom-in" data-aos-delay="300">We are here to help! Contact us for more details</p>
              <div className='flex items-center gap-8' data-aos="zoom-in" data-aos-delay="500">
                <Link href='/contact' className="bg-button border text-white border-button py-2 px-8 text-lg rounded-md">Contact Us</Link>
              </div>
            </div>
        </div>
    </div>
  )
}

export default page