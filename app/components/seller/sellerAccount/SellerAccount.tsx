"use client";
import React, { useState } from "react";
import SellerNavbar from "../SellerNavbar";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import { FaEdit } from "react-icons/fa";
import ShopDisplayNameField from "./ShopDisplayNameField";
import ProtectedSellerRoute from "../ProtectedSellerRoute";
import SellerAddressForm from "./SellerAddressForm";
import { SellerAddressSchema, SellerBankAccountSchema } from "@/Types/type";
import SellerBankAccountForm from "./SellerBankAccountForm";
const SellerAccount = () => {
  const context = useUserDetails();
  const [displayNameInputOpen, setDisplayNameInputOpen] = useState<boolean>(false);
  const [addressFormVisible, setAddressFormVisible] = useState<boolean>(false);
  const [bankFormVisible, setBankFormVisible] = useState<boolean>(false);
  return (
    <>
      <ProtectedSellerRoute>
        <SellerNavbar />
        <ShopDisplayNameField displayNameInputOpen={displayNameInputOpen} setDisplayNameInputOpen={setDisplayNameInputOpen} uid={context?.userDetails?.uid as string} />
        <SellerAddressForm
          formOpen={addressFormVisible}
          setFormOpen={setAddressFormVisible}
          uid={context?.userDetails?.uid as string}
          sellerAddress={context?.userDetails?.sellerAddress as SellerAddressSchema}
        />
        <SellerBankAccountForm
          formOpen={bankFormVisible}
          setFormOpen={setBankFormVisible}
          uid={context?.userDetails?.uid as string}
          sellerBankAccount={context?.userDetails?.sellerBankAccountDetails as SellerBankAccountSchema}
        />
        <main className="md:container md:mx-auto mt-[95px]">
          <h1 className="text-xl font-bold md:text-3xl my-7">Account Settings</h1>
          <div className="border grid grid-cols-[30%_2px_68%]">
            <div className="bg-slate-300 p-2 flex items-center text-xl font-semibold">Account Status</div>
            <div className="w-[2px] h-full"></div>
            <div className="p-2">
              <span className={`p-1 rounded-md ${context?.userDetails?.sellerAccountStatus === "active" ? "bg-green-300 text-green-500" : "bg-red-300 text-red-500"}`}>
                {(context?.userDetails?.sellerAccountStatus?.charAt(0).toUpperCase() as string) + context?.userDetails?.sellerAccountStatus?.slice(1)}
              </span>
            </div>
          </div>
          <div className="border grid grid-cols-[30%_2px_68%]">
            <div className="bg-slate-300 p-2 flex items-center text-xl font-semibold">Display name</div>
            <div className="w-[2px] h-full"></div>
            <div className="p-2">
              {context?.userDetails?.sellerShopDisplayName ? (
                <div className="flex justify-between group">
                  <span>{context?.userDetails?.sellerShopDisplayName}</span>
                  <button onClick={() => setDisplayNameInputOpen(true)} className="hidden group-hover:inline-block text-blue-300 active:text-blue-400">
                    <FaEdit size={25} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center h-full">
                  <button onClick={() => setDisplayNameInputOpen(true)} className="w-40 text-center bg-blue-500 active:bg-blue-400 text-white font-semibold rounded-md p-1">
                    Add shop name
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="border grid grid-cols-[30%_2px_68%]">
            <div className="bg-slate-300 p-2 flex items-center text-xl font-semibold">Address</div>
            <div className="w-[2px] h-full"></div>
            <div className="p-2">
              {context?.userDetails?.sellerAddress ? (
                <div className="flex justify-between items-center group">
                  <div>
                    <div>{context?.userDetails?.sellerAddress.address}</div>
                    <div>{context?.userDetails?.sellerAddress.city}</div>
                    <div>{context?.userDetails?.sellerAddress.state}</div>
                    <div>{context?.userDetails?.sellerAddress.pincode}</div>
                  </div>

                  <button onClick={() => setAddressFormVisible(true)} className="hidden group-hover:inline-block text-blue-300 active:text-blue-400">
                    <FaEdit size={25} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center h-full">
                  <button onClick={() => setAddressFormVisible(true)} className="w-40 text-center bg-blue-500 active:bg-blue-400 text-white font-semibold rounded-md p-1">
                    Add Address
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="border grid grid-cols-[30%_2px_68%]">
            <div className="bg-slate-300 p-2 flex items-center text-xl font-semibold">Bank Account</div>
            <div className="w-[2px] h-full"></div>
            <div className="p-2">
              {context?.userDetails?.sellerBankAccountDetails ? (
                <div className="flex justify-between group">
                  <div>
                    <div className="font-semibold">{context?.userDetails?.sellerBankAccountDetails?.accountType}</div>
                    <div>{context?.userDetails?.sellerBankAccountDetails?.accountHolderName}</div>
                    <div>{context?.userDetails?.sellerBankAccountDetails?.accountNumber}</div>
                    <div>{context?.userDetails?.sellerBankAccountDetails?.ifsc}</div>
                  </div>
                  <button onClick={() => setBankFormVisible(true)} className="hidden group-hover:inline-block text-blue-300 active:text-blue-400">
                    <FaEdit size={25} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center h-full">
                  <button onClick={() => setBankFormVisible(true)} className="w-40 text-center bg-blue-500 active:bg-blue-400 text-white font-semibold rounded-md p-1">
                    Add Bank Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </ProtectedSellerRoute>
    </>
  );
};

export default SellerAccount;
