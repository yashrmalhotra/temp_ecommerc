import ManagePayment from "@/app/components/seller/manage-payments/ManagePayment";
import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
import { Metadata } from "next";
import React from "react";

const page = () => {
  return (
    <ProtectedSellerRoute>
      <ManagePayment />
    </ProtectedSellerRoute>
  );
};
export const metadata: Metadata = {
  title: "Seller - Manage Payment",
};
export default page;
