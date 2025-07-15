import React, { Suspense } from "react";
import { Metadata } from "next";

import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
import AddProductPage from "@/app/components/seller/addProduct/AddProductPage";
const page = () => {
  return (
    <Suspense>
      <ProtectedSellerRoute>
        <AddProductPage />
      </ProtectedSellerRoute>
    </Suspense>
  );
};

export default page;
export const metadata: Metadata = {
  title: "GreatMart Seller: Add Product",
};
