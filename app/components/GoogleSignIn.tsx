"use client";
import { signIn } from "next-auth/react";
import React, { useEffect, useState, SetStateAction } from "react";
import { FcGoogle } from "react-icons/fc";
import ThreeDotLoader from "./ThreeDotLoader";
const GoogleSignIn: React.FC<{ role: string; setIsLoading: React.Dispatch<SetStateAction<boolean>> }> = ({ role, setIsLoading }) => {
  const handleGoogleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    document.cookie = `loginType=${role}; path=/; samesite=lax`;
    await new Promise((resolve) => setTimeout(resolve, 100));
    signIn("google", { redirect: true, callbackUrl: role === "buyer" ? "/" : "/seller/dashboard" });
    setIsLoading(false);
  };
  return (
    <>
      <button onClick={handleGoogleSignIn} className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2 w-full hover:bg-gray-100 transition">
        <FcGoogle size={22} />
        <span className="text-gray-700 font-medium">Continue with Google</span>
      </button>
    </>
  );
};

export default GoogleSignIn;
