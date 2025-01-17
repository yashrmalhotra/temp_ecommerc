"use client";
import React, { useEffect, useState } from "react";
import "../../CSS/HomeLayout.css";
import BannerSlider from "./BannerSlider";
import ProductCard from "../ProductCard";
import MobileNav from "../MobileNav";
import Header from "../Header";
const HomeLayout: React.FC = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>(["1", "2", "3", "4", "5"]);
  return (
    <>
      <Header />
      <BannerSlider />
      <div id="recentsearch" className="border-2 rounded-lg box-border border-slate-300 my-10 mx-2 md:mx-4">
        <h1 className="px-7 pt-2 font-bold text-xl box-border text-center md:text-left">Recent Searches</h1>
        <div className="grid grid-cols-1  place-items-center gap-x-2 gap-y-2 box-border md:flex md:justify-around">
          {recentSearches.map((item: string, i: number) => (
            <ProductCard key={i} />
          ))}
        </div>
      </div>
      <div className="border-2 rounded-lg border-slate-300 my-10 mx-2 md:mx-4">
        <h1 className="px-7 pt-2 font-bold text-xl box-border text-center md:text-left">#Trending Products</h1>
        <div className="grid grid-cols-1  place-items-center gap-x-2 gap-y-2 box-border md:flex md:justify-around">
          {recentSearches.map((item: string, i: number) => (
            <ProductCard key={i} />
          ))}
        </div>
      </div>

      <MobileNav />
    </>
  );
};

export default HomeLayout;
