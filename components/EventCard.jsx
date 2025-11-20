import React from 'react'
import Date from '@/public/date.png'
import Image from 'next/image'
import { events } from '@/constants/events'
import { IoLocationOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";


const EventCard = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 max-lg:px-4 lg:px-20 py-10'>
        {events.map((item, id) => {
            return(
                <div key={id} className='border-2 rounded-md' data-aos="flip-left">
                    <div className='relative'>
                        <Image src={item.image} alt='image' className='rounded-t-md w-full' />
                        <div className='absolute -top-4 -left-5'>
                            <Image src={Date} alt="date" width={120}  />
                            <div className='flex items-center gap-1 text-white absolute top-0 px-2 py-4'>
                                <p className='text-3xl font-semibold'>{item.date.day}</p>
                                <div>
                                    <p>{item.date.month}</p>
                                    <p>{item.date.year}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='p-2 flex flex-col gap-2'>
                        <h3 className='text-xl font-semibold'>{item.title}</h3>
                        <p>{item.description}</p>
                        <div className='flex items-center justify-between text-sm'>
                            <p className='flex items-center gap-1'><IoLocationOutline className='text-purple-500 text-xl'/> {item.venue}</p>
                            <p className='flex items-center gap-1'><IoMdTime className='text-purple-500 text-xl'/> {item.time}</p>
                        </div>
                    </div>
                </div>
            )
        })}
        </div>
  )
}

export default EventCard