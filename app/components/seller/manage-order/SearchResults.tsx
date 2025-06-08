import React from "react";

import ProductSkeletonLoader from "../ProductSkeletonLoader"; // Ensure this is correctly imported

const SearchResults: React.FC<{ orders: any; isLoading: boolean }> = ({ orders, isLoading }) => {
  if (isLoading) {
    return (
      <>
        <ProductSkeletonLoader />
      </>
    );
  }

  return (
    <div className="overflow-x-scroll">
      <div className="header flex container md:ml-[2vw] mr-[2vw] mt-2 bg-slate-200">
        <div className="w-full grid grid-cols-[100px_100px_300px_100px_100px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_10vw_10vw] gap-[2px]">
          <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">#</div>
          <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Image</div>
          <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Order date</div>
          <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Title</div>
          <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
            <span>Price</span>
            <span>Qty</span>
          </div>
          <div className={`border-b bg-white p-1 box-border text-center font-semibold w-full`}>Status</div>
        </div>
      </div>

      <div className="flex flex-col container md:ml-[2vw] mr-[2vw] bg-slate-200">
        {orders.map((item: any, i: number) => (
          <div key={i} className="w-full grid grid-cols-[100px_100px_300px_100px_100px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_10vw_10vw] gap-[2px]">
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">{i + 1}</div>
            <div className="border-b bg-white">
              <img src={item.images[0].url} alt="product" className="w-full h-full" />
            </div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Order date</div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Title</div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
              <span>Price</span>
              <span>Qty</span>
            </div>
            <div className={`border-b bg-white p-1 box-border text-center font-semibold w-full`}>Status</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
