import React, { useEffect, useState } from "react";
import { SellerAddressZodSchema, SellerFormProps, SellerAddressSchemaProps, SellerAddressSchema } from "@/Types/type";
import { Dialog, DialogContent, DialogActions, DialogTitle, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../../InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import ThreeDotLoader from "../../ThreeDotLoader";

const SellerAddressForm: React.FC<SellerFormProps & SellerAddressSchemaProps> = ({ formOpen, setFormOpen, uid, sellerAddress }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SellerAddressSchema>({
    defaultValues: {
      address: sellerAddress?.address || "",
      city: sellerAddress?.city || "",
      state: sellerAddress?.state || "",
      pincode: sellerAddress?.pincode || "",
    },
    resolver: zodResolver(SellerAddressZodSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      await axios.put("/api/seller/update-address", {
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
        <DialogTitle sx={{ fontWeight: "bold" }}>Fill Address D</DialogTitle>
        <DialogContent>
          <form>
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

export default SellerAddressForm;
