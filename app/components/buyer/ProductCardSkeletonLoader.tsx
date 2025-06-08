import React from "react";
import "../../CSS/Ecommerce.css";
const ProductCardSkeletonLoader: React.FC<{ layout: "list" | "column" }> = ({ layout }) => {
  const isList = layout === "list";
  return (
    <div className="box-border p-2 my-2 item animate-pulse">
      <div className={`rounded-xl bg-white shadow-sm ${isList ? "flex w-full gap-1 flex-col sm:flex-row" : "w-52 md:w-full p-2"}`}>
        <div className="skeleton-loader w-[70px] h-[100px] md:w-[150px] md:h-[100px] bg-gray-300 rounded-md relative mx-auto" />

        <div className="w-full flex flex-col justify-between">
          <div className={`skeleton-loader ${isList && "w-full"} h-[75%]`}>
            <div className="skeleton-loader w-full h-5 bg-gray-300 rounded mb-2" />
            <div className="skeleton-loader w-3/4 h-5 bg-gray-300 rounded mb-2" />
            <div className="skeleton-loader w-1/2 h-4 bg-gray-300 rounded mb-2" />
            <div className="flex flex-wrap gap-2 mt-1">
              <div className="skeleton-loader w-24 h-4 bg-gray-300 rounded" />
              <div className="skeleton-loader w-32 h-4 bg-gray-300 rounded" />
            </div>
          </div>

          <div className={`flex mt-3 ${layout === "column" ? "flex-col gap-2" : "gap-5"}`}>
            <div className="skeleton-loader h-8 w-full bg-gray-300 rounded" />
            <div className="skeleton-loader h-8 w-full bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeletonLoader;
