import React, { Suspense } from "react";
import Category from "../components/buyer/category/Category";
import { Metadata } from "next";

const page = () => {
  return (
    <Suspense>
      <Category />;
    </Suspense>
  );
};
export const metadata: Metadata = {
  title: "GreatMart: Categoies",
};
export default page;
