import Checkout from "@/app/components/buyer/order/Checkout";
import ProtectedBuyerRoute from "@/app/components/buyer/ProtectedBuyerRoute";
import { Metadata } from "next";
import React from "react";

const page = () => {
  return (
    <ProtectedBuyerRoute>
      <Checkout />
    </ProtectedBuyerRoute>
  );
};
export const metadata: Metadata = {
  title: "Checkout",
};
export default page;
