"use client";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import axios from "axios";
import ThreeDotLoader from "../../ThreeDotLoader";
import "../../../CSS/Ecommerce.css";
import StarRatings from "../StarRatings";
import Link from "next/link";
import { ProductInfo } from "@/Types/type";

import { useTheme, useMediaQuery } from "@mui/material";
import ImageCarousel from "./ImageCarousel";
const ProductDetailPage: React.FC<{ pid: string }> = ({ pid }) => {
  const [product, setProduct] = useState<ProductInfo>();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/${pid}`);
        setProduct(data.product);

        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
      }
    })();
  }, []);

  return (
    <>
      {!product ? (
        <ThreeDotLoader />
      ) : (
        <>
          <Header />
          <section className="mt-[4.5rem]">
            <div className="container mx-auto flex flex-col md:flex-row gap-10 items-start">
              <ImageCarousel isDesktopView={isDesktop} images={product.images} />
              <div className="w-full box-border px-2 md:mx-0 md:w-[48%]">
                <Link href={{ pathname: "/search", query: { q: product.basicInfo.brandName } }} className="text-blue-500 visited:text-purple-500">
                  {product.basicInfo.brandName}
                </Link>
                <div className="font-bold md:text-xl">{product.basicInfo.title}</div>
                <div>
                  <StarRatings rating={5} />
                </div>
                <div>
                  <div>
                    <span>{product.offer.price.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>&nbsp;
                    <span className="text-slate-400 line-through">MRP:{product.offer.mrp.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>&nbsp;
                    {<span className="text-green-500">({Math.ceil(((product.offer.mrp - product.offer.price) / product.offer.mrp) * 100)}% off)</span>}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <button className="bg-cyan-500  text-white font-bold w-full rounded-md active:bg-cyan-700 mt-2">Buy now</button>
                  <button className="bg-orange-500  text-white font-bold w-full rounded-md active:bg-orange-700 mt-2">Add TO Cart</button>
                </div>
                <div className="mt-20 text-left">
                  <h1 className="text-xl font-bold ">Key Features</h1>
                  <ul className="list-disc ml-5 space-y-2">
                    {product.productDescription.bulletPoints.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="container box-border px-2 md:mx-auto mt-20">
              <h1 className="text-xl font-bold">Description</h1>
              {product.productDescription.description}
            </div>

            <div className="mt-20 container mx-auto box-border px-2 md:px-0">
              <h1 className="text-xl font-bold">Addition Info</h1>

              {product.additionalInfo &&
                product.additionalInfo.map((item: { key: string; value: string }, i: number) => (
                  <div key={i} className="grid grid-cols-2 border border-gray-400">
                    {
                      <>
                        <div className={`bg-gray-200 p-1 border ${i !== product.additionalInfo.length - 1 && "border-b-0"}`}>
                          {item.key.charAt(0).toUpperCase() + item.key.slice(1)}{" "}
                        </div>
                        <div className="p-1 border">{item.value.charAt(0).toUpperCase() + item.value.slice(1)} </div>
                      </>
                    }
                  </div>
                ))}

              <div className="grid grid-cols-2 border border-gray-400">
                <div className="bg-gray-200 p-1 border border-b-0">Product Dimensions</div>
                <div className="p-1 border border-b-0">
                  <span>{product.dimensions.productDimensions.length.digit}</span>
                  <span>{product.dimensions.productDimensions.length.unit}</span>
                  <span> x {product.dimensions.productDimensions.width.digit}</span>
                  <span>{product.dimensions.productDimensions.width.unit}</span>
                  <span> x {product.dimensions.productDimensions.height.digit}</span>
                  <span>{product.dimensions.productDimensions.height.unit}</span>
                  <span> (LxWxH)</span>
                </div>
              </div>
              <div className="grid grid-cols-2 border border-gray-400">
                <div className="bg-gray-200 p-1 border border-b-0">Product Weight</div>
                <div className="p-1 border border-b-0">
                  <span> {product.dimensions.productDimensions.weight.digit}</span>
                  <span> {product.dimensions.productDimensions.weight.unit}</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default ProductDetailPage;
