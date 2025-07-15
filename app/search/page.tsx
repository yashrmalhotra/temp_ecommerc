import React, { Suspense } from "react";
import ProductPage from "../components/buyer/productPage/ProductPage";
import { Metadata } from "next";

const page = () => {
  return (
    <Suspense>
      <ProductPage />;
    </Suspense>
  );
};

export const metadata: Metadata = {
  title: "GreatMart: Search",
};

export default page;
