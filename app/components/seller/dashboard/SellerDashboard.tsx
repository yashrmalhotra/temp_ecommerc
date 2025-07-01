"use client";
import React, { useEffect, useState } from "react";
import SellerNavbar from "../SellerNavbar";
import Infocard from "../Infocard";
import ChartContainer from "./ChartContainer";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import axios from "axios";
import { SellerData } from "@/Types/type";

const Dashboard = () => {
  const [data, setData] = useState<SellerData>({ todaySalesAmount: 0, todayUnitSolds: 0, unshipedOrders: 0, totalAmount: 0, openReturns: 0, chartData: [] });
  const { userDetails } = useUserDetails()!;
  const [isLoading, setIsLoading] = useState<boolean>(false)!;
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/seller?uid=${userDetails?.uid}`);
        setData({
          todaySalesAmount: data.details?.todaySalesAmount[0] ?? 0,
          todayUnitSolds: data.details?.todayUnitSolds[0] ?? 0,
          totalAmount: data.details?.totalAmount[0] ?? 0,
          openReturns: data.details?.openReturns[0] ?? 0,
          unshipedOrders: data.details?.unshipedOrders[0] ?? 0,
          chartData: data.details.chartData,
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <SellerNavbar />
      <main className="mt-[110px]">
        <div className="flex flex-col md:flex-row my-2 gap-3 px-2">
          <Infocard text="Today Sales" stats={data.todaySalesAmount} amount={true} isLoading={isLoading} />
          <Infocard text="Unit Solds" stats={data.todayUnitSolds} isLoading={isLoading} />
          <Infocard text="Unshiped Orders" stats={data.unshipedOrders} isLoading={isLoading} />
          <Infocard text="Payments" stats={data.totalAmount} amount={true} isLoading={isLoading} />
          <Infocard text="Open Returns" stats={data.openReturns} isLoading={isLoading} />
        </div>
        <div className="h-[50vh]">
          <ChartContainer chartData={data.chartData} isLoading={isLoading} />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
