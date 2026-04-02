"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import Hero from "@/public/donate/hero.png";
import Hero2 from "@/public/mobile-contact.png";
import Banner from "@/public/donate/banner.png";
import { give, impact } from "@/constants/donation";
import DonationForm from "./_component/DonationForm";
import AOS from "aos";
import "aos/dist/aos.css";

const page = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-linear", once: false });
  }, []);

  return (
    <div className="bg-black text-white">
      {/* ── Hero ── */}
      <div className="max-[340px]:h-[90vh] max-sm:h-[70vh] md:h-[100vh] flex items-center justify-center w-full relative">
        <Image
          placeholder="blur"
          src={Hero}
          alt="hero"
          className="bg-cover max-lg:hidden bg-center absolute inset-0 w-full h-full object-cover"
        />
        <Image
          placeholder="blur"
          src={Hero2}
          alt="hero"
          className="bg-cover lg:hidden bg-center absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-md:mt-10 bottom-0 w-full flex flex-col gap-5 justify-center text-white px-6 lg:px-20 lg:absolute lg:bottom-20">
          <p
            className="lg:text-lg relative pb-1"
            data-aos="slide-right"
            data-aos-delay="100"
          >
            Donation
            <span className="absolute left-0 bottom-0 w-10 h-1 bg-violet-500" />
          </p>
          <h1
            className="text-3xl lg:text-5xl font-semibold w-full lg:w-[55%] leading-tight"
            data-aos="slide-right"
            data-aos-delay="300"
          >
            Partner With Us To Transform Lives
          </h1>
          <p
            className="lg:w-[57%] text-white/70"
            data-aos="slide-right"
            data-aos-delay="500"
          >
            Your generosity helps us spread the Gospel, serve communities, and
            empower believers worldwide.
          </p>
        </div>
      </div>

      {/* ── Impact stats ── */}
      <div className="relative py-20">
        <Image
          placeholder="blur"
          src={Banner}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 px-6 lg:px-20">
          <h2
            className="text-3xl font-semibold relative pb-3 mb-10"
            data-aos="fade-up"
          >
            Your Impact
            <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {impact.map((item, id) => (
              <div
                key={id}
                className="flex flex-col gap-3 items-center bg-white/8 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:border-violet-500/40 transition-all duration-300"
                data-aos="zoom-in"
              >
                <Image
                  placeholder="blur"
                  src={item.image}
                  alt="impact"
                  className="w-16 opacity-90"
                />
                <h3 className="text-2xl font-bold text-violet-400">
                  {item.number}
                </h3>
                <p className="text-center text-sm text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Donation form — dark section matching site's overall dark bg ── */}
      <div className="relative bg-black py-20 px-6 lg:px-16 overflow-hidden">
        {/* Subtle violet glow behind the form — matches hero style */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto mb-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-violet-400 mb-3">
            Give Today
          </p>
          <h2 className="text-3xl lg:text-4xl font-semibold mb-3">
            Make A Donation
          </h2>
          {/* violet underline — site's signature decoration */}
          <div className="w-20 h-1 bg-violet-500 mx-auto mb-4" />
          <p className="text-white/50 text-sm">
            Every gift, no matter the size, makes a difference.
          </p>
        </div>

        <div className="relative z-10">
          <DonationForm />
        </div>
      </div>

      {/* ── Why Give ── */}
      <div className="relative py-20">
        <Image
          placeholder="blur"
          src={Banner}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 px-6 lg:px-20">
          <h2
            className="text-3xl font-semibold relative pb-3 mb-4"
            data-aos="fade-up"
          >
            Why Give?
            <span className="absolute left-0 bottom-0 w-20 h-1 bg-violet-500" />
          </h2>
          <p className="text-white/50 mb-10" data-aos="zoom-in">
            Your support enables us to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {give.map((item, id) => (
              <div
                key={id}
                className="flex flex-col items-center gap-4 bg-white/8 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:border-violet-500/40 transition-all duration-300"
                data-aos="zoom-in"
              >
                <Image
                  placeholder="blur"
                  src={item.image}
                  alt="reason"
                  className="w-16 opacity-90"
                />
                <p className="text-sm text-center text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4" data-aos="zoom-in">
            <p className="text-white/50 text-sm">
              Every gift, no matter the size, makes a difference.
            </p>
            <button className="bg-button border border-button py-2.5 px-8 text-sm rounded-lg text-white font-semibold hover:opacity-90 transition-all duration-200">
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
