import React, { Suspense } from "react";
import ProductDetailPage from "../components/buyer/productPage/ProductDetailPage";
import { Metadata } from "next";

const page: React.FC<{ params: { pid: string } }> = ({ params }) => {
  const { pid } = params;
  return (
    <>
      <Suspense>
        <ProductDetailPage pid={pid} />
      </Suspense>
    </>
  );
};
export const metadata: Metadata = {
  title: "GreatMart: Product Detail page",
};
export default page;
