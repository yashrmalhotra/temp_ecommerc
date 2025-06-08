"use client";
import React, { useState } from "react";
import SellerNavbar from "../SellerNavbar";
import OrderSearchInput from "../OrderSearchInput";
import Pagination from "../Pagination";
import ProductSkeletonLoader from "../ProductSkeletonLoader";
import FilterSortMenu from "../FilterSortMenu";
const ManageReturn = () => {
  const [query, setQuery] = useState<string>("");
  const [returns, setReturns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSearch = async () => {
    console.log("query", query);
  };

  return (
    <>
      <SellerNavbar />
      {isLoading ? (
        <ProductSkeletonLoader />
      ) : (
        <section className="mt-[87px] pb-7 overflow-x-hidden">
          <header className="flex md:w-full flex-col">
            <div className="flex-shrink-0 w-full p-3 flex gap-10">
              <OrderSearchInput style="flex-shrink-0 w-52 md:w-[20%]" setQuery={setQuery} handleSearch={handleSearch} />
            </div>
            {query === "" && (
              <div className="px-3">
                <FilterSortMenu filterOptions={["E Payment", "COD", "Multi Quantity"]} sortOptions={["Order date: Newest first", "Order date: Oldest first"]} />
              </div>
            )}
          </header>
          <div className="overflow-x-auto">
            <div className="header flex container md:ml-[2vw] mr-[2vw] mt-2 bg-slate-200  ">
              <div className="w-full grid grid-cols-[100px_100px_200px_110px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_20vw] gap-[2px]">
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Image</div>
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Order date</div>
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Title</div>
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Return date</div>
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Status</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ManageReturn;
