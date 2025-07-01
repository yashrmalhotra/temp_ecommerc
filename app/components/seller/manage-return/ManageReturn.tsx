"use client";
import React, { useEffect, useState } from "react";
import SellerNavbar from "../SellerNavbar";
import OrderSearchInput from "../OrderSearchInput";
import Pagination from "../Pagination";
import ProductSkeletonLoader from "../ProductSkeletonLoader";
import FilterSortMenu from "../FilterSortMenu";
import axios from "axios";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import Link from "next/link";
import ThreeDotLoader from "../../ThreeDotLoader";
type StatusType = "Created" | "Return Approved" | "Refunded";

const statusBg: Record<StatusType, string> = {
  Created: "bg-blue-500",
  "Return Approved": "bg-yellow-300",
  Refunded: "bg-green-300",
};
const ManageReturn = () => {
  const [query, setQuery] = useState<string>("");
  const [returns, setReturns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReturnLoading, setIsReturnLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<number>(5);
  const [filter, setFiter] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(5);
  const { userDetails } = useUserDetails()!;

  const fetchReturns = async () => {
    if (query !== "") return;
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/api/seller/managereturn?uid=${userDetails?.uid}&page=${page}&rows=${rows}`);
      setReturns(data.returns.returns);
      const totalReturns = Number(data.returns.totalReturns);

      setTotalPages(Math.ceil(totalReturns / rows));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchReturns();
  }, [page, rows, query]);
  const StatusText: React.FC<{ status: StatusType }> = ({ status }) => {
    return <span className={`p-1 rounded-xl ${statusBg[status]}`}>{status}</span>;
  };
  const handleSearch = async () => {
    try {
      setReturns([]);
      setIsLoading(true);
      const { data } = await axios.get(`/api/seller/managereturn?uid=${userDetails?.uid}&query=${query}`);
      setReturns(data.returns.returns);
      const totalReturns = Number(data.returns.totalReturns);

      setTotalPages(Math.ceil(totalReturns / rows));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnApproved = async (oid: string) => {
    try {
      setIsReturnLoading(true);
      await axios.post("/api/seller/managereturn", { oid });
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsReturnLoading(false);
    }
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
              filterOptions={["On route cancel", "Do not recieve", "Return after recieved"]}
              sortOptions={["Order date: Newest first", "Order date: Oldest first", "Return date: Newest First", "Return date: Oldest First"]}
              setFilter={setFiter}
              setSort={setSort}
            />
          </div>
        </header>
        {isLoading ? (
          <ProductSkeletonLoader />
        ) : returns.length === 0 ? (
          <div className="h-[calc(100vh-87px)] flex justify-center items-center">No returs</div>
        ) : (
          <>
            {isReturnLoading && <ThreeDotLoader />}
            <div className="overflow-x-auto">
              <div className="header container md:ml-[2vw] mr-[2vw] mt-2 bg-slate-200  ">
                <div className="w-full grid grid-cols-[100px_100px_200px_110px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_20vw]">
                  <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Image</div>
                  <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Return date</div>
                  <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Info</div>
                  <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Status</div>
                  <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Action</div>
                </div>
                {returns.map((item: any, i: number) => (
                  <div key={i + 1} className="w-full grid grid-cols-[100px_100px_200px_110px_100px] md:grid-cols-[10vw_10vw_32vw_22vw_20vw]">
                    <div className="border-b bg-white p-1 ">
                      <img src={item.product.images[0].url} alt="product" className="w-full h-full" />
                    </div>
                    <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                      <div>{new Date(item.createdAt).toLocaleDateString("en-GB")}</div>
                      <div>{new Date(item.createdAt).toLocaleTimeString("en-GB", { hour12: true, timeZone: "Asia/Kolkata" })}</div>
                    </div>
                    <div className="border-b bg-white p-1 box-border font-semibold w-full flex flex-col">
                      <Link href={`/seller/manage-order/${item.oid}`}>#{item.oid}</Link>
                      <Link href={`/${item.pid}`} className="line-clamp-2">
                        {item?.product?.basicInfo?.title}
                      </Link>
                      <div>{item.pid}</div>
                    </div>
                    <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">
                      <StatusText status={item?.status} />
                    </div>
                    <div className="border-b bg-white p-1 box-border text-center font-semibold w-full flex flex-col">
                      {item?.status === "Created" && (
                        <button onClick={() => handleReturnApproved(item.oid)} className="rounded-xl p-1  text-white bg-blue-400 active:bg-blue-500">
                          Approve Return
                        </button>
                      )}
                      {(item?.status === "Return Approved" || item.status === "Refunded") && <div className="rounded-xl p-1 text-white bg-gray-400 ">No Actions Due</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Pagination rows={rows} page={page} setPage={setPage} totalPages={totalPages} setRows={setRows} />
          </>
        )}
      </section>
    </>
  );
};

export default ManageReturn;
