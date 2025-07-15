import ManageReturn from "@/app/components/seller/manage-return/ManageReturn";
import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
import { Metadata } from "next";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <ProtectedSellerRoute>
        <ManageReturn />
      </ProtectedSellerRoute>
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "GreatMart Seller: Manage Returns",
};
export default page;
