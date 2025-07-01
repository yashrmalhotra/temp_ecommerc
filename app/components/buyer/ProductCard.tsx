"use client";
import Image from "next/image";
import React, { useState } from "react";
import "../../CSS/Ecommerce.css";
import { BuyerProductCard } from "@/Types/type";
import StarRatings from "./StarRatings";
import Link from "next/link";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { addToCart } from "@/app/redux/cartSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loader from "../Loader";
import axios from "axios";
const ProductCard: React.FC<BuyerProductCard> = ({ title, mrp, price, imageUrl, layout, url, discount, prodId, query, ratings }) => {
  const { status, userDetails } = useUserDetails()!;
  const dispatchCartAction = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cartItems = useAppSelector((state) => state.cart);
  const [error, setError] = useState<string>("");
  const pathName = usePathname();
  const router = useRouter();
  const searchParms = useSearchParams();
  const handleAddToCart = async () => {
    const redirectTo = `${pathName}?${searchParms.toString()}`;
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace(`/signin?cburl=${encodeURIComponent(redirectTo)}`);
      return;
    }
    try {
      console.log("pid", prodId);
      setIsLoading(true);
      await axios.post("/api/cart", { mode: "addItem", uid: userDetails?.uid, pid: prodId, qty: 1 });
      dispatchCartAction(addToCart([prodId, 1]));
    } catch (error: any) {
      console.log(error.response.data.msg);
      setError(error.response.data.msg);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("inside pc", ratings);

  return (
    <div className="box-border p-2 my-2 item">
      <div className={`rounded-xl ${layout ? layout === "list" && "flex w-full gap-1 flex-col sm:flex-row" : "w-52 md:w-full p-2"} `}>
        <div className="w-[70px] h-[100px] md:w-[150px] md:h-[100px] relative mx-auto">
          <Image src={imageUrl} alt="product" fill className="aspect-[2/1] md:object-contain" />
        </div>

        <div className="w-full">
          <div id="price_title_button" className={`${layout === "list" && "w-full"} h-[75%] overflow-hidden`}>
            <Link
              href={{
                pathname: url,
                query: { kw: query },
              }}
            >
              <div className="w-full text-sm  md:text-base text-ellipsis overflow-hidden max-h-1/2 line-clamp-2">{title}</div>
            </Link>
            {ratings > 0 && <StarRatings rating={ratings} />}
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
          <div className={` ${layout === "column" ? "w-full" : "w-full md:w-1/4"}`}>
            {isLoading ? (
              <div className="bg-orange-300 w-full h-7 flex justify-center rounded-md ">
                <Loader width="w-5" height="h-5" />
              </div>
            ) : error ? (
              <div className="bg-red-500 w-full h-7 text-white font-bold text-center">{error}</div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={Object.keys(cartItems).some((item: string) => item === prodId)}
                className="bg-orange-500 disabled:bg-orange-200 disabled:cursor-not-allowed  text-white font-bold w-full h-7 rounded-md active:bg-orange-700 mt-2 active:outline outline-4 outline-offset-2 outline-blue-400"
              >
                {Object.keys(cartItems).some((item: string) => item === prodId) ? <span>Added to cart</span> : <span>Add to cart</span>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
