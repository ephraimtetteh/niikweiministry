import Image from 'next/image'
import React from 'react'
import Logo from "@/public/logo.png"
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className='bg-black text-white w-full px-6 lg:px-16'>
      <div className='lg:grid flex flex-wrap lg:grid-cols-4 max-lg:gap-6 pt-10 pb-24'>
        <Image src={Logo} alt='logo' className='max-lg:w-20' />
        <div className='flex flex-col gap-3'>
          <h1 className='text-purple-500 text-xl font-semibold'>Quick Links</h1>
          <ul className='flex flex-col gap-2 max-lg:text-sm'>
            <Link href='/about'>About Us</Link>
            <Link href="/store">Shop Now</Link>
            <Link href='/contact'>Contact Us</Link>
            <Link href='/donate'>Donate Now</Link>
            <Link href='/volunteer'>Join Us</Link>
          </ul>
        </div>
        <div className='flex flex-col gap-3'>
          <h1 className='text-purple-500 text-xl font-semibold'>Stay Updated</h1>
          <ul className='flex flex-col gap-2 max-lg:text-sm'>
            <li>Newsletter Signup</li>
            <li>Latest News</li>
            <li>New Arrivals</li>
            <li>Exclusive Offers</li>
            <li>Special Deals</li>
          </ul>
        </div>
        <div className='flex flex-col gap-3 max-lg:text-sm'>
          <h1 className='text-purple-500 text-xl font-semibold'>Subscribe</h1>
          <p>Join our newsletter to stay updated on new products and special promotions.</p>
          <div className='flex items-center gap-2'>
            <input type="email" placeholder='Enter your email' className='p-3 w-full border border-button placeholder:text-white/60 bg-transparent rounded-md' />
            <button className="border border-button py-2 px-4 text-button text-lg rounded-md">Subscribe</button>
          </div>
          <p className='max-lg:pt-4'>By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>
        </div>
      </div>
      <hr className='text-white bg-white'/>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between pt-2 pb-4 max-lg:gap-10 text-white'>
        <div className='flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-10 text-sm'>
          <p>&copy; 2024 Copyright. All Rights Reserved</p>
          <div className='flex gap-5 items-center'>
            <p className='underline cursor-pointer'>Privacy Policy</p>
            <p className='underline cursor-pointer'>Terms of Services</p>
            <p className='underline cursor-pointer'>Cookie Settings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 text-2xl'>
          <a href="https://www.facebook.com/freyblanks?mibextid=rS40aB7S9Ucbxw6v" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com/niikweiworld?igsh=YzljYTk1ODg3Zg==" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.tiktok.com/t/ZT2M4dfXa/" target="_blank" rel="noopener noreferrer">
            <FaTiktok />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://youtube.com/@niikweimusic?si=nRaE4IrDUBmcnmXF" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Footer
