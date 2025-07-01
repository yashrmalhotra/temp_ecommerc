"use client";
import React, { useEffect, useState } from "react";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import ProductSkeletonLoader from "../ProductSkeletonLoader";
import axios from "axios";
import Pagination from "../Pagination";
import { SellerOrderProps } from "@/Types/type";
import FilterSortMenu from "../FilterSortMenu";
import Link from "next/link";
interface Status {
  status: "Pending" | "Send";
}
const statusBg = {
  Shipped: "bg-blue-700",
  Delivered: "bg-green-300",
  Returned: "bg-red-300",
  Refunded: "bg-red-500",
  "Return Approved": "bg-red-400",
};
const ReadOnlyOrders: React.FC<SellerOrderProps & Status> = ({ query, orders, setOrders, isLoading, setIsLoading, status }) => {
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rows, setRows] = useState<number>(5);
  const { userDetails } = useUserDetails()!;
  const [filter, setFilter] = useState<string>("");
  const [sort, setSort] = useState<string>("");

  const fetchOrders = async () => {
    try {
      setOrders([]);
      if (query !== "") {
        return;
      }
      setIsLoading(true);
      const { data } = await axios.get(`/api/seller/manageorder?uid=${userDetails?.uid}&page=${page}&rows=${rows}&status=${status}&filter=${filter}&sort=${sort}`);
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
  }, [page, rows, sort, filter]);

  if (isLoading) {
    return <ProductSkeletonLoader />;
  }
  const StatusText: React.FC<{ status: "Shipped" | "Delivered" | "Returned" }> = ({ status }) => {
    return <span className={`p-1 rounded-xl text-white ${statusBg[status]}`}>{status}</span>;
  };
  return (
    <>
      {status === "Send" && (
        <FilterSortMenu
          filterOptions={["Multi Quantity", "Shipped", "Delivered", "Returned", "Return Approved", "Refunded", "All"]}
          sortOptions={[
            "Order date: Newest first",
            "Order date: Oldest first",
            "Ship by date: Ascending",
            "Ship by date: Descending",
            "Price: Ascending",
            "Price: Descending",
            "Quantity: Ascending",
            "Quantity: Descending",
          ]}
          setSort={setSort}
          setFilter={setFilter}
        />
      )}
      <div className="overflow-x-scroll">
        <div className="header flex container md:ml-[2vw] mr-[2vw] mt-2 bg-slate-200  ">
          <div className="w-full grid grid-cols-[100px_100px_200px_110px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_20vw]">
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Image</div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Order date</div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Info</div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
              <span>Price</span>
              <span>Qty</span>
            </div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Status</div>
          </div>
        </div>
        <div className="flex flex-col container md:ml-[2vw] mr-[2vw] bg-slate-200  ">
          {orders.length > 0 ? (
            orders.map((item: any, i: number) => (
              <div key={i + 1} className="w-full grid grid-cols-[100px_100px_200px_110px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_20vw]">
                <div className="border-b bg-white">
                  <img src={item.product.images[0].url} alt="product" className="w-full h-full" />
                </div>
                <div className="border-b bg-white p-1 box-border  font-semibold w-full">
                  <div className="text-center font-semibold">{new Date(item?.createdAt).toLocaleDateString("en-GB")}</div>
                  <div className="text-center font-semibold">{new Date(item?.createdAt).toLocaleTimeString("en-IN", { hour12: true, timeZone: "Asia/Kolkata" })}</div>
                </div>
                <div className="border-b bg-white p-1 box-border font-semibold w-full flex flex-col">
                  <Link href={`/seller/manage-order/${item.oid}`}>#{item.oid}</Link>

                  <Link href={`/${item?.pid}`} className="line-clamp-2">
                    {item?.product?.basicInfo?.title}
                  </Link>
                  <div>{item?.pid}</div>
                </div>
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                  <div>Price: {item?.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
                  <div>Qty:{item?.qty}</div>
                </div>
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                  <StatusText status={item?.status} />
                </div>
              </div>
            ))
          ) : (
            <div className="font-bold text-xl ">No orders</div>
          )}
        </div>
      </div>
      <Pagination rows={rows} page={page} setPage={setPage} setRows={setRows} totalPages={totalPages} />
    </>
  );
};

export default ReadOnlyOrders;
