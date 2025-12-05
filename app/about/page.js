"use client"

import Hero from '@/public/Background.png';
import Hero8 from '@/public/hero8.jpg';
import Singer1 from '@/public/Image1.png';
import Singer2 from '@/public/Image2.png';
import Banner from '@/public/banner.png';
import Hero2 from '@/public/mobile-about.png';
import Banner2 from '@/public/mobile-banner.png';
import Worship from '@/public/worship.png';
import { useEffect } from 'react';
// import Founder2 from '@/public/Image2.png';
// import Founder3 from '@/public/Image3.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import RotatingImage from './_component/RotatingImage';
import Gallery from './_component/gallery';
import TeamSection from './_component/team';
import Values from './_component/values';


const Do = [
  {info: "Spread the Gospel through Spirit-led worship and outreach"},
  {info: "Raise strong Christian leaders who influence society positively"},
  {info: "Lead believers into deeper encounters with God through worship"},
  {info: "Provide mentorship and opportunities for spiritual growth"},
  {info: "Serve communities through outreach and acts of love"}
]

const worship = [
  {info: "Create a powerful atmosphere of God's presence"},
  {info: "Encourage believers to worship in spirit and in truth"},
  {info: "Use music as a tool for healing, breakthrough, and transformation"}
]

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
      <div className="md:h-[60vh] h-[50vh] flex items-center justify-center w-full relative font-sans">
        <Image
          src={Hero}
          alt="hero section for about page"
          className="bg-cover max-lg:hidden bg-center absolute w-full h-full"
        />
        <Image
          src={Hero2}
          alt="hero section for about page"
          className="bg-cover lg:hidden bg-center absolute w-full h-full"
        />
        <div className="absolute bottom-20 flex items-center justify-start px-6 lg:px-20">
          <div
            className="text-white flex flex-col items-start"
            data-aos="fade-right"
          >
            <h1 className="text-4xl lg:text-5xl font-bold relative pb-1">
              About Us
              <span className="absolute left-0 bottom-0 w-[50%] h-1 bg-violet-500"></span>
            </h1>
            <p className="md:text-xl mt-4">
              Who we are and What we do
            </p>
          </div>
        </div>
      </div>

       {/* the Vision and Mission Section */}

      <div className="lg:py-10 flex flex-col gap-10 lg:px-20 px-6">
        <div className='py-10 flex flex-col gap-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 items-center gap-10 mt-10 lg:mt-20'>
          <Image src={Singer2} alt="Singer Nii Kwei" width={700} height={500} className="max-lg:order-2" data-aos="fade-right"/>
            <div className="flex flex-col gap-3" data-aos="fade-left">
              <h1 className="text-2xl lg:text-3xl font-semibold relative pb-1">
                Our Mission
                <span className="absolute left-0 bottom-0 w-[25%] h-1 bg-violet-500"></span>
              </h1>
              <ul>
                <li className="max-lg:text-sm">At Nii Kwei Ministries, our mission is to transform lives and build a Christ-centered legacy through worship, discipleship, and outreach. We are committed to equipping believers, raising leaders, and advancing God's kingdom through faith-driven initiatives.</li>
              </ul>
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 items-center gap-10' >
            <div className="lg:order-2" data-aos="fade-right">
              <Image src={Singer1} alt="Founder1" width={700} height={500} />
            </div>
            <div className="flex flex-col gap-3" data-aos="fade-left">
            <h1 className="text-2xl lg:text-3xl font-semibold relative pb-1">
              What We Do
              <span className="absolute left-0 bottom-0 w-[25%] h-1 bg-violet-500"></span>
            </h1>
              <ul>
                <li className="max-lg:text-sm">We engage in worship experiences, outreach efforts, and community impact projects designed to inspire, equip, and transform. Through our various initiatives, we aim to: <br/>
                <ul className='flex flex-col gap-1 py-4'>
                  {Do.map((item, id) => {
                    return(
                      <li key={id} className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                        <p>{item.info}</p>
                      </li>
                    )
                  })}
                </ul>
                </li>
              </ul>
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 items-center gap-10 mt-10 lg:mt-20'>
          <div className="max-lg:order-2" data-aos="fade-right">
            <RotatingImage />
          </div>
            <div className="flex flex-col gap-3" data-aos="fade-left">
              <h1 className="text-2xl lg:text-3xl font-semibold relative pb-1">
                Outreach Mission
                <span className="absolute left-0 bottom-0 w-[25%] h-1 bg-violet-500"></span>
              </h1>
              <ul>
                <li className="max-lg:text-sm">Nii Kwei Community Touch, the outreach arm of the ministries undertakes programs designed to impact impoverished youth in deprived communities. We believe in touching lives tangibly as our Lord and Savior did, showing compassion to the needy.</li>
              </ul>
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 items-center gap-10'>
            <div className="lg:order-2" data-aos="fade-right">
              <Image src={Worship} alt="Founder1" width={700} height={500} />
            </div>
            <div className="flex flex-col gap-3" data-aos="fade-left">
            <h1 className="text-2xl lg:text-3xl font-semibold relative pb-1">
              Worship & Music Ministry
              <span className="absolute left-0 bottom-0 w-[25%] h-1 bg-violet-500"></span>
            </h1>
              <ul>
                <li className="max-lg:text-sm">At the heart of Nii Kwei Ministries is a deep passion for worship. We believe worship is more than just music—it is a lifestyle of surrender, reverence, and intimacy with God. Through our music ministry, worship gatherings, and special events, we seek to: <br/>
                <ul className='flex flex-col gap-1 py-4'>
                  {worship.map((item, id) => {
                    return(
                      <li key={id} className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                        <p>{item.info}</p>
                      </li>
                    )
                  })}
                </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/*The Team Section */}
      <div>
        <TeamSection/>
      </div>
      {/*Core Values Section */}
      <div>
        <Values/>
      </div>
      {/*the Gallery section */}
      <div>
        <Gallery/>
      </div>
      <div className="flex items-center justify-center w-full max-lg:h-[40vh]">
          <Image src={Banner} alt='banner' className="bg-cover max-lg:hidden bg-center relative w-full h-full" />
          <Image src={Banner2} alt='banner' className="bg-cover lg:hidden bg-center relative w-full h-full" />
          <div className='bg-black absolute w-full bg-opacity-20'></div>
          <div data-aos="zoom-in" className='absolute max-md:mt-10 w-full flex flex-col gap-5 items-center justify-center text-white px-6 lg:px-20'>
            <h1 className='text-3xl lg:text-5xl font-semibold lg:w-[40%] text-center leading-none'>Join Us</h1>
            <p className='lg:w-[60%] text-center max-lg:text-sm'>We invite you to be part of this journey! Whether through prayer, participation, or partnership, you can help us build lives, inspire faith, and transform communities for Christ.</p>
          </div>
      </div>
    </div>
  );
}

export default page