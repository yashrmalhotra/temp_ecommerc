import { Metadata } from "next";
import React, { Suspense } from "react";
import Order from "../components/buyer/order/Order";

const page = () => {
  return (
    <Suspense>
      <Order />;
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "Order",
};
export default page;
