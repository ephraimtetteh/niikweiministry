"use client";

import React from "react";
import Image from "next/image";
import { events } from "@/constants/events";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";

// ── Empty state ───────────────────────────────────────────────────────────────
const NoEvents = () => (
  <div className="w-full py-20 flex flex-col items-center justify-center gap-5 text-center px-6">
    {/* Decorative ring */}
    <div className="relative w-24 h-24 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border border-violet-500/20 animate-ping opacity-30" />
      <div className="absolute inset-2 rounded-full border border-violet-500/30" />
      <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-violet-400/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
          />
        </svg>
      </div>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-black/80 mb-2">
        No Upcoming Events
      </h3>
      <p className="text-sm text-black/35 max-w-xs leading-relaxed">
        We're planning something special. Check back soon or follow us on social
        media for announcements.
      </p>
    </div>

    {/* Violet underline decoration — matches site pattern */}
    <div className="w-12 h-0.5 bg-violet-500/40 rounded-full" />
  </div>
);

// ── Single event card ─────────────────────────────────────────────────────────
const Card = ({ item }) => (
  <div
    className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden
               hover:border-violet-500/40 hover:bg-white/8 transition-all duration-300"
    data-aos="fade-up"
  >
    {/* Image */}
    <div className="relative overflow-hidden aspect-[4/3]">
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Dark gradient so date badge reads cleanly */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Date badge — floated over image bottom-left */}
      <div className="absolute bottom-4 left-4 flex items-end gap-2">
        <span className="text-4xl font-bold text-white leading-none">
          {item.date.day}
        </span>
        <div className="flex flex-col leading-tight pb-1">
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
            {item.date.month}
          </span>
          <span className="text-xs text-white/50">{item.date.year}</span>
        </div>
        {/* Violet accent line matching site's h1 underline style */}
        <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-violet-500 rounded-full" />
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col gap-3 p-5 flex-1">
      <h3 className="text-lg font-semibold text-white leading-snug group-hover:text-violet-300 transition-colors duration-200">
        {item.title}
      </h3>
      <p className="text-sm text-white/50 leading-relaxed line-clamp-2 flex-1">
        {item.description}
      </p>

      {/* Meta row */}
      <div className="pt-3 border-t border-white/8 flex flex-col gap-2">
        <p className="flex items-start gap-2 text-xs text-white/40">
          <IoLocationOutline className="text-violet-500 text-base shrink-0 mt-0.5" />
          <span className="line-clamp-1">{item.venue}</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-white/40">
          <IoMdTime className="text-violet-500 text-base shrink-0" />
          {item.time}
        </p>
      </div>
    </div>
  </div>
);

// ── EventCard ─────────────────────────────────────────────────────────────────
const EventCard = () => {
  if (!events || events.length === 0) return <NoEvents />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-0 py-10">
      {events.map((item, id) => (
        <Card key={id} item={item} />
      ))}
    </div>
  );
};

export default EventCard;
