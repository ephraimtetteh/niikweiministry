import Hero from '@/public/stores/hero.png'
import Hero2 from '@/public/stores/mobile-hero.png'
import Image from 'next/image'
import CheckoutForm from './_component/CheckoutForm'

const page = () => {
  return (
    <div>
      <div className="max-[340px]:h-[90vh] max-sm:h-[50vh] md:h-[60vh] flex items-center justify-center w-full">
        <Image placeholder='blur' src={Hero} alt='hero' className="bg-cover max-lg:hidden bg-center relative w-full h-full" />
        <Image placeholder='blur' src={Hero2} alt='hero' className="bg-cover lg:hidden bg-center relative w-full h-full" />
        <div className='bg-black absolute w-full bg-opacity-20'></div>
        <div className='absolute max-md:mt-10 w-full flex flex-col gap-5 justify-center text-white px-20'>
        </div>
      </div>
      <div className="relative px-6 lg:px-20 lg:-top-24 w-full pb-8">
        <CheckoutForm />
      </div>
    </div>
  )
}

export default page 