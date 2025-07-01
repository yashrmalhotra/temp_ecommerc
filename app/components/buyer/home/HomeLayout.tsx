"use client";
import React, { useEffect, useState } from "react";
import "../../../CSS/Ecommerce.css";
import BannerSlider from "./BannerSlider";
import MobileNav from "../MobileNav";
import Header from "../Header";
import { ProductInfo } from "@/Types/type";
import ProductCard from "../ProductCard";
import axios from "axios";
const HomeLayout: React.FC = () => {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/api/home");
      setTrendingProducts(data.products);
    })();
  }, []);
  const calculateRatings = (ratings: number, raters: number) => {
    return ratings / raters;
  };
  return (
    <>
      <Header />
      <BannerSlider />
      {trendingProducts.length > 0 && (
        <div id="recentsearch" className=" rounded-lg box-border  my-10 mx-2 md:mx-4">
          <div className="border rounded-lg border-slate-200 my-10 mx-2 md:mx-4">
            <h1 className="px-7 pt-2 font-bold text-xl box-border text-center md:text-left">#Trending Products</h1>
            <div className="user-product grid md:grid-cols-3  place-items-center gap-x-2 gap-y-2 box-border 2xl:flex 2xl:justify-around">
              {trendingProducts.map((item: ProductInfo, i: number) => (
                <ProductCard
                  key={i}
                  title={item?.basicInfo?.title}
                  imageUrl={item?.images[0]?.url}
                  mrp={item?.offer?.mrp}
                  price={item?.offer?.price}
                  url={item?.pid as string}
                  prodId={item?._id}
                  ratings={item?.performance?.ratings && item?.performance?.numberOfRaters ? calculateRatings(item.performance.ratings, item.performance.numberOfRaters) : null}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </>
  );
};
export default HomeLayout;
