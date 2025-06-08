"use client";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import React, { useState } from "react";
import Header from "../Header";
import AddressForm from "../AddressForm";
const Checkout = () => {
  const { userDetails } = useUserDetails()!;
  const [formVisible, setFormVisible] = useState<boolean>(false);

  return (
    <>
      <Header />
      <section className="mt-20">
        <div className="mx-auto w-1/2 h-[calc(100vh-3.5rem)]">
          {userDetails?.buyerAddresses?.length === 0 ? (
            <div className="flex flex-col justify-center items-center ">
              <div className="font-bold">No address</div>
            </div>
          ) : (
            <ul className="mt-8 w-full flex flex-col gap-2">
              {userDetails?.buyerAddresses?.map((item: any, i: number) => (
                <li key={i} className="p-2 border rounded-xl">
                  <div>
                    {item.address},{item.city}
                  </div>
                  <div>{item.state}</div>
                  <div>{item.pincode}</div>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setFormVisible(true)} className="text-blue-500 active:text-blue-400 w-full text-center">
            Add new address
          </button>
          <button className="bg-blue-500 active:bg-blue-400 text-white font-bold active:outline outline-4 outline-offset-2 outline-orange-400 w-full text-center rounded-xl p-3">
            Continue
          </button>
          {formVisible && <AddressForm setFormVisible={setFormVisible} email={userDetails?.email || ""} />}
        </div>
      </section>
    </>
  );
};

export default Checkout;
