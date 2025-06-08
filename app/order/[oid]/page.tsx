import Orderdetail from "@/app/components/buyer/order/Orderdetail";
import ProtectedBuyerRoute from "@/app/components/buyer/ProtectedBuyerRoute";
import { Metadata } from "next";
import React from "react";

const page = () => {
  return (
    <ProtectedBuyerRoute>
      <Orderdetail />
    </ProtectedBuyerRoute>
  );
};

export const metadata: Metadata = {
  title: "Order detail page",
};

export default page;
