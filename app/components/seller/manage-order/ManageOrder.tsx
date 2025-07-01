"use client";
import React, { useState } from "react";

import SellerNavbar from "../SellerNavbar";
import OrderSearchInput from "../OrderSearchInput";
import DispatchOrder from "./DispatchOrder";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import axios from "axios";
import SearchResults from "./SearchResults";
import ReadOnlyOrders from "./ReadOnlyOrder";

const ManageOrder = () => {
  const [tab, setTab] = useState<"Pending" | "Unshiped" | "Send">("Unshiped");
  const [query, setQuery] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { userDetails } = useUserDetails()!;

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/api/seller/manageorder?uid=${userDetails?.uid}&query=${query}`);
      setOrders(data.orders.orders);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <SellerNavbar />
      <section className="mt-[87px] pb-7 overflow-x-hidden">
        <header className="flex md:w-full ">
          <div className="flex-shrink-0  w-full  p-3 flex gap-10">
            <OrderSearchInput style="flex-shrink-0 w-52 md:w-[20%]" setQuery={setQuery} handleSearch={handleSearch} />
          </div>
        </header>
        {!query ? (
          <div className="w-full mt-2 flex gap-10 p-3">
            <button onClick={() => setTab("Pending")} className={`text-xl ${tab === "Pending" && "border-b-2 border-blue-500"}`}>
              Pending
            </button>
            <button onClick={() => setTab("Unshiped")} className={`text-xl ${tab === "Unshiped" && "border-b-2 border-blue-500"}`}>
              Unshiped
            </button>
            <button onClick={() => setTab("Send")} className={`text-xl ${tab === "Send" && "border-b-2 border-blue-500"}`}>
              Send
            </button>
          </div>
        ) : (
          <SearchResults orders={orders} isLoading={isLoading} />
        )}

        {tab === "Pending" && !query && <ReadOnlyOrders query={query} orders={orders} setOrders={setOrders} isLoading={isLoading} setIsLoading={setIsLoading} status="Pending" />}
        {tab === "Unshiped" && !query && <DispatchOrder query={query} orders={orders} setOrders={setOrders} isLoading={isLoading} setIsLoading={setIsLoading} />}
        {tab === "Send" && !query && <ReadOnlyOrders query={query} orders={orders} setOrders={setOrders} isLoading={isLoading} setIsLoading={setIsLoading} status="Send" />}
      </section>
    </>
  );
};

export default ManageOrder;
