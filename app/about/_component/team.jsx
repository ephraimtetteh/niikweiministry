"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { teamMembers } from "@/constants/team";

const TeamSection = () => {
  const [selected, setSelected] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <div className="px-6 lg:px-40 py-16">
      {/* Heading */}
      <div className="mb-12" data-aos="fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[3px] text-violet-400 mb-3">
          The People Behind The Mission
        </p>
        <h2 className="text-3xl lg:text-4xl font-bold text-white relative pb-3 w-fit">
          Meet Our Team
          <span className="absolute left-0 bottom-0 w-16 h-1 bg-violet-500 rounded-full" />
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {teamMembers.map((member, i) => (
          <div
            key={member.name}
            data-aos="fade-up"
            data-aos-delay={i * 80}
            className="group relative flex flex-col sm:flex-row bg-black/5 border border-black/10 rounded-2xl overflow-hidden hover:border-violet-500/40 hover:bg-white/8 transition-all duration-300 cursor-pointer"
            onClick={() => setSelected(member)}
          >
            {/* Image */}
            <div className="relative w-full sm:w-48 shrink-0 overflow-hidden aspect-square sm:aspect-auto">
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient overlay on mobile bottom, desktop right */}
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
              <div>
                <h3 className="text-lg font-semibold text-black mb-0.5 group-hover:text-violet-300 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-[1px] text-violet-400 mb-3">
                  {member.title}
                </p>
                <p className="text-sm text-black/70 leading-relaxed line-clamp-3">
                  {member.shortDescription}
                </p>
              </div>

              <button
                className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors w-fit"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(member);
                }}
              >
                Read More
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
          onClick={() => setSelected(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative z-10 w-full max-w-4xl bg-[#0D0D12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col lg:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/8 border border-white/10 hover:bg-violet-500/20 hover:border-violet-500/40 flex items-center justify-center text-white/60 hover:text-white transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image panel */}
            <div className="relative w-full lg:w-2/5 shrink-0 min-h-[260px] lg:min-h-0">
              <Image
                src={selected.imageUrl}
                alt={selected.name}
                fill
                className="object-cover"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0D0D12] via-[#0D0D12]/20 to-transparent" />

              {/* Name overlay on image (mobile) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:hidden">
                <p className="text-[10px] font-semibold uppercase tracking-[2px] text-violet-400 mb-1">
                  {selected.title}
                </p>
                <h2 className="text-2xl font-bold text-white">
                  {selected.name}
                </h2>
              </div>
            </div>

            {/* Text panel */}
            <div className="flex-1 overflow-y-auto p-7 lg:p-10">
              {/* Violet line decoration */}
              <div className="w-10 h-0.5 bg-violet-500 rounded-full mb-5 hidden lg:block" />

              {/* Name (desktop) */}
              <div className="hidden lg:block mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-[2px] text-violet-400 mb-1">
                  {selected.title}
                </p>
                <h2 className="text-2xl font-bold text-white">
                  {selected.name}
                </h2>
              </div>

              <p className="text-sm text-white/60 leading-relaxed">
                {selected.fullDescription}
              </p>

              <button
                onClick={() => setSelected(null)}
                className="mt-8 px-6 py-2.5 bg-button hover:opacity-90 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-violet-500/25"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSection;
