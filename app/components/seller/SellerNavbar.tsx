"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlinePushPin } from "react-icons/md";
import { RiUnpinLine } from "react-icons/ri";
import { IoBagHandle } from "react-icons/io5";
import { GiReturnArrow } from "react-icons/gi";
import { FaRupeeSign } from "react-icons/fa";
import { IoBarChartSharp } from "react-icons/io5";
import "../../CSS/Ecommerce.css";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import NotVerifiedAlert from "../NotVerifiedAlert";
import { PinedLinkType } from "@/Types/type";
import axios from "axios";
import { Badge } from "@mui/material";
import { useSellerNotification } from "@/app/context/SellerNotificationProvider";
const SellerNavbar: React.FC<{ additionalStyle?: string }> = ({ additionalStyle }) => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const menuRefButton = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const context = useUserDetails();
  const { oid } = useSellerNotification()!;
  const [pinedLink, setPinedLink] = useState<PinedLinkType[]>([]);
  useEffect(() => {
    if (context?.userDetails?.pinedLink && context?.userDetails?.pinedLink.length > 0) {
      setPinedLink(context.userDetails.pinedLink);
    }
  }, []);
  const addPinedLink = async (url: string, name: string) => {
    const newPinedLinkArray = [...pinedLink, { url, name }];
    setPinedLink(newPinedLinkArray);
    const controller = new AbortController();

    try {
      await axios.put(
        "/api/seller/update-pinedlink",
        {
          uid: context?.userDetails?.uid,
          pinedLink: newPinedLinkArray,
        },
        {
          signal: controller.signal,
        }
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("error while updating pined link");
      } else {
        console.log(error);
      }
    }
  };
  const removePinedLink = async (url: string) => {
    const newPinedLinkArray = [...pinedLink.filter((item: { url: string }) => item.url !== url)];
    setPinedLink(newPinedLinkArray);
    const controller = new AbortController();

    try {
      await axios.put(
        "/api/seller/update-pinedlink",
        {
          uid: context?.userDetails?.uid,
          pinedLink: newPinedLinkArray,
        },
        {
          signal: controller.signal,
        }
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("error while updating pined link");
      } else {
        console.log(error);
      }
    }
  };
  const isLinkPinned = (url: string) => pinedLink.some((link) => link.url === url);
  window.addEventListener("click", (e: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target as Node) && // Click outside menu
      menuRefButton.current &&
      !menuRefButton.current.contains(e.target as Node) // Click outside button
    ) {
      setMenuVisible(false);
    }
  });

  const handleMenuVisible = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      {!context?.userDetails?.isVerified && <NotVerifiedAlert path="seller" />}
      <nav id="seller_nav" className={`bg-cyan-500 w-full fixed z-10 top-0 flex justify-between items-center px-2 py-1 h-[50px] box-border ${additionalStyle}`}>
        <div className="flex items-center relative">
          <button ref={menuRefButton} onClick={handleMenuVisible} className=" border-r-2 px-2 text-white">
            <div className="flex justify-center">
              <GiHamburgerMenu size={20} />{" "}
            </div>
            <div>Menu</div>
          </button>
          <Link href="/seller/dashboard" className="text-center">
            <div className=" hover:underline font-bold px-2 border-r-2 text-center flex justify-center items-center h-full text-white">
              <img src="/greatmart.png" alt="" width={100} height={100} className="mt-4" />
            </div>
            <div className="text-[7px] md:text-base hover:underline font-bold px-2 border-r-2 text-white">
              {context?.userDetails?.sellerShopDisplayName ? <span>{context?.userDetails?.sellerShopDisplayName}</span> : <span>Seller Dahboard</span>}
            </div>
          </Link>
        </div>

        <div className="flex justify-around gap-4 items-center text-sm">
          <div className="flex hover:text-sky-500 hover:underline cursor-pointer">
            <div className="text-white flex flex-col items-center">
              <Badge badgeContent={oid?.length} max={9} color="primary" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <FaBell size={20} />
              </Badge>
              <span>Notifications</span>
            </div>
          </div>
          {/* 
          <div className="hidden md:flex  hover:text-sky-500 hover:underline cursor-pointer">
            <div className="text-white flex flex-col items-center">
              <IoBarChartSharp size={20} />
              <span>Performance</span>
            </div>
          </div> */}
          <Link href={"/seller/setting"}>
            <div className="relative justify-center options-container">
              <div className=" md:flex flex-col items-center hover:text-sky-500 hover:underline cursor-pointer">
                <div className="text-white flex flex-col items-center ">
                  <FaGear size={20} />
                  <span>Settings</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </nav>

      <div className={`border-t-2 bg-cyan-500 z-40 text-white px-5 fixed top-[50px] flex gap-5 w-full h-[35px] box-border py-1 ${additionalStyle}`}>
        {pinedLink.length > 0 &&
          pinedLink.map((item: PinedLinkType) => (
            <Link key={item.url} href={item.url} className="font-bold hover:underline">
              {item.name}
            </Link>
          ))}
      </div>
      <div
        ref={menuRef}
        className={`bg-white shadow-lg w-[90%] md:w-1/5 overflow-hidden h-screen transition-all fixed top-[85px] z-50 ${menuVisible ? "left-0" : "-left-[90%] md:-left-1/4"}`}
      >
        <ul className="pt-1">
          <li className="flex gap-3 border-[1px] border-slate-300 hover:bg-slate-300 h-10 mt-1">
            {isLinkPinned("/seller/add-product") ? (
              <button
                onClick={() => {
                  removePinedLink("/seller/add-product");
                }}
                className="pl-2 pt-2 hover:cursor-pointer"
              >
                <MdOutlinePushPin size={20} />
              </button>
            ) : (
              <button
                onClick={() => {
                  addPinedLink("/seller/add-product", "Add Product");
                }}
                className="pl-2 pt-2 hover:cursor-pointer"
              >
                <RiUnpinLine size={20} />
              </button>
            )}
            <div className="border-[1px]"></div>
            <Link href="/seller/add-product" className="flex items-center">
              <div className="flex items-center gap-2 justify-center">
                <span>
                  <img src="/add-product.png" alt="add-product" width={20} height={20} />
                </span>
                <span>Add Product</span>
              </div>
            </Link>
          </li>

          <li className="flex gap-3 border-[1px] border-slate-300 hover:bg-slate-300 h-10 mt-1">
            {isLinkPinned("/seller/manage-inventory") ? (
              <button
                onClick={() => {
                  removePinedLink("/seller/manage-inventory");
                }}
                className="pl-2 pt-2 hover:cursor-pointer"
              >
                <MdOutlinePushPin size={20} />
              </button>
            ) : (
              <button
                onClick={() => {
                  addPinedLink("/seller/manage-inventory", "Manage Inventory");
                }}
                className="pl-2 pt-2 hover:cursor-pointer"
              >
                <RiUnpinLine size={20} />
              </button>
            )}

            <div className="border-[1px]"></div>
            <Link href={"/seller/manage-inventory"} className="flex items-center">
              <div className="flex items-center gap-2 justify-center">
                <span>
                  <img src="/inventory.png" alt="order" width={20} height={20} />
                </span>
                <span>Manage Inventory</span>
              </div>
            </Link>
          </li>

          <li className="flex gap-3 border-[1px] border-slate-300 hover:bg-slate-300 h-10 mt-1">
            {isLinkPinned("/seller/manage-order") ? (
              <button
                onClick={() => {
                  removePinedLink("/seller/manage-order");
                }}
                className="pl-2 pt-2 hover:cursor-pointer"
              >
                <MdOutlinePushPin size={20} />
              </button>
            ) : (
              <button
                onClick={() => {
                  addPinedLink("/seller/manage-order", "Manage order");
                }}
                className="pl-2 pt-2 hover:cursor-pointer"
              >
                <RiUnpinLine size={20} />
              </button>
            )}

            <div className="border-[1px]"></div>
            <Link href={"/seller/manage-order"} className="flex items-center">
              <div className="flex items-center gap-2 justify-center">
                <span>
                  <IoBagHandle size={20} color="blue" />
                </span>
                <span>Manage Order</span>
              </div>
            </Link>
          </li>

          <li className="flex gap-3 border-[1px] border-slate-300 hover:bg-slate-300 h-10 mt-1">
            {isLinkPinned("/seller/manage-return") ? (
              <button
                onClick={() => {
                  removePinedLink("/seller/manage-return");
                }}
                className="pl-2 pt-2 hover:cursor-pointer"
              >
                <MdOutlinePushPin size={20} />
              </button>
            ) : (
              <button
                onClick={() => {
                  addPinedLink("/seller/manage-return", "Manage Return");
                }}
                className="pl-2 pt-2 hover:cursor-pointer"
              >
                <RiUnpinLine size={20} />
              </button>
            )}

            <div className="border-[1px]"></div>
            <Link href={"/seller/manage-return"} className="flex items-center">
              <div className="flex items-center gap-2 justify-center">
                <span>
                  <GiReturnArrow size={20} color="orange" />
                </span>
                <span>Manage Return</span>
              </div>
            </Link>
          </li>

          {/* <li className="flex gap-3 border-[1px] border-slate-300 hover:bg-slate-300 h-10 mt-1">
            {isLinkPinned("/seller/manage-payment") ? (
              <button
                onClick={() => {
                  removePinedLink("/seller/manage-payment");
                }}
                className="pl-2 pt-2 hover:cursor-pointer"
              >
                <MdOutlinePushPin size={20} />
              </button>
            ) : (
              <button
                onClick={() => {
                  addPinedLink("/seller/manage-payment", "Manage Payment");
                }}
                className="pl-2 pt-2 hover:cursor-pointer"
              >
                <RiUnpinLine size={20} />
              </button>
            )}

            <div className="border-[1px]"></div>
            <Link href={"/seller/manage-payment"} className="flex items-center">
              <div className="flex items-center gap-2 justify-center">
                <span>
                  <FaRupeeSign size={20} color="green" />
                </span>
                <span>Manage Payment</span>
              </div>
            </Link>
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default SellerNavbar;
