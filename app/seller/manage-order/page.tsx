import ManageOrder from "@/app/components/seller/manage-order/ManageOrder";
import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
import { Metadata } from "next";
import React from "react";

const page = () => {
  return (
    <>
      <ProtectedSellerRoute>
        <ManageOrder />
      </ProtectedSellerRoute>
    </>
  );
};
export const metadata: Metadata = {
  title: "Seller - Manage Order",
};
export default page;
