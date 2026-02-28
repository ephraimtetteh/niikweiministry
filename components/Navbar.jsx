"use client";

import { useCart } from '@/context/CartContext';
import logo from '@/public/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useEffect, useState } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { BsArrowUpRight } from "react-icons/bs";
import { CgMenu } from "react-icons/cg";
import { FaSearch, FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const { getItemCount, cartItems } = useCart();
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname(); // Get the current route

    const toggleNavbar = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [])
  

    return (
      <nav
        className={`absolute bg-transparent top-0 left-0 w-full flex items-center justify-between px-3 md:px-6 lg:px-12 xl:px-12 transition-all duration-500 z-50 ${
          isScrolled
            ? "bg-black/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
            : "py-4 md:py-6"
        }`}
      >
        <div className="container px-6 lg:px-16 mx-auto relative text-sm">
          <div className="flex justify-between items-center">
            <ul className="hidden lg:flex ml-14 space-x-8 font-medium text-lg text-white">
              {["/", "/about", "/music", "/donation", "/contact"].map(
                (link, index) => (
                  <li
                    key={index}
                    className={`hover:text-purple duration-300 ease-in ${
                      pathname === link ? "text-purple-500 underline" : ""
                    }`}
                  >
                    <Link href={link}>
                      {link === "/"
                        ? "Home"
                        : link
                            .replace("/", "")
                            .replace(/-/g, " ")
                            .replace(/^\w/, (c) => c.toUpperCase())}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <Link href="/" className="flex items-center flex-shrink-0">
              <Image src={logo} alt="" className="w-20" />
            </Link>
         
            <ul className="hidden lg:flex ml-14 space-x-8 font-medium text-lg text-white">
              {["/shopify", "/apple", "/boomplay"].map((link, index) => (
                <li
                  key={index}
                  className={`hover:text-purple duration-300 ease-in ${
                    pathname === link ? "text-purple-500 underline" : ""
                  }`}
                >
                  <Link href={link}>
                    {link === "/"
                      ? "Home"
                      : link
                          .replace("/", "")
                          .replace(/-/g, " ")
                          .replace(/^\w/, (c) => c.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Menu */}
          {mobileDrawerOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-black bg-opacity-20 backdrop-blur-lg py-4 w-full">
              <ul className="flex flex-col gap-4 text-white px-6">
                {[
                  "/",
                  "/about",
                  "/contact",
                  "/donation",
                  "/store",
                  "/event",
                ].map((link, index) => (
                  <li
                    key={index}
                    className={`hover:text-purple-500 duration-300 ease-in text-center text-lg py-2 ${
                      pathname === link ? "text-purple-500 underline" : ""
                    }`}
                  >
                    <Link href={link} onClick={toggleNavbar}>
                      {link === "/"
                        ? "Home"
                        : link
                            .replace("/", "")
                            .replace(/-/g, " ")
                            .replace(/^\w/, (c) => c.toUpperCase())}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    );
};

export default Navbar;
