import React, { Suspense } from "react";
import ProductPage from "../components/buyer/productPage/ProductPage";

const page = () => {
  return (
    <Suspense>
      <ProductPage />;
    </Suspense>
  );
};

export default page;
