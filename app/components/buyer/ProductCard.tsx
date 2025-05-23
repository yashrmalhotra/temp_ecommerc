import Image from "next/image";
import React from "react";
import "../../CSS/Ecommerce.css";
import { BuyerProductCard } from "@/Types/type";
import StarRatings from "./StarRatings";
import Link from "next/link";
const ProductCard: React.FC<BuyerProductCard> = ({ title, mrp, price, imageUrl, layout, url }) => {
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
                {layout === "column" && <span className="text-green-500">({Math.ceil(((mrp - price) / mrp) * 100)}% off)</span>}
              </div>
              <div className="text-slate-400">
                <span>MRP:</span>&nbsp;
                <span className="line-through">{mrp.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>&nbsp;
                {layout === "list" && <span className="text-green-500">({Math.ceil(((mrp - price) / mrp) * 100)}% off)</span>}
              </div>
              &nbsp;
            </div>
          </div>
          <div className={`flex ${layout === "column" ? "flex-col gap-1" : "gap-5"}`}>
            <button className="bg-cyan-500  text-white font-bold w-full rounded-md active:bg-cyan-700 mt-2">Buy now</button>
            <button className="bg-orange-500  text-white font-bold w-full rounded-md active:bg-orange-700 mt-2">Add TO Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
