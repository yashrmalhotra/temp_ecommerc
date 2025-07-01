"use client";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import axios from "axios";
import ThreeDotLoader from "../../ThreeDotLoader";
import "../../../CSS/Ecommerce.css";
import StarRatings from "../StarRatings";
import Link from "next/link";
import { ProductInfo } from "@/Types/type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme, useMediaQuery, dialogClasses } from "@mui/material";
import ImageCarousel from "./ImageCarousel";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import { addToCart } from "@/app/redux/cartSlice";
const ProductDetailPage: React.FC<{ pid: string }> = ({ pid }) => {
  const [product, setProduct] = useState<ProductInfo & { soldBy: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { status, userDetails } = useUserDetails()!;
  const cartItems = useAppSelector((state: any) => state.cart);
  const dispatchCartAction = useAppDispatch();
  const pathName = usePathname();
  const router = useRouter();
  const searchParms = useSearchParams();
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Record<string, any>[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/${pid}`);
        setProduct(data.product.productDetails);

        setIsAvailable(
          data.product?.productDetails?.createdByStatus === "active" && data.product?.productDetails?.offer.stock > 0 && data.product?.productDetails?.status === "live"
        );
        if (data.product?.productDetails?.reviews) {
          setReviews(data.product?.productDetails?.reviews);
        }
        console.log(data.product?.productDetails?.reviews, "data.product?.productDetails?.reviews");
      } catch (error) {
        console.log(error);
      } finally {
      }
    })();
  }, []);

  const handleAddToCart = async () => {
    const redirectTo = `${pathName}?${searchParms.toString()}`;
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace(`/signin?cburl=${encodeURIComponent(redirectTo)}`);
      return;
    }
    if (product?._id) {
      try {
        setIsLoading(true);
        await axios.post("/api/cart", { mode: "addItem", uid: userDetails?.uid, pid: product._id, qty: 1 });
        dispatchCartAction(addToCart([product._id, 1]));
      } catch (error: any) {
        console.log(error.response.data.msg);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleCheckOut = async () => {
    const redirectTo = `${pathName}?${searchParms.toString()}`;
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace(`/signin?cburl=${encodeURIComponent(redirectTo)}`);
      return;
    }
    if (userDetails?.uid && product) {
      const kw = searchParms.get("kw");
      router.replace(`/order/checkout?pid=${product?.pid}&price=${product?.offer.price}&qty=${quantity}&kw=${kw}&soldBy=${product.createdBy}`);
    }
  };

  const handleSelectQty = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };
  const calculateRatings = (ratings: number, raters: number) => {
    return ratings / raters;
  };
  return (
    <>
      {!product ? (
        <ThreeDotLoader />
      ) : (
        <>
          {isLoading && <ThreeDotLoader />}
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
                  {product?.performance?.ratings && product?.performance?.numberOfRaters && (
                    <StarRatings rating={calculateRatings(product?.performance?.ratings, product?.performance?.numberOfRaters)} />
                  )}
                </div>
                <div>
                  <div>
                    <span>{product.offer.price.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>&nbsp;
                    <span className="text-slate-400 line-through">MRP:{product.offer.mrp.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>&nbsp;
                    {<span className="text-green-500">({Math.round(((product.offer.mrp - product.offer.price) / product.offer.mrp) * 100)}% off)</span>}
                  </div>
                </div>

                {isAvailable ? (
                  <>
                    <span className="flex bg-slate-100 p-2 rounded-xl space-x-1">
                      <label htmlFor="">Qty:</label>
                      <select onChange={handleSelectQty} value={quantity} name="" id="" className="bg-inherit">
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    </span>
                    <div className="flex flex-col md:flex-row gap-2">
                      <button
                        onClick={handleCheckOut}
                        className="bg-cyan-500  text-white font-bold w-full rounded-md active:bg-cyan-700 active:outline outline-4 outline-offset-2 outline-blue-400 mt-2"
                      >
                        Buy now
                      </button>
                      <button
                        onClick={handleAddToCart}
                        disabled={Object.keys(cartItems).some((item: string) => item === product._id)}
                        className="bg-orange-500 disabled:bg-orange-200 disabled:cursor-not-allowed text-white font-bold w-full rounded-md active:bg-orange-700 mt-2 active:outline outline-4 outline-offset-2 outline-orange-400"
                      >
                        {Object.keys(cartItems).some((item: string) => item === product._id) ? <span>Added to cart</span> : <span>Add to cart</span>}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="font-bold text-red-500">Currently Unavailable</div>
                )}
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
              <div className="grid grid-cols-2 border border-gray-400">
                <div className="bg-gray-200 p-1 border border-b-0">Manufacturer</div>
                <div className="p-1 border border-b-0">{product.basicInfo.manufacturer.charAt(0).toUpperCase() + product.basicInfo.manufacturer.slice(1)}</div>
              </div>
              {product.additionalInfo &&
                product.additionalInfo.map((item: { key: string; value: string }, i: number) => (
                  <div key={i} className="grid grid-cols-2 border border-gray-400">
                    {
                      <>
                        <div className={`bg-gray-200 p-1 border ${i !== product.additionalInfo.length - 1 && "border-b-0"}`}>
                          {item.key.charAt(0).toUpperCase() + item.key.slice(1)}
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

            {reviews.length > 0 && (
              <div className="mt-20 container mx-auto box-border px-2 md:px-0">
                <h1 className="text-base md:text-xl font-bold">Reviews</h1>
                {reviews.map((item: any, i: number) => (
                  <div key={i} className="p-2">
                    <div className="font-bold">{item?.name}</div>
                    <div>
                      <StarRatings rating={item?.rating} />
                    </div>
                    <div>{item?.review}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
};

export default ProductDetailPage;
