"use client";


import { blog_data } from "@/app/blog/Assets/assets";
import React, { useEffect, useState } from "react";
import BlogItem from "./BlogItem";
import axios from "axios";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([])

  const fetchBlogs = async () => {
    const response = axios.get('api/blog')
    setBlogs((await response).data.blogs)
    console.log((await response).data.blogs);
    
  }

  useEffect(() => {
    fetchBlogs
  },[])

  const menuClass = "bg-black text-white py-1 px-4 rounded-sm";
  return (
    <div>
      <div className="flex justify-center gap-6 my-10">
        <button
          onClick={() => setMenu("All")}
          className={menu === "All" ? menuClass : ""}
        >
          All
        </button>
        <button
          onClick={() => setMenu("Technology")}
          className={menu === "Technology" ? menuClass : ""}
        >
          Technology
        </button>
        <button
          onClick={() => setMenu("Startup")}
          className={menu === "Startup" ? menuClass : ""}
        >
          Startup
        </button>
        <button
          onClick={() => setMenu("Lifestyle")}
          className={menu === "Lifestyle" ? menuClass : ""}
        >
          Lifestyle
        </button>
      </div>
      <div className="flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24">
        {blogs.filter((item) => menu === 'All'?true: item.category === menu).map((item, index) => {
          return (
            <BlogItem
              key={index}
              id={item._id}
              title={item.title}
              category={item.category}
              image={item.image}
              description={item.description}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BlogList;
