import { FaCross, FaHandsHelping, FaHeart, FaShieldAlt, FaStar, FaUsers } from 'react-icons/fa';
import Image from 'next/image';
import faith from '@/public/faith.png'
import community from '@/public/community.png'
import Service from '@/public/Service.png'
import Integrity from '@/public/Integrity.png'
import Excellence from '@/public/Excellence.png'
import compassion from '@/public/compassion.png'


const coreValues = [
  {
    title: 'Faithfulness to God',
    description: 'We are rooted in unwavering faith in God, trusting His promises and seeking His guidance in all we do.',
    subtext: '"Now faith is confidence in what we hope for and assurance about what we do not see."',
    reference: 'Hebrews 11:1',
    icon: <Image alt='faith' className="text-4xl mb-2" src={faith} />,
  },
  {
    title: 'Worship as a Lifestyle',
    description: 'We believe worship extends beyond music into everyday life',
    subtext: '"So whether you eat or drink or whatever you do, do it all for the glory of God."',
    reference: '1 Corinthians 10:31',
    icon: <Image alt='community' className="text-4xl mb-2" src={community} />,
  },
  {
    title: 'Integrity',
    description: 'We operate with honesty, accountability, and transparency.',
    subtext: '"The integrity of the upright guides them, but the unfaithful are destroyed by their duplicity."',
    reference: 'Proverbs 11:3',
    icon: <Image alt='integrity' className="text-4xl mb-2" src={Integrity} />,
  },
  {
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, whether in our work, worship, or relationships.',
    subtext: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.',
    reference: 'Colossians 3:23',
    icon: <Image alt='excellence' className="text-4xl mb-2" src={Excellence} />,
  },
  {
    title: 'Service',
    description: 'We are committed to selfless giving and helping others.',
    subtext: '"For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many."',
    reference: 'Mark 10:45',
    icon: <Image alt='service' className="text-4xl mb-2" src={Service} />,
  },
  {
    title: 'Legacy',
    description: 'We aim to leave an enduring impact for generations to come.',
    subtext: '"A good man leaves an inheritance to his children’s children, but the sinner’s wealth is laid up for the righteous"',
    reference: 'Proverbs 13:22',
    icon: <Image alt='compassion' className="text-4xl mb-2" src={compassion} />,
  },
];

const CoreValues = () => {
  return (
    <div className="lg:px-20 px-6 lg:text-center my-16">
      <h2 className="text-3xl font-bold mb-8 relative pb-1" data-aos="fade-up">
        Our Core Values
        <span className="absolute left-0 lg:left-1/2 -bottom-1 w-[10%] h-1 rounded-full bg-violet-500"></span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coreValues.map((value) => (
          <div key={value.title} className="bg-white rounded-lg shadow-lg p-6" data-aos="zoom-in">
            <div className="text-left">
              {value.icon}
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-700 mb-4">{value.description}</p>
              <p className="text-gray-500 italic">{value.subtext}</p>
              <p className="text-gray-5000-semibold">{value.reference}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoreValues;