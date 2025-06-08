import React from "react";
import "../../CSS/Ecommerce.css";

const array = new Array(8).fill("");
const ProductSkeletonLoader = () => {
  return (
    <div className="header container md:ml-[2vw] mr-[2vw]  gap-1 bg-slate-200">
      {array.map((_, i) => (
        <div key={i} className="w-full grid gap-y-2 grid-cols-[50px_100px_300px_100px_100px_400px] md:grid-cols-[5vw_10vw_35vw_18vw_18vw_10vw]">
          <div className="border skeleton-loader bg-slate-300 w-full h-20" />
          <div className="border skeleton-loader bg-slate-300 w-full h-20" />
          <div className="border skeleton-loader bg-slate-300 w-full h-20" />
          <div className="border skeleton-loader bg-slate-300 w-full h-20" />
          <div className="border skeleton-loader bg-slate-300 w-full h-20" />
          <div className="border skeleton-loader bg-slate-300 w-full h-20" />
        </div>
      ))}
    </div>
  );
};

export default ProductSkeletonLoader;
