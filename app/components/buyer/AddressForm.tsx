import { AddressFormProps, AddressZodSchema } from "@/Types/type";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import ThreeDotLoader from "../ThreeDotLoader";

type AddressFormSchema = z.infer<typeof AddressZodSchema>;
const AddressForm: React.FC<AddressFormProps> = ({ setFormVisible, email, address }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AddressFormSchema>({
    defaultValues: {
      address: address?.address || "",
      city: address?.city || "",
      state: address?.state || "",
      pincode: address?.pincode || "",
      default: address?.default || false,
    },
    resolver: zodResolver(AddressZodSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleClose = () => {
    setFormVisible(false);
  };

  const submit = async (data: any) => {
    try {
      setIsLoading(true);
      if (address) {
        data.index = address?.index;
        await axios.put("/api/user/address", {
          email: email,
          buyerAddress: data,
        });
      } else {
        await axios.post("/api/user/address", {
          email: email,
          buyerAddress: data,
        });
      }
      window.location.reload();
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleClick = () => {
    handleSubmit(submit)();
  };
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(submit)();
    }
  };
  return (
    <>
      {isLoading && <ThreeDotLoader />}
      <main className="fixed left-0 top-0 w-full h-screen bg-black bg-opacity-30 flex justify-center items-center">
        <div className="w-[80%] md:w-[50%] xl:w-1/3 bg-white flex flex-col gap-5 justify-center  rounded-xl p-5 shadow-[0px_0px 10px]">
          <form onKeyDown={handleKeyDown} className="flex flex-col gap-5">
            <InputField labelText="Address" mendatory="*" placeholder="eg:XYZ-23" register={register("address")} error={errors?.address?.message} additionalStyle="w-full" />
            <InputField labelText="City" placeholder="eg:New Delhi" register={register("city")} additionalStyle="w-full" />
            <div className="flex flex-col md:flex-row gap-2">
              <InputField labelText="State" mendatory="*" placeholder="eg:Delhi" register={register("state")} error={errors.state?.message} additionalStyle="w-full" />
              <InputField
                labelText="Pincode"
                mendatory="*"
                placeholder="eg:121321"
                register={register("pincode", { maxLength: 6 })}
                error={errors?.pincode?.message}
                additionalStyle="w-full"
              />
            </div>
            {address && address?.default === false && (
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register("default")} id="" className="w-5 h-5" />
                <label htmlFor="" className="font-bold">
                  Default Address
                </label>
              </div>
            )}
            {errors.root && (
              <div>
                <p className="text-red-500 font-bold">{errors?.root?.message}</p>
              </div>
            )}
            <div className="flex justify-between">
              <button type="button" onClick={handleClick} className="p-2 font-bold  bg-blue-400 active:bg-blue-500 rounded">
                Submit
              </button>
              <button type="button" onClick={handleClose} className="p-2 font-bold  bg-red-400 active:bg-red-500 rounded">
                Close
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default AddressForm;
