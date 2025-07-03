import ManageOrder from "@/app/components/seller/manage-order/ManageOrder";
import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
import { Metadata } from "next";
import React, { Suspense } from "react";

const page = () => {
  return (
    <>
      <Suspense>
        <ProtectedSellerRoute>
          <ManageOrder />
        </ProtectedSellerRoute>
      </Suspense>
    </>
  );
};
export const metadata: Metadata = {
  title: "Seller - Manage Order",
};
export default page;
