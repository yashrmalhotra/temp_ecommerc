"use client";
import React, { useState } from "react";
import { FaCamera, FaEdit, FaUser } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "../../CSS/Ecommerce.css";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import InputField from "../InputField";
import { useForm } from "react-hook-form";
import { EditUserNameZodSchema } from "@/Types/type";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AddressForm from "./AddressForm";
import { Address } from "@/Types/type";
import Confirm from "./ConfirmDialogue";
import Header from "./Header";
import MobileNav from "./MobileNav";
import Link from "next/link";

type EditUserDetailsSchema = z.infer<typeof EditUserNameZodSchema>;
const BuyerAccount = () => {
  const context = useUserDetails()!;
  const [nameEdit, setNameEdit] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [address, setAddress] = useState<Address | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserDetailsSchema>({
    defaultValues: {
      name: context?.userDetails?.name,
    },
    resolver: zodResolver(EditUserNameZodSchema),
  });
  const handleEditProfilePicture = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "images/*";
    input.click();
  };
  const submit = (data: any) => {
    
    setNameEdit(false);
  };
  const handleEditProfile = (key: string) => {
    setNameEdit(true);
  };
  const handleUpdate = () => {
    handleSubmit(submit)();
  };
  const handleFormVisible = () => {
    setAddress(undefined);
    setFormVisible(true);
  };

  const handleDeleteConfirmOpen = (buyerAddress: Address, index: number) => {
    const addIndexInAddress: Address = {
      ...buyerAddress,
      index,
    };
    setAddress(addIndexInAddress);
    setDeleteConfirmOpen(true);
  };

  const handleAddressEdit = (buyerAddress: Address | undefined, index: number) => {
    if (!buyerAddress) return;

    const addIndexInAddress: Address = {
      ...buyerAddress,
      index,
    };
    setAddress(addIndexInAddress);
    setFormVisible(true);
  };

  return (
    <>
      <Header />
      <section className="mt-14 mb-20">
        <Confirm deleteConfirmOpen={deleteConfirmOpen} setDeleteConfirmOpen={setDeleteConfirmOpen} address={address!} email={context?.userDetails?.email!} />

        <div className="p-2 mt-2 flex flex-col md:container md:mx-auto md:p-0">
          {!nameEdit ? (
            <>
              <div className="p-2 border-b-2 border-blue-300">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">Name</div>
                    <div className="">{context?.userDetails?.name}</div>
                  </div>
                  <button onClick={() => handleEditProfile("name")} className="text-blue-300 active:text-blue-400">
                    <FaEdit size={25} />
                  </button>
                </div>
              </div>
              {context?.userDetails?.role.includes("seller") && (
                <Link href={"/seller/dashboard"} className="block md:hidden p-2 bg-slate-100 mt-2 rounded-xl">
                  Seller
                </Link>
              )}
            </>
          ) : (
            <div className="flex justify-between gap-2 items-center">
              <InputField labelText="Name" placeholder="Name" additionalStyle="w-full" mendatory="*" register={register("name")} error={errors?.name?.message} />
              <button onClick={handleUpdate} className="text-blue-300 active:text-blue-400 mt-5">
                <FaEdit size={25} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-2 mb-7 p-2 md:p-0 md:container md:mx-auto">
          <div className="font-bold">Address</div>
          <div className="grid  grid-cols-1 sm:grid-cols-3 gap-2">
            {context?.userDetails?.buyerAddresses &&
              context?.userDetails?.buyerAddresses.map((val, i) => (
                <div key={i} className={`group aspect-[2/1] p-2 bg-slate-100 rounded-xl relative  ${val.default && "border-2 border-blue-400"}`}>
                  {val.default && <div className="font-bold md:text-2xl">Default Address</div>}
                  <div className="hidden group-hover:flex flex-col gap-2 absolute top-2 right-3">
                    <button onClick={() => handleAddressEdit(val as Address, i)} className=" active:bg-blue-700 bg-blue-500 text-white rounded-md p-2">
                      <FaEdit size={15} />
                    </button>
                    <button onClick={() => handleDeleteConfirmOpen(val as Address, i)} className=" active:bg-red-700 bg-red-500 text-white rounded-md p-2">
                      <MdDelete size={15} />
                    </button>
                  </div>
                  <div className="text-base md:text-xl">
                    {val.address} {val.city || ""}
                  </div>
                  <div className="text-base md:text-xl">{val.state}</div>
                  <div className="text-base md:text-xl">{val.pincode}</div>
                </div>
              ))}
            <div className="aspect-[2/1] border-2 rounded-xl flex justify-center items-center">
              <button onClick={handleFormVisible} className="font-bold add-address-button active:text-blue-300">
                <div className="text-xl">+</div>
                <div className="text-xl add-address">Add address</div>
              </button>
            </div>
          </div>
        </div>
        {formVisible && <AddressForm setFormVisible={setFormVisible} email={context?.userDetails?.email || ""} address={address as Address} />}
      </section>
      <MobileNav />
    </>
  );
};

export default BuyerAccount;
