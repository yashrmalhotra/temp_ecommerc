"use client";
import React, { useEffect, useState } from "react";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import ProductSkeletonLoader from "../ProductSkeletonLoader";
import axios from "axios";
import Pagination from "../Pagination";
import { SellerOrderProps } from "@/Types/type";
import FilterSortMenu from "../FilterSortMenu";

interface Status {
  status: "Pending" | "Send";
}
const ReadOnlyOrders: React.FC<SellerOrderProps & Status> = ({ query, orders, setOrders, isLoading, setIsLoading, status }) => {
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rows, setRows] = useState<number>(5);
  const { userDetails } = useUserDetails()!;

  const fetchOrders = async () => {
    try {
      setOrders([]);
      setIsLoading(true);
      const { data } = await axios.get(`/api/seller/manageorder?uid=${userDetails?.uid}&page=${page}&rows=${rows}`);
      const totalOrders = Number(data.orders.totalOrders);

      if (data?.orders?.orders.lenght > 0) {
        data.orders.orders.forEach((item: { isSelected: boolean }) => {
          item.isSelected = false;
        });
      }
      setTotalPages(Math.ceil(totalOrders / rows));
      setOrders(data.orders.orders);

      if (totalOrders <= rows) {
        setPage(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [page, rows]);

  if (isLoading) {
    return <ProductSkeletonLoader />;
  }
  console.log("status", status);
  return (
    <>
      {status === "Send" && <FilterSortMenu filterOptions={["COD", "E Payment", "Multi Quantity", "Shipped", "Delivered", "All"]} />}
      <div className="overflow-x-scroll">
        <div className="header flex container md:ml-[2vw] mr-[2vw] mt-2 bg-slate-200  ">
          <div className="w-full grid grid-cols-[100px_100px_200px_110px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_20vw] gap-[2px]">
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Image</div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Order date</div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Title</div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
              <span>Price</span>
              <span>Qty</span>
            </div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Status</div>
          </div>
        </div>
        <div className="flex flex-col container md:ml-[2vw] mr-[2vw] bg-slate-200  ">
          {orders.map((item: any, i: number) => (
            <div key={i + 1} className="w-full grid grid-cols-[100px_100px_200px_110px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_20vw] gap-[2px]">
              <div className="border-b bg-white">
                <img src={item.images[0].url} alt="product" className="w-full h-full" />
              </div>
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Order date</div>
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Title</div>
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                <span>Price</span>
                <span>Qty</span>
              </div>
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                {status === "Pending" ? (
                  <span className="p-1 rounded-xl bg-yellow-300 text-white">Pending</span>
                ) : (
                  <span className={`p-1 rounded-xl bg-blue-300 text-white`}>Status</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination page={page} setPage={setPage} setRows={setRows} totalPages={totalPages} />
    </>
  );
};

export default ReadOnlyOrders;
