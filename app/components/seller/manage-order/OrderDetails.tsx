"use client";
import React from "react";
import SellerNavbar from "../SellerNavbar";
import { useParams } from "next/navigation";

const OrderDetails = () => {
  const params = useParams();
  return (
    <>
      <SellerNavbar />
      <section className="min-h-screen p-4 mt-[87px]">
        <div className="bg-white p-6 w-full mx-auto">
          <h1 className="text-2xl font-bold mb-6">Order Details #{params.detail}</h1>

          {/* Product Info */}
          <div className="md:flex md:items-center md:gap-6 mb-6">
            <img src="https://ik.imagekit.io/xey68f94v4/yash2121954-apple_m2_F-QjVGm6Ku.jpg" alt="Product" className="w-full md:w-48 h-48 object-cover" />
            <div className="mt-4 md:mt-0">
              <h2 className="text-xl font-semibold">Product Title</h2>
              <p>SKU: #123456</p>
              <p>Quantity: 2</p>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="border-t pt-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Buyer Details</h2>
            <p>Name: John Doe</p>
            <p>Phone: +91-9876543210</p>
            <p>Address: 123 Main Street, New Delhi, 110001</p>
            <p>City: Delhi</p>
            <p>State: Delhi</p>
            <p>Pincode: 110001</p>
          </div>

          {/* Billing Info */}
          <div className="border-t pt-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Billing Information</h2>
            <p>Payment Method: COD</p>
            <p>Subtotal: ₹2000</p>
            <p>Shipping: ₹50</p>
            <p>Total: ₹2050</p>
          </div>

          {/* Package Dimensions */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-2">Package Dimensions</h2>
            <p>Length: 20 cm</p>
            <p>Width: 15 cm</p>
            <p>Height: 10 cm</p>
            <p>Weight: 1.2 kg</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetails;
