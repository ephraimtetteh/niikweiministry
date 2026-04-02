"use client";

import { useCart } from "@/context/CartContext";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { CgMenu } from "react-icons/cg";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { getItemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const musicLinks = [
    {
      name: "Apple",
      link: "https://music.apple.com/gh/artist/nii-kwei/1757263757",
    },
    { name: "Audiomack", link: "https://audiomack.com/nii-kwei-8" },
    {
      name: "Boomplay",
      link: "https://www.boomplay.com/artists/93944240?srModel=COPYLINK&srList=WEB&share_content=artist&share_channel=copylink&share_platform=web",
    },
  ];

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["/", "/about", "/music", "/donation", "/contact"];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* LEFT LINKS */}
        <ul className="hidden lg:flex gap-8 text-white text-[15px] font-medium tracking-wide">
          {navLinks.map((link, index) => (
            <li key={index} className="relative group">
              <Link href={link}>
                <span
                  className={`transition duration-300 ${
                    pathname === link ? "text-purple-400" : "text-white/80"
                  } group-hover:text-purple-400`}
                >
                  {link === "/"
                    ? "Home"
                    : link
                        .replace("/", "")
                        .replace(/-/g, " ")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                </span>

                {/* underline animation */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
                    pathname === link ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="logo"
            className="w-20 object-contain hover:scale-105 transition duration-300"
          />
        </Link>

        {/* RIGHT (MUSIC LINKS) */}
        <div className="hidden lg:flex items-center gap-4">
          {musicLinks.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/80 text-sm hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition duration-300"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* MOBILE BUTTON */}
        <div className="lg:hidden text-white text-2xl cursor-pointer">
          {mobileDrawerOpen ? (
            <AiOutlineClose onClick={toggleNavbar} />
          ) : (
            <CgMenu onClick={toggleNavbar} />
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileDrawerOpen && (
        <div className="lg:hidden bg-black/90 backdrop-blur-xl px-6 py-6 space-y-6 text-center text-white">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link}
              onClick={toggleNavbar}
              className={`block text-lg ${
                pathname === link ? "text-purple-400" : "text-white/80"
              } hover:text-purple-400 transition`}
            >
              {link === "/"
                ? "Home"
                : link
                    .replace("/", "")
                    .replace(/-/g, " ")
                    .replace(/^\w/, (c) => c.toUpperCase())}
            </Link>
          ))}

          {/* music links mobile */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {musicLinks.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="py-2 rounded-lg bg-white/5 hover:bg-purple-500 transition"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
