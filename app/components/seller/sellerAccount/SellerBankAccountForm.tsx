"use client";
import React, { useState } from "react";
import { SellerBankAccountSchema, SellerBankAccountZodSchema, SellerFormProps, SellerBankAccountSchemaProps } from "@/Types/type";
import { Dialog, DialogContent, DialogActions, DialogTitle, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../../InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import ThreeDotLoader from "../../ThreeDotLoader";
const options = ["saving", "current"];
const SellerBankAccountForm: React.FC<SellerFormProps & SellerBankAccountSchemaProps> = ({ formOpen, setFormOpen, sellerBankAccount, uid }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SellerBankAccountSchema>({
    defaultValues: {
      accountType: sellerBankAccount?.accountType || "saving",
      accountHolderName: sellerBankAccount?.accountHolderName || "",
      accountNumber: sellerBankAccount?.accountNumber || "",
      ifsc: sellerBankAccount?.ifsc || "",
    },
    resolver: zodResolver(SellerBankAccountZodSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await axios.put("/api/seller/update-bank-account-details", {
        uid,
        data,
      });
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

  return (
    <>
      {isLoading && <ThreeDotLoader />}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} sx={{ zIndex: 40 }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Fill Bank Account Details</DialogTitle>
        <DialogContent>
          <form>
            <div>
              <div>
                <label className="font-semibold">
                  Account type <span className="text-red-400">*</span>{" "}
                </label>
              </div>
              <select {...register("accountType")} className="w-full h-10 border border-black">
                {options.map((item: string, i: number) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <InputField labelText="Account Holder" mendatory="*" placeholder="eg: John" register={register("accountHolderName")} error={errors.accountHolderName?.message} />
            <InputField labelText="Account number" mendatory="*" placeholder="eg: John" register={register("accountNumber")} error={errors.accountNumber?.message} />
            <InputField labelText="IFSC" placeholder="eg: XYZA10001" register={register("ifsc")} error={errors.ifsc?.message} />
            <DialogActions>
              <Button onClick={() => handleSubmit(onSubmit)()} disableRipple autoFocus sx={{ bgcolor: "#1d4ed8", color: "white", "&:active": { bgcolor: "#3b82f6" } }}>
                Submit
              </Button>
              <Button onClick={() => setFormOpen(false)} autoFocus disableRipple sx={{ bgcolor: "#ef4444", color: "white", "&:active": { bgcolor: "#b91c1c " } }}>
                Close
              </Button>
            </DialogActions>
          </form>
          {errors.root && (
            <div>
              <p className="text-red-500 font-bold">{errors?.root?.message}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SellerBankAccountForm;
