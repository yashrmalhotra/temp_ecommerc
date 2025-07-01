"use client";
import React, { useEffect, useState } from "react";
import { ReactNodeProp } from "@/Types/type";
import Link from "next/link";
import Loader from "../Loader";
import { useRouter } from "next/navigation";
import { useUserDetails } from "../../context/UserDetailsProvider";
const ProtectedSellerRoute: React.FC<ReactNodeProp> = ({ children }) => {
  const context = useUserDetails();
  const router = useRouter();
  useEffect(() => {
    console.log(context);
    if (context?.status === "unauthenticated") {
      router.push("/seller/signin");
    }
  });
  if (context?.status === "loading") {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <Loader width="w-[35px]" height="h-[35px]" />
      </div>
    );
  }

  // Now check if the user is a seller
  if (context?.userDetails?.role?.includes("seller")) {
    return <div>{children}</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-xl font-bold">Unauthorized you are not a seller</p>
      <div className="flex gap-1">
        <Link href={"/seller/signup"} className="text-blue-500 underline visited:text-purple-700">
          Create seller account
        </Link>
        <span>or</span>
        <Link href={"/seller/signin"} className="text-blue-500 underline visited:text-purple-700">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default ProtectedSellerRoute;
