"use client"

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Import your images
import Outreach1 from '@/public/outreach.png';
import Outreach2 from '@/public/outreach2.png';
import Outreach3 from '@/public/outreach3.png';
import Outreach4 from '@/public/outreach4.png';
import Outreach5 from '@/public/outreach5.png';
import Outreach6 from '@/public/outreach6.png';

const RotatingImage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [Outreach1, Outreach2, Outreach3, Outreach4, Outreach5, Outreach6];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px]">
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.4 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt="Outreach Images"
            className="rounded-lg object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingImage; 