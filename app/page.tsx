import { Metadata } from "next";
import HomeLayout from "./components/buyer/home/HomeLayout";
import { Suspense } from "react";

const page = () => {
  return (
    <>
      <Suspense>
        <HomeLayout />
      </Suspense>
    </>
  );
};
export const metadata: Metadata = {
  title: "GreatMart - Home",
};
export default page;
