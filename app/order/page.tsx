import { Metadata } from "next";
import React from "react";
import Order from "../components/buyer/order/Order";

const page = () => {
  return <Order />;
};
export const metadata: Metadata = {
  title: "Ecommerce order",
};
export default page;
