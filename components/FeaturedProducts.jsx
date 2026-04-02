"use client";

import { store } from "@/constants/store";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState({});

  const featuredProducts = store.slice(0, 3);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading((prev) => ({ ...prev, [product.id]: true }));

    try {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <div className="py-20 px-6 lg:px-16 bg-gradient-to-b from-white via-[#fafafa] to-white">
      {/* HEADER */}
      <div className="mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold relative inline-block">
          Featured Merch
          <span className="absolute left-0 -bottom-2 w-24 h-[3px] bg-gradient-to-r from-purple-100 to-pink-100 rounded-full"></span>
        </h2>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredProducts.map((item, id) => (
          <Link href={`/store/${id}`} key={id}>
            <div
              data-aos="zoom-in"
              className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/40 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(168,85,247,0.25)]"
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <Image
                  src={item.images}
                  alt={item.name}
                  className="w-full h-[280px] object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* QUICK ACTION */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-500">
                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    disabled={loading[item.id]}
                    className="bg-gradient-to-r from-1urple-500 to-pink-100 px-6 py-2 rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50"
                  >
                    {loading[item.id] ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col gap-2">
                <p className="text-xs uppercase tracking-widest text-black/80">
                  {item.category}
                </p>

                <h3 className="text-lg font-semibold text-black group-hover:text-purple-200 transition">
                  {item.name}
                </h3>

                <p className="text-lg font-bold bg-gradient-to-r from-black to-pink-100 bg-clip-text text-transparent">
                  GH₵{item.price.toFixed(2)}
                </p>
              </div>

              {/* GLOW EFFECT */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/10"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-14">
        <Link href="/store">
          <button className="bg-black text-white px-10 py-3 rounded-full text-lg font-semibold hover:scale-105 transition">
            Explore Full Store
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProducts;
