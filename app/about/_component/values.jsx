"use client";

import Image from "next/image";
import faith from "@/public/faith.png";
import community from "@/public/community.png";
import Service from "@/public/Service.png";
import Integrity from "@/public/Integrity.png";
import Excellence from "@/public/Excellence.png";
import compassion from "@/public/compassion.png";

const coreValues = [
  {
    title: "Faithfulness to God",
    description:
      "We are rooted in unwavering faith in God, trusting His promises and seeking His guidance in all we do.",
    subtext:
      "Now faith is confidence in what we hope for and assurance about what we do not see.",
    reference: "Hebrews 11:1",
    icon: faith,
    alt: "faith",
  },
  {
    title: "Worship as a Lifestyle",
    description:
      "We believe worship extends beyond music into every area of everyday life.",
    subtext:
      "So whether you eat or drink or whatever you do, do it all for the glory of God.",
    reference: "1 Corinthians 10:31",
    icon: community,
    alt: "worship",
  },
  {
    title: "Integrity",
    description:
      "We operate with honesty, accountability, and transparency in all things.",
    subtext:
      "The integrity of the upright guides them, but the unfaithful are destroyed by their duplicity.",
    reference: "Proverbs 11:3",
    icon: Integrity,
    alt: "integrity",
  },
  {
    title: "Excellence",
    description:
      "We strive for excellence in our work, worship, and relationships — as unto the Lord.",
    subtext:
      "Whatever you do, work at it with all your heart, as working for the Lord.",
    reference: "Colossians 3:23",
    icon: Excellence,
    alt: "excellence",
  },
  {
    title: "Service",
    description:
      "We are committed to selfless giving and serving others with joy.",
    subtext: "For even the Son of Man did not come to be served, but to serve.",
    reference: "Mark 10:45",
    icon: Service,
    alt: "service",
  },
  {
    title: "Legacy",
    description:
      "We aim to leave an enduring, godly impact for generations to come.",
    subtext: "A good man leaves an inheritance to his children's children.",
    reference: "Proverbs 13:22",
    icon: compassion,
    alt: "legacy",
  },
];

const CoreValues = () => (
  <div className="px-6 lg:px-20 xl:px-32 py-16">
    {/* Heading */}
    <div className="mb-12" data-aos="fade-up">
      <p className="text-[11px] font-semibold uppercase tracking-[3px] text-violet-500 mb-2">
        What We Stand For
      </p>
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 relative pb-3 w-fit">
        Our Core Values
        <span className="absolute left-0 bottom-0 w-12 h-[3px] bg-violet-500 rounded-full" />
      </h2>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {coreValues.map((value, i) => (
        <div
          key={value.title}
          data-aos="fade-up"
          data-aos-delay={i * 70}
          className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-6
                     shadow-sm hover:shadow-md hover:border-violet-100
                     transition-all duration-300"
        >
          {/* Icon box */}
          <div
            className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100
                          flex items-center justify-center mb-5 shrink-0
                          group-hover:bg-violet-100 group-hover:border-violet-200
                          transition-all duration-300"
          >
            <Image
              src={value.icon}
              alt={value.alt}
              width={26}
              height={26}
              className="object-contain"
            />
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors">
            {value.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
            {value.description}
          </p>

          {/* Divider */}
          <div className="w-8 h-px bg-violet-200 mb-4" />

          {/* Scripture */}
          <blockquote className="text-xs text-gray-400 italic leading-relaxed mb-2">
            "{value.subtext}"
          </blockquote>
          <p className="text-[11px] font-semibold text-violet-500 uppercase tracking-[1px]">
            — {value.reference}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default CoreValues;
