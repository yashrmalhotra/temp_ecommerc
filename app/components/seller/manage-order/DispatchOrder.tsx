"use client";
import React, { useEffect, useState } from "react";
import SellerNavbar from "../SellerNavbar";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import ProductSkeletonLoader from "../ProductSkeletonLoader";
import axios from "axios";
import FilterSortMenu from "../FilterSortMenu";
import Pagination from "../Pagination";
import { useTheme, useMediaQuery } from "@mui/material";
import { SellerOrderProps } from "@/Types/type";

const DispatchOrder: React.FC<SellerOrderProps> = ({ query, orders, setOrders, isLoading, setIsLoading }) => {
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rows, setRows] = useState<number>(5);
  const { userDetails } = useUserDetails()!;
  const fetchOrders = async () => {
    try {
      setOrders([]);
      setIsLoading(true);
      if (query !== "") {
        return;
      }
      const { data } = await axios.get(`/api/seller/manageorder?uid=${userDetails?.uid}&page=${page}&rows=${rows}&query=${query}`);
      const totalOrders = Number(data.orders.totalOrders);
      console.log("data", data);
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
  }, [page, rows, query]);

  const handleSelect = (index: number) => {
    const shallowOrders = [...orders];
    shallowOrders[index].isSelected = !shallowOrders[index].isSelected;
    setOrders(shallowOrders);
  };
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const shallowOrders = [...orders];
    shallowOrders.forEach((item: { isSelected: boolean }) => {
      item.isSelected = e.target.checked;
    });
    setOrders(shallowOrders);
  };
  if (isLoading) {
    return <ProductSkeletonLoader />;
  }
  const isAllSelected = orders.every((item: { isSelected: boolean }) => item.isSelected);
  return (
    <>
      <>
        <div className="ml-[2vw]">
          <FilterSortMenu
            filterOptions={["COD", "E Payment", "Multi Quantity", "Ship by today"]}
            sortOptions={["Order date: Newest first", "Order date: Oldest first", "Ship by date: Ascending", "Ship by date: Descending"]}
          />
        </div>
        <div className=" md:ml-[2vw] mr-[2vw] p-[2px] space-x-2 bg-slate-50">
          <span className="border h-full  p-1 bg-white ">Action selected:</span>
          <button className="border h-full p-1 bg-white active:bg-gray-200">Dispatch</button>
        </div>

        <div className="overflow-x-scroll">
          <div className="header flex container md:ml-[2vw] mr-[2vw] mt-2 bg-slate-200  ">
            <div className="w-full grid grid-cols-[20px_150px_300px_150px_150px] md:grid-cols-[10vw_10vw_32vw_22vw_20vw] gap-[2px]">
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                <input onChange={handleSelectAll} type="checkbox" checked={isAllSelected} />
              </div>
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Image</div>
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Order date</div>
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Title</div>
              <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                <span>Price</span>
                <span>Qty</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col container md:ml-[2vw] mr-[2vw] bg-slate-200  ">
            {orders.map((item: any, i: number) => (
              <div key={i + 1} className="w-full grid grid-cols-[20px_150px_300px_150px_150px] md:grid-cols-[10vw_10vw_32vw_22vw_20vw] gap-[2px]">
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                  <input onChange={() => handleSelect(i)} type="checkbox" checked={item.isSelected} />
                </div>
                <div className="border-b bg-white">
                  <img src={item.images[0].url} alt="product" className="w-full h-full" />
                </div>
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Order date</div>
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Title</div>
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                  <span>Price</span>
                  <span>Qty</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Pagination page={page} setPage={setPage} setRows={setRows} totalPages={totalPages} />
      </>
    </>
  );
};

export default DispatchOrder;
