This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


"use client";

import { useCart } from '@/context/CartContext';
import logo from '@/public/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useState } from 'react';
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

    const handleScroll = () => {
        window.addEventListener('scroll', () => {
            if(window.scrollY > 20){
                return (isScrolled?`${backdrop-blur-lg }`:'')
            }
        })
        return window.removeEventListener('scroll', )
    }

    return (
      <nav className="fixed w-full top-0 z-50 py-3 backdrop-blur-lg  bg-black bg-opacity-20">
        <div className="container px-6 lg:px-16 mx-auto relative text-sm">
          <div className="flex justify-between items-center">
            <ul className="hidden lg:flex ml-14 space-x-8 font-medium text-lg text-white">
              {["/", "/about", "/contact", "/donation", "/event"].map(
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
                )
              )}
            </ul>

            <Link href="/" className="flex items-center flex-shrink-0">
              <Image src={logo} alt="" className="w-10" />
            </Link>
            {/* <div className="flex items-center lg:gap-10 gap-4 text-white relative">
                        <div>
                            <FaSearch className="text-xl" />
                        </div>
                        <Link href="/cart" className="relative">
                            <FaShoppingCart className="text-xl" />
                            {getItemCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {getItemCount()}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={toggleNavbar}
                            className="lg:hidden text-2xl"
                        >
                            {mobileDrawerOpen ? <AiOutlineClose /> : <CgMenu />}
                        </button>
                    </div> */}
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
