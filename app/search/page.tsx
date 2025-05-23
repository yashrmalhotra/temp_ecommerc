import React, { Suspense } from "react";
import ProductPage from "../components/buyer/ProductPage/ProductPage";

const page = () => {
  return (
    <Suspense>
      <ProductPage />;
    </Suspense>
  );
};

export default page;
