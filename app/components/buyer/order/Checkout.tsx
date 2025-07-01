"use client";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import React, { useEffect, useRef, useState } from "react";
import Header from "../Header";
import AddressForm from "../AddressForm";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import ThreeDotLoader from "../../ThreeDotLoader";
import { Dialog, Typography } from "@mui/material";
import { GoAlertFill } from "react-icons/go";
import { load } from "@cashfreepayments/cashfree-js";
const Checkout = () => {
  const { userDetails } = useUserDetails()!;
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<Record<string, any>>({});
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pid = searchParams.get("pid");
  const kw = searchParams.get("kw");
  const soldBy = searchParams.get("soldBy");
  const qty = searchParams.get("qty");
  const price = Number(searchParams.get("price"));

  useEffect(() => {
    if (userDetails?.buyerAddresses && userDetails?.buyerAddresses?.length > 0) {
      const buyerAddress = userDetails?.buyerAddresses[0];
      setAddress(buyerAddress);
    }
  }, [userDetails]);
  const selectAddress = (address: string, city: string, state: string, pincode: string) => {
    console.log("address", address);
    setAddress({ address, city, state, pincode });
  };

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
        .then(() => {
          router.replace("/order");
        })
        .catch((error: any) => {
          console.error("Cashfree checkout failed:", error); // Log the actual error
          setError("Payment failed: " + (error.message || "Unknown error"));
          setOpen(true); // Open the error dialog
        });
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  };
  const handleCheckOut = async () => {
    if (userDetails?.buyerAddresses && userDetails?.buyerAddresses?.length === 0) {
      alert("Please enter address");
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/order/checkout", { pid, soldBy, uid: userDetails?.uid, name: userDetails?.name, email: userDetails?.email, address, kw, qty });

      await initializeSDK(data.session);
    } catch (error: any) {
      setError(error.response.data.msg);
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { padding: "10px", width: { sx: "80%", md: "30%" } } } }}>
        <Typography
          sx={{
            color: "red",
            fontWeight: "bold",
            fontSize: { sx: "1rem", md: "1.5rem" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            width: "100%",
          }}
        >
          <GoAlertFill fill="yellow" />
          {error}
        </Typography>
      </Dialog>

      {isLoading && <ThreeDotLoader />}
      <Header />
      <section className="mt-20">
        <div className="mx-auto w-[80%] md:w-1/2 h-[calc(100vh-3.5rem)]">
          {userDetails?.buyerAddresses?.length === 0 ? (
            <div className="flex flex-col justify-center items-center ">
              <button onClick={() => setFormVisible(true)} className="text-blue-500 active:text-blue-400 w-full text-center">
                Add new address
              </button>
              <div className="font-bold">No address</div>
            </div>
          ) : (
            <>
              <ul className="mt-8 w-full flex flex-col gap-2">
                {userDetails?.buyerAddresses?.map((item: any, i: number) => (
                  <li
                    onClick={() => selectAddress(item.address, item.city, item.state, item.pincode)}
                    key={i}
                    className={`p-2 border rounded-xl ${item.address === address.address && item.city === address.city && "border-blue-300"}`}
                  >
                    <div>
                      {item.address},{item.city}
                    </div>
                    <div>{item.state}</div>
                    <div>{item.pincode}</div>
                  </li>
                ))}
              </ul>
              <button onClick={() => setFormVisible(true)} className="text-blue-500 active:text-blue-400 w-full text-center">
                Add new address
              </button>
              <div className="mt-8 w-full flex flex-col gap-2 p-2 border rounded-xl">
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>{price.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{qty}</span>
                </div>

                <div className="w-full h-1 bg-gray-100"></div>
              </div>
            </>
          )}

          <button
            onClick={handleCheckOut}
            className="mt-2 bg-blue-500 active:bg-blue-400 text-white font-bold active:outline outline-4 outline-offset-2 outline-orange-400 w-full text-center rounded-xl p-3"
          >
            Continue
          </button>
          {formVisible && <AddressForm setFormVisible={setFormVisible} email={userDetails?.email || ""} />}
        </div>
      </section>
    </>
  );
};

export default Checkout;
