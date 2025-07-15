import ManageInventory from "@/app/components/seller/manage-inventory/ManageInventory";
import React, { Suspense } from "react";
import { Metadata } from "next";
import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";

const page = () => {
  return (
    <>
      <Suspense>
        <ProtectedSellerRoute>
          <ManageInventory />
        </ProtectedSellerRoute>
      </Suspense>
    </>
  );
};
export const metadata: Metadata = {
  title: "GreatMart Seller: Manage Inventory",
};
export default page;
