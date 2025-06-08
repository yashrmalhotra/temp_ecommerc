"use client";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import { ProductInfo } from "@/Types/type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import ProtectedBuyerRoute from "../ProtectedBuyerRoute";
import ProductCardSkeletonLoader from "../ProductCardSkeletonLoader";
import Image from "next/image";
import Link from "next/link";
const Order = () => {
  const [order, setOrder] = useState<ProductInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userDetails } = useUserDetails()!;
  useEffect(() => {
    (async () => {
      if (userDetails?.uid) {
        try {
          setIsLoading(true);
          const { data } = await axios.get(`/api/order?uid=${userDetails.uid}`);
          //   setOrder(data.order);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [userDetails]);
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
          <section className="mt-14 p-5">
            {order.length === 0 ? (
              <div className="flex w-full h-[calc(100vh-56px)] justify-center items-center font-bold text-2xl">No orders yet</div>
            ) : (
              order.map((item: ProductInfo, i: number) => (
                <div key={i + 1} className="flex flex-col md:flex-row">
                  <div className="w-[70px] h-[100px] md:w-[150px] md:h-[100px] relative mx-auto">
                    <Image src={item.images[0].url} alt="product" fill className="aspect-[2/1] md:object-contain" />
                  </div>
                  <div className="mt-5 w-full">
                    <Link href={`/${item.pid}`}>{item.basicInfo.title}</Link>
                    <div className="flex gap-5 flex-col md:flex-row">
                      <div className="p-2 border rounded-md mt-2">Order-id:</div>
                      <div className="p-2 border rounded-md mt-2">Total:</div>
                      <div className="p-2 border rounded-md mt-2">Ordered on:</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </ProtectedBuyerRoute>
    </>
  );
};

export default Order;
