"use client"

import React, { useEffect, useState } from 'react'
import Hero from '@/public/Home-hero.png'
import Hero3 from '@/public/hero3.jpg'
import Hero4 from '@/public/hero4.jpg'
import Hero5 from '@/public/hero5.jpg'
import Hero6 from '@/public/hero6.jpg'
import Hero8 from '@/public/hero8.jpg'
import HeroUpdated from '@/public/nii-hero-home.jpg'
import Hero2 from '@/public/mobile-home.png'
import About from '@/public/about.png'
import Deco from '@/public/decor.png'
import Banner from '@/public/banner.png'
import Banner2 from '@/public/mobile-banner.png'
import Image from 'next/image'
import EventCard from '@/components/EventCard'
import StoreCard from './store/_component/StoreCard'
import SermonCard from '@/components/SermonCard'
import FeaturedProducts from '@/components/FeaturedProducts'
import Link from 'next/link'
import AOS from 'aos'
import "aos/dist/aos.css";
import PastEvent from '@/components/PastEvent'

const page = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-linear",
      once: false,
    });
  }, []);

  const images = [
    HeroUpdated, Hero8, Hero6, Hero3, Hero4, Hero5
 ];

 const [currentImageIndex, setCurrentImageIndex] = useState(0);


 useEffect(() => {
   const intervalId = setInterval(() => {
     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
   }, 5000);
   return () => clearInterval(intervalId);
 }, [images.length]);

  return (
    <div>
      <div className="h-[100vh] flex items-center justify-center w-full overflow-x-hidden">
            <Image src={images[currentImageIndex]} alt='hero' className="lg:object-cover max-lg:hidden object-fill bg-c bg-center relative w-full h-full" />
            <Image src={Hero2} alt='hero' className="lg:object-cover lg:hidden object-fill bg-c bg-center relative w-full h-full" />
            <div className='bg-black absolute w-full bg-opacity-20'></div>
            <div className='absolute max-md:mt-10 w-full flex flex-col gap-5 justify-center text-white px-6 lg:px-32'>
              <div className="w-full flex flex-col gap-5 justify-center text-white">
                <p className="lg:text-lg relative pb-1" data-aos="slide-right" data-aos-delay="100">
                  Welcome to Nii Kwei Ministries
                  <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
                </p>
                <h1 className='text-4xl lg:text-6xl font-semibold lg:w-[50%] leading-tight text-violet-500/50' data-aos="slide-right" data-aos-delay="300">
                  Transforming Lives Through Worship and Service.
                </h1>
                <p className='lg:w-[60%]' data-aos="slide-right" data-aos-delay="500">
                  Join us as we build a vibrant community rooted in faith, hope, and love. Explore our inspiring resources, including devotionals, apparel, and more, to support your spiritual journey.
                </p>
              </div>
              <div className="flex max-md:w-full flex-col lg:flex-row items-center lg:gap-6 gap-3" data-aos="zoom-out">
                <Link href="/book" className='max-lg:w-full'>
                  <button className="bg-button w-full border border-button py-2 px-12 text-lg rounded-md hover:bg-purple-600 transition duration-300">
                    Book Now
                  </button>
                </Link>
                {/* <Link href='/store' className="max-lg:w-full">
                  <button className="border w-full border-white py-2 px-6 text-lg rounded-md">Shop Here</button>
                </Link> */}
              </div>
            </div>
        </div>

        {/* ================== About Us */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:px-20 px-6 py-10">
          <div className="order-2 lg:order-1" data-aos="fade-right">
            <Image src={About} alt="about" />
          </div>
          <div className="order-1 lg:order-2" data-aos="fade-left">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-semibold relative pb-1">
                About Nii Kwei Ministries
                <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
              </h1>
              <p className='text-lg'>We are a dynamic ministry dedicated to spreading the gospel through worship, outreach, and community service. Our mission is to transform lives and make a lasting impact in our community and beyond.</p>
              <Link href='/about' className="bg-button border border-button py-2 px-6 text-lg rounded-md hover:bg-purple-500 duration-300 ease-linear text-white text-center lg:w-fit">Read More</Link>
            </div>
          </div>
        </div>


        {/* ============== events  */}
        <div className='flex flex-col lg:items-center py-6 px-6'>
          <h1 className="text-3xl font-semibold relative pb-1" data-aos="fade-up">
            Upcoming Events
            <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
          </h1>
          <EventCard/>
          <Link href='/event'>
            <button className='text-button max-lg:text-center max-lg:w-full'>View All Events {">"}</button>
          </Link>
        </div>

        <div className='flex flex-col lg:items-center py-6 px-6'>
          <h1 className="text-3xl font-semibold relative pb-1" data-aos="fade-up">
            Past Events & Releases
            <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
          </h1>
          <PastEvent/>
          <Link href='/event'>
            <button className='text-button max-lg:text-center max-lg:w-full'>View All Events {">"}</button>
          </Link>
        </div>


        {/* ============== Video */}
        <div className='relative'>
          <Image src={Deco} alt="deco" className='absolute top-0 left-0 lg:w-48 w-28'/>
          <div className='flex flex-col gap-4 lg:items-center w-full h-full py-24 px-6 lg:px-16'>
            <h1 className="text-3xl font-semibold relative pb-1" data-aos="fade-up">
              Our Videos
              <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
            </h1>
            <SermonCard />
          </div>
        </div>



        {/* ================= featured Products */}
        <div className='flex flex-col gap-4 px-6 lg:px-16 py-10 w-full items-center'>
          <FeaturedProducts />
        </div>





        {/* ================== Cta  */}

        <div className="flex items-center justify-center w-full max-lg:h-[40vh]">
            <Image src={Banner} alt='banner' className="bg-cover max-lg:hidden bg-center relative w-full h-full" />
            <Image src={Banner2} alt='banner' className="bg-cover lg:hidden bg-center relative w-full h-full" />
            <div className='bg-black absolute w-full bg-opacity-20'></div>
            <div className='absolute max-md:mt-10 w-full flex flex-col gap-5 items-center justify-center text-white px-6 lg:px-20'>
              <h1 className='text-3xl lg:text-5xl font-semibold lg:w-[40%] text-center leading-none' data-aos="zoom-in">Get Involved And Make A Difference</h1>
              <p className='lg:w-[60%] text-center max-lg:text-sm' data-aos="zoom-in">Join our community of passionate volunteers and help us transform lives through service and worship.</p>
              <Link href='/volunteer' className="bg-button border text-white border-button py-2 px-8 text-lg rounded-md hover:bg-purple-500 duration-300 ease-linear" data-aos="zoom-in">Volunteer</Link>
            </div>
        </div>
        {/* <div className='flex flex-col gap-6 lg:items-center py-12 px-6 lg:px-16'>
          <h1 className="text-3xl font-semibold relative pb-1" data-aos="fade-up">
            Where We Are Located
            <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
          </h1>
          <iframe className='w-full rounded-md' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.6260413691666!2d-0.1759250258576224!3d5.622100294358928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b13b0062aad%3A0x75de9717e31b2442!2sAccra%20Mall!5e0!3m2!1sen!2sgh!4v1737340962099!5m2!1sen!2sgh" width={1100} height={450} style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div> */}
    </div>
  )
}

export default page