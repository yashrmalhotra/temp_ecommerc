import React, { Suspense } from "react";
import Dashboard from "@/app/components/seller/dashboard/SellerDashboard";
import { Metadata } from "next";
import ProtectedSellerRoute from "@/app/components/seller/ProtectedSellerRoute";
const page = () => {
  return (
    <Suspense>
      <ProtectedSellerRoute>
        <main>
          <Dashboard />
        </main>
      </ProtectedSellerRoute>
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "Seller - Dashboard",
};
export default page;
