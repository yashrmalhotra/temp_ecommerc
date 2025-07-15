import Link from "next/link";
import React from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";

const Account = () => {
  return (
    <>
      <Header />
      <ul className="mt-[4.5rem] mb-20 w-full flex flex-col gap-2">
        <Link href={"/order"}>
          <li className="p-1 border flex rounded-xl w-full">My Orders</li>
        </Link>
        <Link href={"/acc/setting"}>
          <li className="p-1 border flex rounded-xl w-full">My Account</li>
        </Link>
      </ul>
      <MobileNav />
    </>
  );
};

export default Account;
