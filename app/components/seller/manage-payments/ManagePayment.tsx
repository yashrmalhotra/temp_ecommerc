"use client";
import React, { useEffect, useState } from "react";
import SellerNavbar from "../SellerNavbar";
import OrderSearchInput from "../OrderSearchInput";
import Pagination from "../Pagination";
import ProductSkeletonLoader from "../ProductSkeletonLoader";
import FilterSortMenu from "../FilterSortMenu";
import axios from "axios";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
const ManagePayment = () => {
  const [query, setQuery] = useState<string>("");
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(5);
  const { userDetails } = useUserDetails()!;

  const fetchPayments = async () => {
    if (query !== "") return;
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/api/seller/managepayment?uid=${userDetails?.uid}&page=${page}&rows=${rows}`);
      setPayments(data.payments.payments);
      const totalPayments = Number(data.payments.totalPayments);

      setTotalPages(Math.ceil(totalPayments / rows));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPayments();
  }, [page, rows, query]);

  const handleSearch = async () => {
    try {
      setPayments([]);
      setIsLoading(true);
      const { data } = await axios.get(`/api/seller/managepayment?uid=${userDetails?.uid}&query=${query}`);
      setPayments(data.payments.payments);
      const totalPayments = Number(data.payments.totalPayments);

      setTotalPages(Math.ceil(totalPayments / rows));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const StatusText = (status: string) => {
    return <span className={`p-2 rounded-xl ${status}`}>{status}</span>;
  };
  return (
    <>
      <SellerNavbar />
      <section className="mt-[87px] pb-7 overflow-x-hidden">
        <header className="flex md:w-full flex-col">
          <div className="flex-shrink-0 w-full p-3 flex gap-10">
            <OrderSearchInput style="flex-shrink-0 w-52 md:w-[20%]" setQuery={setQuery} handleSearch={handleSearch} />
          </div>

          <div className="px-3">
            <FilterSortMenu
              filterOptions={["E Payment", "COD", "Multi Quantity", "Delieverd"]}
              sortOptions={["Order date: Newest first", "Order date: Oldest first", "Price: Ascending", "Price: Descending", "Quantity: Ascending", "Quantity: Descending"]}
            />
          </div>
        </header>
        {isLoading ? (
          <ProductSkeletonLoader />
        ) : payments.length === 0 ? (
          <div className="h-[calc(100vh-87px)] flex justify-center items-center">No payments</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <div className="header container md:ml-[2vw] mr-[2vw] mt-2 bg-slate-200  ">
                <div className="w-full grid grid-cols-[100px_100px_200px_110px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_20vw]">
                  <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Payment Type</div>
                  <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Order date</div>
                  <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Info</div>
                  <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Price/Qty</div>
                  <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Amount Paid (price x qty)</div>
                </div>
                {payments.map((item: any, i: number) => (
                  <div key={i + 1} className="w-full grid grid-cols-[100px_100px_200px_110px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_20vw]">
                    <div className="border-b bg-white p-1 ">Paymant Type</div>
                    <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Order date</div>
                    <div className="border-b bg-white p-1 box-border font-semibold w-full">
                      <div>Order id</div>
                      <div>Title</div>
                    </div>
                    <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                      <div>Price</div>
                      <div>Qty</div>
                    </div>
                    <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">price*qty</div>
                  </div>
                ))}
              </div>
            </div>
            <Pagination page={page} setPage={setPage} totalPages={totalPages} setRows={setRows} />
          </>
        )}
      </section>
    </>
  );
};

export default ManagePayment;
