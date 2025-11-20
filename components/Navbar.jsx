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
    const pathname = usePathname(); // Get the current route

    const toggleNavbar = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    return (
        <nav className="fixed w-full top-0 z-50 py-3 backdrop-blur-lg bg-black bg-opacity-20">
            <div className="container px-6 lg:px-16 mx-auto relative text-sm">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center flex-shrink-0">
                        <Image src={logo} alt="" className="w-10" />
                    </Link>
                    <ul className="hidden lg:flex ml-14 space-x-8 font-medium text-lg text-white">
                        {["/", "/about", "/contact", "/donation", "/store", "/event"].map((link, index) => (
                            <li
                                key={index}
                                className={`hover:text-purple duration-300 ease-in ${
                                    pathname === link ? "text-purple-500 underline" : ""
                                }`}
                            >
                                <Link href={link}>
                                    {link === "/" ? "Home" : link.replace("/", "").replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center lg:gap-10 gap-4 text-white relative">
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
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileDrawerOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-black bg-opacity-20 backdrop-blur-lg py-4 w-full">
                        <ul className="flex flex-col gap-4 text-white px-6">
                            {["/", "/about", "/contact", "/donation", "/store", "/event"].map((link, index) => (
                                <li
                                    key={index}
                                    className={`hover:text-purple-500 duration-300 ease-in text-center text-lg py-2 ${
                                        pathname === link ? "text-purple-500 underline" : ""
                                    }`}
                                >
                                    <Link href={link} onClick={toggleNavbar}>
                                        {link === "/" ? "Home" : link.replace("/", "").replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
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
