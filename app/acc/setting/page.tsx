import React, { Suspense } from "react";
import ProtectedBuyerRoute from "../../components/buyer/ProtectedBuyerRoute";
import BuyerAccount from "../../components/buyer/BuyerAccount";

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

export default page;
