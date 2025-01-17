import React from "react";

import { Metadata } from "next";
import HomeLayout from "./components/home/HomeLayout";

const page = () => {
  return (
    <>
      <HomeLayout />
    </>
  );
};
export const metadata: Metadata = {
  title: "Ecommerce - Home",
};
export default page;
