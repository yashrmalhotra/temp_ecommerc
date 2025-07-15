import OrderDetails from "@/app/components/seller/manage-order/OrderDetails";
import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
import { Metadata } from "next";
import React, { Suspense } from "react";

const page: React.FC<{ params: { detail: string } }> = ({ params }) => {
  const { detail } = params;
  return (
    <Suspense>
      <ProtectedSellerRoute>
        <OrderDetails detail={detail} />
      </ProtectedSellerRoute>
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "GreatMart Seller: Product Detail",
};
export default page;
