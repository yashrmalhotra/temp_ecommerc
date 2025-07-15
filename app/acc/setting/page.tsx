import React, { Suspense } from "react";
import ProtectedBuyerRoute from "../../components/buyer/ProtectedBuyerRoute";
import BuyerAccount from "../../components/buyer/BuyerAccount";
import { Metadata } from "next";

const page = () => {
  return (
    <>
      <Suspense>
        <ProtectedBuyerRoute>
          <BuyerAccount />
        </ProtectedBuyerRoute>
      </Suspense>
    </>
  );
};
export const metadata: Metadata = {
  title: "GreatMart: Settings",
};

export default page;
