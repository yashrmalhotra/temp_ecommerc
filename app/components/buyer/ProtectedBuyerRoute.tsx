"use client";
import React from "react";
import { ReactNodeProp } from "@/Types/type";
import Link from "next/link";
import Loader from "../Loader";
import { useUserDetails } from "../../context/UserDetailsProvider";
const ProtectedBuyerRoute: React.FC<ReactNodeProp> = ({ children }) => {
  const context = useUserDetails();

  if (context?.status === "loading") {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <Loader width="w-[35px]" height="h-[35px]" />
      </div>
    );
  }

  // Now check if the user is a seller
  if (context?.userDetails?.role?.includes("buyer")) {
    return <div>{children}</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-xl font-bold">You are not login</p>
      <div className="flex gap-1">
        <Link href={"/signup"} className="text-blue-500 underline visited:text-purple-700">
          Create account
        </Link>
        <span>or</span>
        <Link href={"/signin"} className="text-blue-500 underline visited:text-purple-700">
          Sign in
        </Link>
      </div>
    </div>
  );
};
export default ProtectedBuyerRoute;
