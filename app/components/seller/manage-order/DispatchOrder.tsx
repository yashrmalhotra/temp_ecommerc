"use client";
import React, { useEffect, useState } from "react";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import ProductSkeletonLoader from "../ProductSkeletonLoader";
import axios from "axios";
import FilterSortMenu from "../FilterSortMenu";
import Pagination from "../Pagination";
import { SellerOrderProps } from "@/Types/type";
import Link from "next/link";
import ThreeDotLoader from "../../ThreeDotLoader";
import { useSellerNotification } from "@/app/context/SellerNotificationProvider";

const DispatchOrder: React.FC<SellerOrderProps> = ({ query, orders, setOrders, isLoading, setIsLoading }) => {
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rows, setRows] = useState<number>(5);
  const { userDetails } = useUserDetails()!;
  const [filter, setFilter] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<number>();
  const [dispatchLoading, setDispatchLoading] = useState<boolean>(false);
  const { setOid } = useSellerNotification()!;
  const fetchOrders = async () => {
    try {
      setOrders([]);

      if (query !== "") {
        return;
      }
      setIsLoading(true);
      const { data } = await axios.get(`/api/seller/manageorder?uid=${userDetails?.uid}&page=${page}&rows=${rows}&status=Ordered&filter=${filter}&sort=${sort}`);
      const totalOrders = Number(data.orders.totalOrders);
      if (data?.orders?.orders.length > 0) {
        data.orders.orders.forEach((item: { isSelected: boolean }) => {
          item.isSelected = false;
        });
      }

      setTotalPages(Math.ceil(totalOrders / rows));
      setOrders(data.orders.orders);
      setOid([])

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
  }, [page, rows, query, filter, sort]);
  console.log("orders set", orders);

  const handleSelect = (index: number) => {
    const shallowOrders = [...orders];
    shallowOrders[index].isSelected = !shallowOrders[index].isSelected;
    const count = shallowOrders.filter((item) => item.isSelected);
    setSelectedOrder(count.length);
    setOrders(shallowOrders);
  };
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const shallowOrders = [...orders];
    shallowOrders.forEach((item: { isSelected: boolean }) => {
      item.isSelected = e.target.checked;
    });
    const count = shallowOrders.filter((item) => item.isSelected);

    setSelectedOrder(count.length);
    setOrders(shallowOrders);
  };
  if (isLoading) {
    return <ProductSkeletonLoader />;
  }
  const isAllSelected = orders.every((item: { isSelected: boolean }) => item.isSelected);

  const handleDispatch = async () => {
    const oids = orders.filter((item: any) => item.isSelected).map((item: any) => item.oid);
    try {
      setDispatchLoading(true);
      await axios.post("/api/seller/manageorder/dispatch", { oids });
      setOrders(orders.filter((item: any) => !item.isSelected));
    } catch (error) {
      console.log("error");
    } finally {
      setDispatchLoading(false);
    }
  };
  return (
    <>
      {dispatchLoading && <ThreeDotLoader />}
      <div className="ml-[2vw]">
        <FilterSortMenu
          filterOptions={["Multi Quantity", "Ship by today"]}
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
          setFilter={setFilter}
          setSort={setSort}
        />
      </div>
      <div className=" md:ml-[2vw] mr-[2vw] p-[2px] space-x-2 bg-slate-50">
        <span className="border h-full  p-1 bg-white ">Action selected: {selectedOrder ?? ""}</span>
        <button onClick={handleDispatch} className="border h-full p-1 bg-white active:bg-gray-200">
          Dispatch
        </button>
      </div>

      <div className="overflow-x-scroll">
        <div className="header flex container md:ml-[2vw] mr-[2vw] mt-2 bg-slate-200  ">
          <div className="w-full grid grid-cols-[20px_150px_300px_150px_150px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_10vw_10vw]">
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
              <input onChange={handleSelectAll} type="checkbox" checked={isAllSelected} />
            </div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Image</div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Order date</div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Info</div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
              <span>Price</span>/<span>Qty</span>
            </div>
            <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Ship By</div>
          </div>
        </div>

        <div className="flex flex-col container md:ml-[2vw] mr-[2vw] bg-slate-200  ">
          {orders.length > 0 ? (
            orders?.map((item: any, i: number) => (
              <div key={i + 1} className="w-full grid grid-cols-[20px_150px_300px_150px_150px_150px] md:grid-cols-[10vw_10vw_32vw_22vw_10vw_10vw]">
                <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                  <input onChange={() => handleSelect(i)} type="checkbox" checked={item?.isSelected} />
                </div>
                <div className="border-b bg-white">
                  <img src={item?.product?.images?.[0]?.url} alt="product" className="w-full h-full" />
                </div>
                <div className="border-b bg-white p-1 box-border  w-full">
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
                <div className="border-b bg-white p-1 box-border font-semibold w-full">
                  <div>Price: {item?.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
                  <div>Qty:{item?.qty}</div>
                </div>
                <div className="border-b bg-white p-1 box-border font-semibold w-full text-center">
                  <div>{new Date(item?.shipByDate).toLocaleDateString("en-GB")}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="font-bold text-xl ">No orders</div>
          )}
        </div>
      </div>

      <Pagination page={page} setPage={setPage} setRows={setRows} totalPages={totalPages} />
    </>
  );
};

export default DispatchOrder;
