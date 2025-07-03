import ManagePayment from "@/app/components/seller/manage-payments/ManagePayment";
import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
import { Metadata } from "next";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <ProtectedSellerRoute>
        <ManagePayment />
      </ProtectedSellerRoute>
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "Seller - Manage Payment",
};
export default page;
