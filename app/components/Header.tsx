"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoMdCamera } from "react-icons/io";
import { FaMicrophoneAlt } from "react-icons/fa";
import Options from "./Options";
import "../CSS/Header.css";

import { IoMdArrowDropdown } from "react-icons/io";
const Header: React.FC = () => {
  const [isCategoryOptionHover, setIsCategoryHover] = useState<boolean>(false);
  const [isAccountHover, setIsAccountHover] = useState<boolean>(false);
  const optionsContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryDivListRef = useRef<HTMLDivElement | null>(null);
  const accountDivListRef = useRef<HTMLDivElement | null>(null);

  const handleCategoryContainerExpand = (): void => {
    setIsCategoryHover(true);
  };

  const handleCategoryContainerShrink = (): void => {
    setIsCategoryHover(false);
  };
  const handleAccountContainerExpand = (): void => {
    setIsAccountHover(true);
  };

  const handleAccountContainerShrink = (): void => {
    setIsAccountHover(false);
  };

  const getCategoryOptionsDivListScrollHeight = (): number | null => {
    return categoryDivListRef.current && categoryDivListRef.current.scrollHeight;
  };

  const getAccountOptionsDivListScrollHeight = (): number | null => {
    return accountDivListRef.current && accountDivListRef.current.scrollHeight;
  };
  return (
    <>
      <header className="w-full px-3 bg-blue-300 h-14 border-2 flex  md:justify-around items-center box-border">
        <Link href="/" className="hover:underline">
          <div className="font-bold">Brand Name</div>
        </Link>
        <div
          ref={optionsContainerRef}
          onMouseEnter={handleCategoryContainerExpand}
          onMouseLeave={handleCategoryContainerShrink}
          className={`relative hidden md:flex flex-col gap-1 justify-center hover:cursor-pointer hover:underline options-container`}
        >
          <div className="flex w-52 justify-center">
            <span>Category</span>
            <span>
              <IoMdArrowDropdown size={25} id="cat-arrow" />
            </span>
          </div>
          <Options
            options={[
              { url: "/category/cloth", text: "Clothes" },
              { url: "/category/electronics", text: "Electronics" },
              { url: "/category/homedecor", text: "Home Decor" },
              { url: "/category/kitchen_dinning", text: "Kitchen & Dinning" },
              { url: "/category/mobile_accesories", text: "Mobile & Accessories" },
            ]}
            isHover={isCategoryOptionHover}
            setIsHover={setIsCategoryHover}
            ref={categoryDivListRef}
            getOptionsDivListScrollHeight={getCategoryOptionsDivListScrollHeight}
          />
        </div>
        <div className="w-full md:w-1/2">
          <form action="" className="flex">
            <div className="w-full flex relative items-center">
              <input type="text" name="search" placeholder="Search" id="" className="w-full p-2 rounded-s-xl outline-orange-400 active:border-orange-400" autoComplete="off" />
              <button className="absolute right-3 md:right-3 flex justify-center items-center hover:bg-gray-300 w-fit h-fit rounded-[50%]">
                {" "}
                <FaMicrophoneAlt size={25} color="blue" />{" "}
              </button>
              <button className="absolute right-10 flex  md:hidden justify-center items-center hover:bg-gray-300 w-fit h-fit rounded-[50%]">
                {" "}
                <IoMdCamera size={25} color="blue" />{" "}
              </button>
            </div>
            <button type="submit" className="bg-purple-400 rounded-e-xl p-3">
              {" "}
              <FaSearch />{" "}
            </button>
          </form>
        </div>

        <div onMouseEnter={handleAccountContainerExpand} onMouseLeave={handleAccountContainerShrink} className="hidden md:flex relative w-36 justify-center  options-container">
          <FaUserCircle size={35} color="black" />
          <Options
            options={[
              { url: "/acc", text: "My Account" },
              { url: "/acc/order", text: "Orders" },
              { url: "/acc/wishlist", text: "Wishlist" },
              { url: "/acc/setting", text: "Settings" },
            ]}
            forpath="account"
            isHover={isAccountHover}
            setIsHover={setIsAccountHover}
            ref={accountDivListRef}
            getOptionsDivListScrollHeight={getAccountOptionsDivListScrollHeight}
          />
        </div>

        <div className="relative hidden md:flex flex-col items-center justify-center">
          <span className="absolute z-10 text-white w-full text-center left-1 top-[-7px] text-xl font-bold">1</span>
          <FaShoppingCart size={35} />
        </div>
      </header>
    </>
  );
};

export default Header;
