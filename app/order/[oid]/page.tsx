import Orderdetail from "@/app/components/buyer/order/Orderdetail";
import ProtectedBuyerRoute from "@/app/components/buyer/ProtectedBuyerRoute";
import { Metadata } from "next";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <ProtectedBuyerRoute>
        <Orderdetail />
      </ProtectedBuyerRoute>
    </Suspense>
  );
};

export const metadata: Metadata = {
  title: "Order detail page",
};

export default page;
