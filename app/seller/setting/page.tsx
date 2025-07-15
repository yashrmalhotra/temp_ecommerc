import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
import SellerAccount from "@/app/components/seller/sellerAccount/SellerAccount";
import { Metadata } from "next";
import React, { Suspense } from "react";

const page = () => {
  return (
    <>
      <Suspense>
        <ProtectedSellerRoute>
          <SellerAccount />
        </ProtectedSellerRoute>
      </Suspense>
    </>
  );
};
export const metadata: Metadata = {
  title: "GreatMart Seller: Account Settings",
};
export default page;
