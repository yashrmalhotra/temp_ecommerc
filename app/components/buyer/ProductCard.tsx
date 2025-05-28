"use client";
import Image from "next/image";
import React from "react";
import "../../CSS/Ecommerce.css";
import { BuyerProductCard } from "@/Types/type";
import StarRatings from "./StarRatings";
import Link from "next/link";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const ProductCard: React.FC<BuyerProductCard> = ({ title, mrp, price, imageUrl, layout, url, discount }) => {
  const { status } = useUserDetails()!;
  const router = useRouter();
  const pathName = usePathname();
  const searchParms = useSearchParams();
  const handleAddToCart = () => {
    const redirectTo = `${pathName}?${searchParms.toString()}`;
    if (status === "unauthenticated") {
      router.replace(`/signin?cburl=${encodeURIComponent(redirectTo)}`);
    }
  };
  return (
    <div className="box-border p-2 my-2 item">
      <div className={`rounded-xl ${layout ? layout === "list" && "flex w-full gap-1 flex-col sm:flex-row" : "w-52 md:w-full p-2"} `}>
        <div className="w-[70px] h-[100px] md:w-[150px] md:h-[100px] relative mx-auto">
          <Image src={imageUrl} alt="product" fill className="aspect-[2/1] md:object-contain" />
        </div>

        <div className="w-full">
          <div id="price_title_button" className={`${layout === "list" && "w-full"} h-[75%] overflow-hidden`}>
            <Link href={url}>
              <div className="w-full text-sm  md:text-base text-ellipsis overflow-hidden max-h-1/2 line-clamp-2">{title}</div>
            </Link>
            <StarRatings rating={5} />
            <div className={`${layout === "list" ? "flex flex-col md:flex-row" : ""}`}>
              <div>
                <span>{price.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>&nbsp;
                {layout === "column" && <span className="text-green-500">({discount}% off)</span>}
              </div>
              <div className="text-slate-400">
                <span>MRP:</span>&nbsp;
                <span className="line-through">{mrp.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>&nbsp;
                {layout === "list" && <span className="text-green-500">({discount}% off)</span>}
              </div>
              &nbsp;
            </div>
          </div>
          <div className={` ${layout === "column" ? "w-full" : "w-1/4"}`}>
            <button onClick={handleAddToCart} className="bg-orange-500  text-white font-bold w-full rounded-md active:bg-orange-700 mt-2">
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
