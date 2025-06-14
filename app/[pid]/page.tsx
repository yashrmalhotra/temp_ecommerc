import React, { Suspense } from "react";
import ProductDetailPage from "../components/buyer/productPage/ProductDetailPage";

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

export default page;
