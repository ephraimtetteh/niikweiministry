"use client";

import Hero from "@/public/Background.png";
import Singer1 from "@/public/Image1.png";
import Singer2 from "@/public/Image2.png";
import Banner from "@/public/banner.png";
import Hero2 from "@/public/mobile-about.png";
import Banner2 from "@/public/mobile-banner.png";
import Worship from "@/public/worship.png";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Link from "next/link";
import RotatingImage from "./_component/RotatingImage";
import Gallery from "./_component/gallery";
import TeamSection from "./_component/team";
import Values from "./_component/values";

const Do = [
  { info: "Spread the Gospel through Spirit-led worship and outreach" },
  { info: "Raise strong Christian leaders who influence society positively" },
  { info: "Lead believers into deeper encounters with God through worship" },
  { info: "Provide mentorship and opportunities for spiritual growth" },
  { info: "Serve communities through outreach and acts of love" },
];

const worship = [
  { info: "Create a powerful atmosphere of God's presence" },
  { info: "Encourage believers to worship in spirit and in truth" },
  { info: "Use music as a tool for healing, breakthrough, and transformation" },
];

// ─── Bullet list ──────────────────────────────────────────────────────────────
const BulletList = ({ items }) => (
  <ul className="flex flex-col gap-3 mt-4">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
        <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
          {item.info}
        </p>
      </li>
    ))}
  </ul>
);

// ─── Section heading ──────────────────────────────────────────────────────────
const SectionHeading = ({ eyebrow, title }) => (
  <div className="mb-5">
    {eyebrow && (
      <p className="text-[11px] font-semibold uppercase tracking-[3px] text-violet-500 mb-2">
        {eyebrow}
      </p>
    )}
    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 relative pb-3 w-fit">
      {title}
      <span className="absolute left-0 bottom-0 w-12 h-[3px] bg-violet-500 rounded-full" />
    </h2>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const page = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-linear", once: false });
  }, []);

  return (
    <div className="bg-white text-gray-900">
      {/* ── Hero ── */}
      <div className="md:h-[60vh] h-[50vh] flex items-center w-full relative overflow-hidden">
        <Image
          src={Hero}
          alt="About hero"
          fill
          className="object-cover max-lg:hidden"
        />
        <Image
          src={Hero2}
          alt="About hero"
          fill
          className="object-cover lg:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="relative z-10 px-6 lg:px-20" data-aos="fade-right">
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-violet-300 mb-3">
            Our Story
          </p>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-3 leading-tight">
            About Us
          </h1>
          <div className="w-12 h-[3px] bg-violet-500 rounded-full mb-4" />
          <p className="text-white/70 text-base lg:text-lg max-w-md">
            Who we are and what we do
          </p>
        </div>
      </div>

      {/* ── Content sections ── */}
      <div className="px-6 lg:px-20 xl:px-32">
        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20 py-16 lg:py-24">
          <div
            className="relative rounded-2xl overflow-hidden shadow-xl"
            data-aos="fade-right"
          >
            <Image
              src={Singer2}
              alt="Singer Nii Kwei"
              width={700}
              height={500}
              className="w-full h-[420px] object-cover"
            />
            {/* subtle violet tint bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500" />
          </div>

          <div data-aos="fade-left">
            <SectionHeading eyebrow="What Drives Us" title="Our Mission" />
            <p className="text-gray-600 leading-relaxed lg:text-base">
              At Nii Kwei Ministries, our mission is to transform lives and
              build a Christ-centered legacy through worship, discipleship, and
              outreach. We are committed to equipping believers, raising
              leaders, and advancing God's kingdom through faith-driven
              initiatives.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100" />

        {/* What We Do */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20 py-16 lg:py-24">
          <div
            className="lg:order-2 relative rounded-2xl overflow-hidden shadow-xl"
            data-aos="fade-right"
          >
            <Image
              src={Singer1}
              alt="Minister Nii Kwei"
              width={700}
              height={500}
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500" />
          </div>

          <div data-aos="fade-left">
            <SectionHeading eyebrow="Our Activities" title="What We Do" />
            <p className="text-gray-600 leading-relaxed">
              We engage in worship experiences, outreach efforts, and community
              impact projects designed to inspire, equip, and transform. Through
              our various initiatives, we aim to:
            </p>
            <BulletList items={Do} />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100" />

        {/* Outreach */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20 py-16 lg:py-24">
          <div
            className="max-lg:order-2 rounded-2xl overflow-hidden shadow-xl"
            data-aos="fade-right"
          >
            <RotatingImage />
          </div>

          <div data-aos="fade-left">
            <SectionHeading
              eyebrow="Community Impact"
              title="Outreach Mission"
            />
            <p className="text-gray-600 leading-relaxed">
              Nii Kwei Community Touch, the outreach arm of the ministries,
              undertakes programs designed to impact impoverished youth in
              deprived communities. We believe in touching lives tangibly as our
              Lord and Savior did, showing compassion to the needy.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100" />

        {/* Worship & Music */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20 py-16 lg:py-24">
          <div
            className="lg:order-2 relative rounded-2xl overflow-hidden shadow-xl"
            data-aos="fade-right"
          >
            <Image
              src={Worship}
              alt="Worship ministry"
              width={700}
              height={500}
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500" />
          </div>

          <div data-aos="fade-left">
            <SectionHeading
              eyebrow="Heart of the Ministry"
              title="Worship & Music Ministry"
            />
            <p className="text-gray-600 leading-relaxed">
              At the heart of Nii Kwei Ministries is a deep passion for worship.
              We believe worship is more than just music — it is a lifestyle of
              surrender, reverence, and intimacy with God. Through our music
              ministry, worship gatherings, and special events, we seek to:
            </p>
            <BulletList items={worship} />
          </div>
        </div>
      </div>

      {/* ── Team ── */}
      <div className="bg-gray-50 border-t border-gray-100 py-4">
        <TeamSection />
      </div>

      {/* ── Core Values ── */}
      <div className="bg-white border-t border-gray-100 py-4">
        <Values />
      </div>

      {/* ── Gallery ── */}
      <div className="bg-gray-50 border-t border-gray-100 py-4">
        <Gallery />
      </div>

      {/* ── CTA Banner ── */}
      <div className="relative flex items-center justify-center w-full min-h-[44vh] overflow-hidden">
        <Image
          src={Banner}
          alt="Join us banner"
          fill
          className="object-cover max-lg:hidden"
        />
        <Image
          src={Banner2}
          alt="Join us banner"
          fill
          className="object-cover lg:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/50" />

        <div
          className="relative z-10 flex flex-col items-center gap-5 text-center px-6 lg:px-20 py-16"
          data-aos="zoom-in"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-violet-300">
            Be Part of It
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-white lg:w-[40%] leading-tight">
            Join Us
          </h2>
          <div className="w-12 h-[3px] bg-violet-500 rounded-full" />
          <p className="text-white/65 lg:w-[50%] text-sm lg:text-base leading-relaxed max-w-xl">
            We invite you to be part of this journey! Whether through prayer,
            participation, or partnership, you can help us build lives, inspire
            faith, and transform communities for Christ.
          </p>
          <Link href="/contact">
            <button
              className="mt-2 px-8 py-3 bg-button hover:opacity-90 text-white font-semibold
              text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-violet-500/30
              hover:-translate-y-0.5"
            >
              Get In Touch
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
