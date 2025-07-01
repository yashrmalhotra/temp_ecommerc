"use client";
import React, { useState, useEffect } from "react";
import SellerNavbar from "../SellerNavbar";
import axios from "axios";
import ThreeDotLoader from "../../ThreeDotLoader";

const OrderDetails: React.FC<{ detail: string }> = ({ detail }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/seller/manageorder/${detail}`);
        setOrder(data.order);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [detail]);

  return (
    <>
      <SellerNavbar />
      {!order && !isLoading ? (
        <div className="mt-[87px] h-[calc(100vh-87px)] flex w-full justify-center items-center text-xl font-bold">Order Not Found</div>
      ) : isLoading ? (
        <ThreeDotLoader />
      ) : (
        <section className="min-h-screen p-4 mt-[87px]">
          <div className="bg-white p-6 w-full mx-auto">
            <h1 className="text-2xl font-bold mb-6">Order Details #{detail}</h1>
            <div className="md:flex md:items-center md:gap-6 mb-6">
              <img src={order?.product?.images?.[0]?.url} alt="Product" className="w-full md:w-48 h-48 object-cover" />
              <div className="mt-4 md:mt-0">
                <h2 className="text-xl font-semibold">{order?.product?.basicInfo?.title}</h2>
                <p>SKU: {order?.product?.basicInfo?.sku}</p>
                <p>
                  Amount:{" "}
                  {order?.amount?.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </p>
                <p>Quantity: {order?.qty}</p>
              </div>
            </div>
            <div className="border-t pt-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Buyer Details</h2>
              <p>Name: {order?.user?.name}</p>
              <p>Email: {order?.user?.email}</p>
              <p>Address: {order?.orderedByAddress?.address}</p>
              <p>City: {order?.orderedByAddress?.city}</p>
              <p>State: {order?.orderedByAddress?.state}</p>
              <p>Pincode: {order?.orderedByAddress?.pincode}</p>
            </div>
            <div className="border-t pt-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Billing Information</h2>
              <p>
                Total:{" "}
                {(order?.amount * order?.qty).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-2">Package Dimensions</h2>
              {order?.product?.dimensions?.packageDimensions ? (
                <>
                  <p>
                    Length: {order.product.dimensions.packageDimensions.length.digit} {order.product.dimensions.packageDimensions.length.unit}
                  </p>
                  <p>
                    Width: {order.product.dimensions.packageDimensions.width.digit} {order.product.dimensions.packageDimensions.width.unit}
                  </p>
                  <p>
                    Height: {order.product.dimensions.packageDimensions.height.digit} {order.product.dimensions.packageDimensions.height.unit}
                  </p>
                  <p>
                    Weight: {order.product.dimensions.packageDimensions.weight.digit} {order.product.dimensions.packageDimensions.weight.unit}
                  </p>
                </>
              ) : (
                <p>Dimensions not available.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default OrderDetails;
