"use client";
import React from "react";
import SellerNavbar from "../SellerNavbar";
import Infocard from "../Infocard";
import ChartContainer from "./ChartContainer";

const Dashboard = () => {
  return (
    <>
      <SellerNavbar />
      <main className="mt-[110px]">
        <div className="flex flex-col md:flex-row my-2 gap-3 px-2">
          <Infocard text="Today Sales" stats={5} url={``} amount={true} />
          <Infocard text="Unit Solds" stats={5} url={``} />
          <Infocard text="Orders" stats={5} url={``} />
          <Infocard text="Payments" stats={5} url={``} amount={true} />
        </div>
        <div className="h-[50vh]">
          <ChartContainer />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
