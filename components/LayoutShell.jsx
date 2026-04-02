"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

const LayoutShell = ({ children }) => {

  const pathname = usePathname()
  const admin = pathname.startsWith('/admin')

  return (
    <>
     { !admin && <Navbar />}
      {children}
      {!admin && <Footer />}
    </>
  );
};

export default LayoutShell;
