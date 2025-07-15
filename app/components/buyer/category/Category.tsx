"use client";
import React, { useState } from "react";
import Header from "../Header";
import Link from "next/link";
import MobileNav from "../MobileNav";
const categories: { [category: string]: any[] } = {
  Electronics: [
    { name: "Laptops & PCs", image: "category-icons/laptop_pc.png" },
    { name: "Mobiles", image: "category-icons/smartphone.png" },
  ],
  Fasion: [
    { name: "Men", image: "category-icons/men-clothing.png" },
    { name: "Women", image: "category-icons/women-clothing.png" },
    { name: "Kids", image: "category-icons/kids-clothing.png" },
  ],
};
const Category = () => {
  const [category, setCategory] = useState("Electronics");
  return (
    <>
      <Header />
      <section className="flex mt-14 mb-12 h-[calc(100vh-3.5rem)] ">
        <div className="basis-[10%] h-full bg-gray-100 border flex flex-col py-2">
          {Object.keys(categories).map((item, i) => (
            <button key={i} onClick={() => setCategory(item)} className={`${item === category ? "border-l-2 border-blue-300 bg-white" : "border border-slate-200"} px-1 `}>
              {item}
            </button>
          ))}
        </div>
        <div className="basis-[90%] grid grid-cols-2 gap-y-5 justify-items-center sm:flex h-44 sm:gap-x-5 ml-2 md:ml-5 py-2">
          {categories[category].map((item, i) => (
            <Link
              href={{ pathname: "/search", query: { q: item.name } }}
              key={i}
              className="px-2 border flex flex-col justify-center border-slate-200 rounded-xl aspect-[3/4] sm:aspect-auto sm:h-full w-[95%] sm:w-full max-w-[150px]"
            >
              <img src={item.image} className="w-full aspect-square object-cover" alt="icon" />
              <div className="text-[13px] sm:text-base text-center">{item.name}</div>
            </Link>
          ))}
        </div>
      </section>
      <MobileNav />
    </>
  );
};

export default Category;
