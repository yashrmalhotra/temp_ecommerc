"use client";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import ProtectedBuyerRoute from "../ProtectedBuyerRoute";
import ProductCardSkeletonLoader from "../ProductCardSkeletonLoader";
import Image from "next/image";
import Link from "next/link";
import { load } from "@cashfreepayments/cashfree-js";
import ThreeDotLoader from "../../ThreeDotLoader";
import MobileNav from "../MobileNav";

const Order = () => {
  const [order, setOrder] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [payNowLoading, setPayNowLoading] = useState<boolean>(false);
  const { userDetails } = useUserDetails()!;
  useEffect(() => {
    (async () => {
      if (userDetails?.uid) {
        try {
          setIsLoading(true);
          const { data } = await axios.get(`/api/order?uid=${userDetails.uid}`);
          setOrder(data.order);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [userDetails]);
  const initializeSDK = async (sessionId: string) => {
    try {
      const cashfree = await load({
        mode: "sandbox",
      });

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };
      cashfree
        .checkout(checkoutOptions)

        .catch((error: any) => {
          console.error("Cashfree checkout failed:", error); // Log the actual error
        });
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  };
  const handlePayNow = async (oid: string) => {
    try {
      setPayNowLoading(true);
      const { data } = await axios.post("/api/order/retrypayment", { oid });
      await initializeSDK(data.session);
    } finally {
      setPayNowLoading(false);
    }
  };
  return (
    <>
      <ProtectedBuyerRoute>
        <Header />
        {isLoading ? (
          <div className="mt-14">
            {Array(5)
              .fill("")
              .map((_, i: number) => (
                <ProductCardSkeletonLoader key={i + 1} layout="list" />
              ))}
          </div>
        ) : (
          <>
            <section className="mt-14 mb-20 p-5">
              {payNowLoading && <ThreeDotLoader />}
              {order.length === 0 ? (
                <div className="flex w-full h-[calc(100vh-56px)] justify-center items-center font-bold text-2xl">No orders yet</div>
              ) : (
                order.map((item: any, i: number) => (
                  <div key={i + 1} className="flex flex-col md:flex-row">
                    <div className="w-[70px] h-[100px] md:w-[150px] md:h-[100px] relative mx-auto">
                      <Image src={item.product.images[0].url} alt="product" fill className="aspect-[2/1] md:object-contain" />
                    </div>
                    <div className="mt-5 w-full">
                      <Link href={`/${item?.product?.pid}`}>{item.product.basicInfo.title}</Link>
                      <div className="flex gap-5 flex-col md:flex-row">
                        <Link href={`order/${item.oid}`} className="hover:underline visited:text-purple-500">
                          <div className="p-2 border rounded-md mt-2">Order-id:{item.oid}</div>
                        </Link>
                        <div className="p-2 border rounded-md mt-2">Amount:{item.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
                        <div className="p-2 border rounded-md mt-2">Quantity:{item.qty.toLocaleString("en-IN")}</div>
                        <div className="p-2 border rounded-md mt-2">Total:{(item.qty * item.amount).toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
                        <div className="p-2 border rounded-md mt-2">Ordered on: {new Date(item.createdAt).toLocaleDateString("en-GB").replaceAll("-", "/")}</div>
                      </div>
                      {item.status === "Pending" && (
                        <button onClick={() => handlePayNow(item.oid)} className="bg-blue-400 active:bg-blue-500 p-2 mt-1 text-white rounded-xl">
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </section>
            <MobileNav />
          </>
        )}
      </ProtectedBuyerRoute>
    </>
  );
};

export default Order;
