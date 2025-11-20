import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from '@/context/CheckoutContext'
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nii Kwei Ministries",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Navbar />
          <CheckoutProvider>
            {children}
          </CheckoutProvider>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 2000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
