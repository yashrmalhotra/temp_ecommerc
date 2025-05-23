"use client";
import React, { useState } from "react";
import "../../../CSS/Ecommerce.css";
import BannerSlider from "./BannerSlider";
import ProductCard from "../ProductCard";
import MobileNav from "../MobileNav";
import Header from "../Header";

const HomeLayout: React.FC = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>(["1", "2", "3", "4", "5", "6"]);
  return (
    <>
      <Header />
      <BannerSlider />
      <div id="recentsearch" className="border rounded-lg box-border border-slate-200 my-10 mx-2 md:mx-4">
        {/* <h1 className="px-7 pt-2 font-bold text-xl box-border text-center md:text-left">Recent Searches</h1>
        <div className="user-product grid  md:grid-cols-3 place-items-center gap-x-2 gap-y-2 box-border 2xl:flex 2xl:justify-around">
          {recentSearches.map((item: string, i: number) => (
            <ProductCard key={i} />
          ))}
        </div>
      </div>
      <div className="border rounded-lg border-slate-200 my-10 mx-2 md:mx-4">
        <h1 className="px-7 pt-2 font-bold text-xl box-border text-center md:text-left">#Trending Products</h1>
        <div className="user-product grid md:grid-cols-3  place-items-center gap-x-2 gap-y-2 box-border 2xl:flex 2xl:justify-around">
          {recentSearches.map((item: string, i: number) => (
            <ProductCard key={i} />
          ))}
        </div> */}
      </div>

      <MobileNav />
    </>
  );
};

export default HomeLayout;
