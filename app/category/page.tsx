import React from "react";
import Category from "../components/buyer/category/Category";
import { Metadata } from "next";

const page = () => {
  return <Category />;
};
export const metadata: Metadata = {
  title: "Categoies",
};
export default page;
