import React from "react";

import ProductSkeletonLoader from "../ProductSkeletonLoader"; // Ensure this is correctly imported
import Link from "next/link";
const statusBg = {
  Pending: "bg-yellow-300",
  Ordered: "bg-blue-300",
  Shipped: "bg-blue-700",
  Delivered: "bg-green-300",
  Returned: "bg-red-300",
};
const SearchResults: React.FC<{ orders: any; isLoading: boolean }> = ({ orders, isLoading }) => {
  if (isLoading) {
    return (
      <>
        <ProductSkeletonLoader />
      </>
    );
  }

  const StatusText: React.FC<{ status: "Pending" | "Ordered" | "Shipped" | "Delivered" | "Returned" }> = ({ status }) => {
    return <span className={`p-1 rounded-xl text-white ${statusBg[status]}`}>{status}</span>;
  };
  console.log("order sr ", orders);
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
        {orders.length > 0 ? (
          orders.map((item: any, i: number) => (
            <div key={i} className="w-full grid grid-cols-[100px_100px_300px_100px_100px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_10vw_10vw] gap-[2px]">
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">{i + 1}</div>
              <div className="border-b bg-white">
                <img src={item.product.images[0].url} alt="product" className="w-full h-full" />
              </div>
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                <div className="text-center font-semibold">{new Date(item?.createdAt).toLocaleDateString("en-GB")}</div>
                <div className="text-center font-semibold">{new Date(item?.createdAt).toLocaleTimeString("en-IN", { hour12: true, timeZone: "Asia/Kolkata" })}</div>
              </div>
              <div className="border-b bg-white p-1 box-border  font-semibold w-full">
                <div>{item.oid}</div>
                <Link href={`/${item?.pid}`} className="line-clamp-2">
                  {item?.product?.basicInfo?.title}
                </Link>
                <div>{item?.pid}</div>
              </div>
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                <div>Price: {item?.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
                <div>Qty:{item?.qty}</div>
              </div>
              <div className={`border-b bg-white p-1 box-border text-center font-semibold w-full`}>
                <StatusText status={item.status} />
              </div>
            </div>
          ))
        ) : (
          <div className="font-bold text-xl ">No orders</div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
