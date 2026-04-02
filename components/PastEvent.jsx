"use client";

import React from "react";
import { Pastevents } from "@/constants/events";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";

const PastEvent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-20 py-16">
      {Pastevents.map((item, id) => {
        return (
          <div
            key={id}
            data-aos="zoom-in"
            className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/40 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(168,85,247,0.25)]"
          >
            {/* IMAGE */}
            <div className="relative overflow-hidden">
              <Image
                src={item.image}
                alt="event"
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* DATE BADGE */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <p className="text-xl font-bold text-purple-400 leading-none">
                  {item.date.day}
                </p>
                <p className="text-xs text-white/70 leading-none">
                  {item.date.month} {item.date.year}
                </p>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition">
                {item.title}
              </h3>

              <p className="text-sm text-white/70 line-clamp-2">
                {item.description}
              </p>

              {/* META */}
              <div className="flex items-center justify-between text-xs text-white/60 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <IoLocationOutline className="text-purple-400 text-lg" />
                  <span>{item.venue}</span>
                </div>

                <div className="flex items-center gap-1">
                  <IoMdTime className="text-purple-400 text-lg" />
                  <span>{item.time}</span>
                </div>
              </div>
            </div>

            {/* HOVER GLOW */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/10"></div>
          </div>
        );
      })}
    </div>
  );
};

export default PastEvent;
