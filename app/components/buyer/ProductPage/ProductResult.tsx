"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ProductCard from "../ProductCard";
import { CiViewColumn } from "react-icons/ci";
import { FaListUl } from "react-icons/fa";
import SlidingWindowPagination from "./SlidingWindowPagination";
import { useSearchContext } from "@/app/context/SearchProvider";
import ProductCardSkeletonLoader from "../ProductCardSkeletonLoader";
import { ProductInfo } from "@/Types/type";
import axios from "axios";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import { useSearchParams } from "next/navigation";
import MobileNav from "../MobileNav";

const ProductResult: React.FC<{ products: ProductInfo[]; totalPages: number }> = ({ products, totalPages }) => {
  const [layout, setLayout] = useState<"list" | "column">("list");
  const searchContext = useSearchContext()!;
  const { userDetails } = useUserDetails()!;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const viewedIdsRef = useRef<Set<string>>(new Set());
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const searchParms = useSearchParams();

  // Set up observer only if user is logged in
  useEffect(() => {
    if (!userDetails?.uid || !products.length) return;

    viewedIdsRef.current = new Set();
    setViewedIds([]);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            if (id && !viewedIdsRef.current.has(id)) {
              viewedIdsRef.current.add(id);
              setViewedIds(Array.from(viewedIdsRef.current));
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [products, userDetails]);

  const observeRef = (el: HTMLDivElement | null) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  };

  // API call to track viewed product IDs
  useEffect(() => {
    (async () => {
      if (viewedIds.length && userDetails) {
        try {
          await axios.post("/api/update-views", {
            pids: viewedIds,
            viewedBy: userDetails.uid,
          });
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [viewedIds, userDetails]);

  const handleClick = async (pid: string) => {
    if (userDetails) {
      try {
        await axios.post("/api/update-click", {
          pid,
          clickedBy: userDetails.uid,
          clickedOnKeyword: searchParms.get("q"),
        });
      } catch (error: any) {
        console.log(error);
      }
    }
  };
  const calculateRatings = (ratings: number, raters: number) => {
    return ratings / raters;
  };
  return (
    <section className="w-full box-border px-2 md:relative md:top-[4.2rem] md:left-[30%] md:w-[70%]">
      {searchContext?.isLoading ? (
        <>
          {Array(10)
            .fill("")
            .map((_, i) => (
              <ProductCardSkeletonLoader key={i} layout={layout} />
            ))}
        </>
      ) : (
        <>
          <div className="min-h-[80vh]">
            <div className="bg-slate-200 p-2 left-[30%] w-full hidden md:flex justify-end">
              <div className="flex gap-5">
                <button
                  onClick={() => setLayout("column")}
                  className={`active:bg-blue-400 active:text-white p-2 ${layout === "column" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                >
                  <CiViewColumn size={20} />
                </button>
                <button onClick={() => setLayout("list")} className={`active:bg-blue-400 active:text-white p-2 ${layout === "list" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
                  <FaListUl size={20} />
                </button>
              </div>
            </div>

            <div className={`${layout === "list" ? "block w-full" : "grid md:grid-cols-2 2xl:grid-cols-3"}`}>
              {products.map((item: any, i: number) => (
                <div onClick={() => handleClick(item.pid as string)} ref={observeRef} key={item.pid as string} data-id={item.pid}>
                  <ProductCard
                    url={item.pid as string}
                    title={item.basicInfo.title}
                    mrp={item.offer.mrp}
                    price={item.offer.price}
                    imageUrl={item.images[0].url}
                    layout={layout}
                    discount={item.discountPercentage}
                    prodId={item._id}
                    query={searchParms.get("q") as string}
                    ratings={item?.ratings}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <SlidingWindowPagination totalPages={Math.ceil(totalPages / 10)} />
          </div>

          <MobileNav />
        </>
      )}
    </section>
  );
};

export default ProductResult;
