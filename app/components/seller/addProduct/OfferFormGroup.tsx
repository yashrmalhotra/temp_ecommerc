import React, { memo } from "react";
import InputField from "../../InputField";
import { FormGroupProps } from "@/Types/type";

const OfferFormGroup: React.FC<FormGroupProps> = memo(({ register, errors }) => {
  return (
    <div className="flex flex-col gap-2">
      <InputField labelText="MRP" mendatory="*" placeholder="eg: 500" register={register("offer.mrp", { valusAsNumber: true })} error={errors?.mrp?.message} />
      <InputField labelText="Price" mendatory="*" placeholder="eg: 500" register={register("offer.price", { valusAsNumber: true })} error={errors?.price?.message} />
      <InputField labelText="Stock" mendatory="*" placeholder="eg: 500" register={register("offer.stock", { valusAsNumber: true })} error={errors?.stock?.message} />
    </div>
  );
});

export default OfferFormGroup;
