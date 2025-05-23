"use client";
import React, { memo, useState } from "react";
import { DisplayNameFieldProps, ShopDisplayNameZodSchema } from "@/Types/type";
import { Dialog, DialogContent, DialogActions, DialogTitle, Button } from "@mui/material";
import InputField from "../../InputField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import ThreeDotLoader from "../../ThreeDotLoader";
type DisplayFieldSchema = z.infer<typeof ShopDisplayNameZodSchema>;
const DisplayNameField: React.FC<DisplayNameFieldProps> = ({ displayNameInputOpen, setDisplayNameInputOpen, uid }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DisplayFieldSchema>({
    defaultValues: {
      displayName: "",
    },
    resolver: zodResolver(ShopDisplayNameZodSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await axios.put("/api/seller/shop-display-name", {
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
      <Dialog open={displayNameInputOpen} sx={{ zIndex: 40 }} onClose={() => setDisplayNameInputOpen(false)}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Shop Display Name</DialogTitle>
        <DialogContent>
          <InputField labelText="Display Name" placeholder="eg:John Electronics" mendatory="*" register={register("displayName")} error={errors.displayName?.message} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSubmit(onSubmit)()} disableRipple autoFocus sx={{ bgcolor: "#1d4ed8", color: "white", "&:active": { bgcolor: "#3b82f6" } }}>
            Submit
          </Button>
          <Button onClick={() => setDisplayNameInputOpen(false)} autoFocus disableRipple sx={{ bgcolor: "#ef4444", color: "white", "&:active": { bgcolor: "#b91c1c " } }}>
            Close
          </Button>
        </DialogActions>
        {errors.root && <DialogContent sx={{ color: "#ef4444" }}>{errors.root.message}</DialogContent>}
      </Dialog>
    </>
  );
};

export default memo(DisplayNameField);
