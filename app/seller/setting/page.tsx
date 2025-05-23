import SellerAccount from "@/app/components/seller/sellerAccount/SellerAccount";
import { Metadata } from "next";
import React, { Suspense } from "react";

const page = () => {
  return (
    <>
      <Suspense>
        <SellerAccount />
      </Suspense>
    </>
  );
};
export const metadata: Metadata = {
  title: "seller account settings",
};
export default page;
