"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const LayoutShell = ({ children }) => {

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default LayoutShell;
