import ManageReturn from "@/app/components/seller/manage-return/ManageReturn";
import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
import { Metadata } from "next";
import React from "react";

const page = () => {
  return (
    <ProtectedSellerRoute>
      <ManageReturn />
    </ProtectedSellerRoute>
  );
};
export const metadata: Metadata = {
  title: "Seller Manage Returns",
};
export default page;
