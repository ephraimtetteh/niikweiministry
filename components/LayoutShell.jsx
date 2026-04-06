"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import useAnalytics from "@/utils/useAnalytics";


const LayoutShell = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Track every page view automatically — skips /admin routes internally
  useAnalytics();

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
};

export default LayoutShell;
