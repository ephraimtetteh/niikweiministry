"use client";

import React, { memo, useCallback, useState } from "react";
import { Pastevents } from "@/constants/events";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";

// ─── Single card — memoized so re-renders above don't cascade ─────────────────
const EventCard = memo(({ item, index }) => {
  // Track whether image has loaded to avoid layout shift
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      data-aos="zoom-in"
      data-aos-delay={Math.min(index * 60, 300)} // cap delay so late items aren't too slow
      className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl
                 border border-white/10 hover:border-purple-500/40 transition-all duration-500
                 hover:shadow-[0_10px_40px_rgba(168,85,247,0.25)]"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-gray-900">
        {/* Skeleton shown until image loads */}
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 h-[280px] sm:h-[320px] lg:h-[280px]" />
        )}

        <Image
          src={item.image}
          alt={item.title}
          width={600}
          height={400}
          // Only the first 3 cards (likely above fold) get priority + eager loading
          priority={index < 3}
          loading={index < 3 ? "eager" : "lazy"}
          // sizes tells the browser exactly how wide this image will be at each breakpoint
          // → browser picks the smallest sufficient source, saving bandwidth
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`w-full h-[280px] sm:h-[320px] lg:h-[280px] object-cover
                      transition-all duration-700 group-hover:scale-110
                      ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Date badge */}
        <div
          className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2
                        rounded-xl border border-white/10"
        >
          <p className="text-xl font-bold text-purple-400 leading-none">
            {item.date.day}
          </p>
          <p className="text-xs text-white/70 leading-none mt-0.5">
            {item.date.month} {item.date.year}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-base font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/10 gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <IoLocationOutline className="text-purple-400 text-base shrink-0" />
            <span className="truncate">{item.venue}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <IoMdTime className="text-purple-400 text-base shrink-0" />
            <span>{item.time}</span>
          </div>
        </div>
      </div>

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                      duration-500 bg-gradient-to-tr from-purple-500/10 via-transparent
                      to-pink-500/10 pointer-events-none"
      />
    </div>
  );
});

EventCard.displayName = "EventCard";

// ─── Grid ─────────────────────────────────────────────────────────────────────
const PastEvent = () => {
  if (!Pastevents?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 lg:px-20 py-10 w-full">
      {Pastevents.map((item, index) => (
        <EventCard key={`${item.title}-${index}`} item={item} index={index} />
      ))}
    </div>
  );
};

export default memo(PastEvent);
