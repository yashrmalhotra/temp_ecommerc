import Checkout from "@/app/components/buyer/order/Checkout";
import ProtectedBuyerRoute from "@/app/components/buyer/ProtectedBuyerRoute";
import React from "react";

const page = () => {
  return (
    <ProtectedBuyerRoute>
      <Checkout />
    </ProtectedBuyerRoute>
  );
};

export default page;
