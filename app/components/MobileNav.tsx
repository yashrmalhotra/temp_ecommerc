"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome, FaShoppingCart, FaUser } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

const MobileNav = () => {
  const pathName = usePathname();
  console.log(pathName);
  const isActive = (path: string): boolean => pathName === path;
  return (
    <nav className="w-full fixed p-1 block md:hidden shadow-xl bottom-0 bg-blue-300">
      <ul className="list-none flex justify-around ">
        <li className={`${isActive("/") ? "text-blue-500" : "text-white"} hover:underline`}>
          <Link href="/" className="flex flex-col items-center">
            <FaHome size={25} />
            <div>Home</div>
          </Link>
        </li>
        <li className={`${isActive("/cart") ? "text-blue-500" : "text-white"} hover:underline`}>
          <Link href="/cart" className="flex flex-col items-center">
            <div className="relative flex flex-col items-center justify-center ">
              <span className={`absolute z-10 ${isActive("/cart") ? "text-white" : `text-black`} w-full text-center left-[3px] top-[-7px] text-xl font-bold`}>1</span>
              <FaShoppingCart size={25} />
            </div>
            <div>Cart</div>
          </Link>
        </li>
        <li className={`${isActive("/me") ? "text-blue-500" : "text-white"} hover:underline`}>
          <Link href="/me" className="flex flex-col items-center">
            <FaUser size={25} />
            <div>Me</div>
          </Link>
        </li>
        <li className={`${isActive("/setting") ? "text-blue-500" : "text-white"} hover:underline`}>
          <Link href="/setting" className="flex flex-col items-center">
            <IoIosSettings size={25} />
            <div>Settings</div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNav;
