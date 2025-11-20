"use client"

import Book from '@/public/BookIcon.png';
import Download from '@/public/Download.png';
import Music from '@/public/MusicIcon.png';
import Flyer1 from '@/public/events/flyer1.jpg'
import Flyer2 from '@/public/events/flyer2.jpg'
import Flyer3 from '@/public/events/flyer3.jpg'
import Flyer4 from '@/public/events/flyer4.jpg'
import Hero from '@/public/EventBackground.png';
import Hero5 from '@/public/mobile-home.png';
import Image from 'next/image';
import Gallery from '../about/_component/gallery';
import Link from 'next/link';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PastEvent from '@/components/PastEvent';
import EventCard from '@/components/EventCard';


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
      <div className="lg:h-[95vh] h-[80vh] flex items-center justify-center w-full">
            {/* <Image src={Hero} alt='hero' className="lg:object-cover max-lg:hidden object-fill bg-c bg-center relative w-full h-full" />
            <Image src={Hero5} alt='hero' className="lg:object-cover lg:hidden object-fill bg-c bg-center relative w-full h-full" /> */}
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              width="600" 
              className="lg:object-cover object-fill bg-cover bg-center relative w-full h-full">
              <source src="/videos/video2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className='bg-black absolute w-full bg-opacity-20'></div>
            <div className='absolute max-md:mt-10 w-full flex flex-col gap-5 justify-center text-white px-6 lg:px-20'>
              <div className="w-full flex flex-col gap-5 justify-center text-white">
                <p className="lg:text-lg relative pb-1" data-aos="slide-right" data-aos-delay="100">
                  Welcome to Nii Kwei Ministries
                  <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500"></span>
                </p>
                <h1 className='text-4xl lg:text-5xl font-semibold lg:w-[70%] leading-tight' data-aos="slide-right" data-aos-delay="300">Experience the Power of Worship and the Word</h1>
                <p className='lg:w-[60%]' data-aos="slide-right" data-aos-delay="500">Access sermons, worship sessions, and memorable moments from Nii Kwei Ministry.</p>
              </div>
              <div className="flex max-md:w-full flex-col lg:flex-row items-center lg:gap-6 gap-3" data-aos="zoom-in">
                <Link href="" className='max-md:w-full'>
                  <button className="bg-button w-full border border-button py-2 px-6 text-lg rounded-md hover:bg-purple-600 transition duration-300">
                    Visit Our Channel
                  </button>
                </Link>
                <button className="border max-md:w-full border-white py-2 px-6 text-lg rounded-md">View Gallery</button>
              </div>
            </div>
        </div>

      {/*Video Section..........................................................................*/}

      <div className="py-10 px-6 lg:px-20 lg:text-center lg:mt-20">
        {/* Section Title */}
        <h2 className="text-3xl font-semibold" data-aos="fade-up">
          Latest Content
          <div className="w-16 h-1 bg-violet-500 lg:mx-auto mt-2 "></div>
        </h2>

        {/* Content Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" data-aos="zoom-in">
            <video controls width="600" className="rounded-t-xl shadow-lg">
              <source src="/videos/video2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="p-4">
              <h3 className="text-lg font-semibold">The Power of Faith</h3>
              <p className="text-gray-600">Sermon</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" data-aos="zoom-in">
            <video controls width="600" className="rounded-t-xl shadow-lg">
              <source src="/videos/video2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="p-4">
              <h3 className="text-lg font-semibold">Living With Purpose</h3>
              <p className="text-gray-600">Sermon</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" data-aos="zoom-in">
            <video controls width="600" className="rounded-xl shadow-lg">
              <source src="/videos/video3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="p-4">
              <h3 className="text-lg font-semibold">
                Praise and Worship Night
              </h3>
              <p className="text-gray-600">Worship</p>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-8">
          <button className="bg-button text-white px-6 py-2 rounded-lg hover:bg-teal-600 max-lg:w-full">
            View All
          </button>
        </div>
      </div>

      {/* <div className='w-full'>
        <div className='flex flex-col items-center text-2xl md:text-3xl font-semibold'>
          <h1 data-aos="fade-down" data-aos-duration="2000" className='text-purple'>Upcoming Events</h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 py-10 px-4 lg:mx-16 place-items-center'>
          <Image data-aos="flip-right" data-aos-duration="1500" src={Flyer4} alt="" className='w-[400px] h-full border-2 border-orange rounded-lg'/>
          <Image data-aos="zoom-in" data-aos-duration="1500" src={Flyer1} alt="" className='w-[400px] h-full border-2 border-orange rounded-lg'/>
          <Image data-aos="flip-left" data-aos-duration="1500" src={Flyer2} alt="" className='w-[400px] h-full border-2 border-orange rounded-lg'/>
        </div>
      </div> */}

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

      {/*the Gallery section */}
      <div>
        <Gallery />
      </div>



      {/*THE RESOURCE SECTION*/}


<div className="py-10 px-6 lg:px-20">
  {/* Section Title */}
  <h2 className="text-3xl font-semibold text-gray-800" data-aos="fade-up">
    Resources
    <div className="w-16 h-1 bg-violet-500 mt-2"></div>
  </h2>

  {/* Resource Cards */}
  <div className="mt-8 flex flex-col gap-4">
    {/* Resource 1 */}
    <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 border border-gray-300" data-aos="zoom-in">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <Image
          src={Book} 
          alt="PDF Icon"
          width={40}
          height={40}
        />
        {/* Text Content */}
        <div>
          <h3 className="text-lg font-semibold">Daily Devotional Guide</h3>
          <p className="text-sm text-gray-500">PDF Guide</p>
        </div>
      </div>
      {/* Download Button */}
      <button>
        <Image
          src={Download} 
          alt="Download Icon"
          width={50}
          height={50}
        />
      </button>
    </div>

    {/* Resource 2 */}
    <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 border border-gray-300" data-aos="zoom-in">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <Image
          src={Book} 
          alt="Book Icon"
          width={40}
          height={40}
        />
        {/* Text Content */}
        <div>
          <h3 className="text-lg font-semibold">Sermon Notes: The Power of Faith</h3>
          <p className="text-sm text-gray-500">Study Material</p>
        </div>
      </div>
      {/* Download Button */}
      <button>
        <Image
          src={Download}
          alt="Download Icon"
          width={50}
          height={50}
        />
      </button>
    </div>

    {/* Resource 3 */}
    <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 border border-gray-300" data-aos="zoom-in">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <Image
          src={Music} 
          alt="Music Icon"
          width={40}
          height={40}
        />
        {/* Text Content */}
        <div>
          <h3 className="text-lg font-semibold">Worship Album: Live in Accra</h3>
          <p className="text-sm text-gray-500">Audio</p>
        </div>
      </div>
      {/* Download Button */}
      <button>
        <Image
          src={Download}
          alt="Download Icon"
          width={50}
          height={50}
        />
      </button>
    </div>
  </div>
</div>
    </div>
  );
}

export default page