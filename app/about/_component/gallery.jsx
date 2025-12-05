import Image from 'next/image';
import image3 from '@/public/Image3.png';
import image4 from '@/public/Image4.png';
import image5 from '@/public/Image5.png';
import image6 from '@/public/Image6.png';
import image7 from '@/public/Image7.png';
import { useEffect, useState } from 'react';
import { gallery } from '@/constants/gallery';

const Gallery = () => {
    

  
    return (
      <div className="my-16 lg:text-center mt-10 py-4 px-6 lg:px-20">
        <h2 className="text-3xl font-bold mb-5 relative pb-1" data-aos="fade-up">
        Gallery
        <span className="absolute left-0 lg:left-[45%] bottom-0 w-[7%] rounded-full h-1 bg-violet-500"></span>
        </h2>
        <p className="mb-5 pb-4">Capturing moments of worship</p>
        <div className="max-md:flex-col flex gap-5">
          {/* <Image placeholder='blur'
            src={image3} 
            alt="Gallery Image" 
            className="rounded-lg col-span-1 max-lg:w-full"
            data-aos="zoom-in"
          /> */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {gallery.map((src, index) => (
              <Image placeholder='blur'
                key={index}
                src={src}
                alt={`Gallery Image ${index + 2}`} 
                className="rounded-lg max-lg:w-full"
                data-aos="zoom-in"
              />
            ))}
          </div>
        </div>
        <button className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 mt-6">
            View All
          </button>
      </div>
    );
  };
  
  export default Gallery;