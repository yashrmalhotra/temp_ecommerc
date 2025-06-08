import OrderDetails from "@/app/components/seller/manage-order/OrderDetails";
import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
import React from "react";

const page = () => {
  return (
    <ProtectedSellerRoute>
      <OrderDetails />
    </ProtectedSellerRoute>
  );
};

export default page;
