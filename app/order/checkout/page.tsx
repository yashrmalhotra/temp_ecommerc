import Checkout from "@/app/components/buyer/order/Checkout";
import ProtectedBuyerRoute from "@/app/components/buyer/ProtectedBuyerRoute";
import { Metadata } from "next";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <ProtectedBuyerRoute>
        <Checkout />
      </ProtectedBuyerRoute>
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "GreatMart: Checkout",
};
export default page;
