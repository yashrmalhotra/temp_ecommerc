import { Metadata } from "next";
import React, { Suspense } from "react";
import Account from "../components/buyer/Account";

const page = () => {
  return (
    <Suspense>
      <Account />
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "Account",
};
export default page;
