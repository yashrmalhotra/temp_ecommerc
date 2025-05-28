"use client";
import React, { forwardRef, useEffect, useState } from "react";
import Link from "next/link";
import { Option } from "@/Types/type";
import "./../CSS/Ecommerce.css";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import { signOut } from "next-auth/react";
const Options = forwardRef<HTMLDivElement, Option>(({ options, forpath, isHover, getOptionsDivListScrollHeight, additionalStyle }, ref) => {
  const height = isHover ? getOptionsDivListScrollHeight() : 0;
  const context = useUserDetails();
  const [isSeller, setIsSeller] = useState<boolean>(false);
  useEffect(() => {
    if (context?.userDetails?.role.includes("seller")) {
      setIsSeller(true);
    }
  });
  const handleLogOut = () => {
    signOut();
  };
  return (
    <div
      ref={ref}
      style={{
        height: `${height}px`,
        overflow: "hidden",
      }}
      className={` ${additionalStyle ? additionalStyle : "w-full"} absolute z-50 bg-white top-10 ht options px-2 rounded-md`}
      id="category-option"
    >
      <ul className="py-1">
        {options.map((item, i) => (
          <Link href={item.url} key={item.text} className="hover:underline decoration-white">
            <li className="hover:bg-blue-400 hover:text-white font-semibold px-1">{item.text}</li>
          </Link>
        ))}
        {forpath === "account" && (
          <>
            {isSeller && (
              <Link className="hover:underline decoration-white" href="/seller/dashboard">
                <li className="hover:bg-blue-400 hover:text-white font-semibold px-1">Seller</li>
              </Link>
            )}

            {context?.userDetails?.email ? (
              <li>
                <button onClick={handleLogOut} className="bg-sky-700 hover:cursor-pointer hover:bg-sky-800 w-full rounded-md text-white font-semibold">
                  LogOut
                </button>
              </li>
            ) : (
              <li>
                <Link href={"/signin"}>
                  <button className="bg-sky-700 hover:cursor-pointer hover:bg-sky-800 w-full rounded-md text-white font-semibold">Log In</button>
                </Link>
              </li>
            )}
          </>
        )}
      </ul>
    </div>
  );
});
Options.displayName = "Options";
export default Options;
