import React from "react";
import Cart from "../components/buyer/cart/Cart";
import ProtectedBuyerRoute from "../components/buyer/ProtectedBuyerRoute";
import { Metadata } from "next";

const page = () => {
  return (
    <ProtectedBuyerRoute>
      <Cart />
    </ProtectedBuyerRoute>
  );
};

export const metadata: Metadata = {
  title: "Cart",
};

export default page;
