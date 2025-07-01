import OrderDetails from "@/app/components/seller/manage-order/OrderDetails";
import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
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

export default page;
