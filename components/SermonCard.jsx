import { sermon, videos } from '@/constants/sermon'
import Image from 'next/image'
import React from 'react'

const SermonCard = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 py-4 w-full lg:h-[50vh]'>
        {videos.map((item, id) => {
            return(
                <div key={id} className='shadow-lg rounded-md max-lg:h-[40vh]' data-aos="zoom-in">
                    <iframe
                        src={item.link}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-lg"
                    />
                </div>
            )
        })}
    </div>
  )
}

export default SermonCard