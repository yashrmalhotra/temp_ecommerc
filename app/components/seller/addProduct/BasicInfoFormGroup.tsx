import React, { memo } from "react";
import InputField from "../../InputField";
import { FormGroupProps } from "@/Types/type";

const BasicInfoFormGroup: React.FC<FormGroupProps> = memo(({ register, errors }) => {
  return (
    <div className="flex flex-col gap-2">
      <InputField labelText="Title" mendatory="*" placeholder="eg: XYZ laserjet printer" register={register("basicInfo.title")} error={errors?.title?.message} />
      <InputField labelText="Brand Name" mendatory="*" placeholder="eg: XYZ" register={register("basicInfo.brandName")} error={errors?.brandName?.message} />
      <InputField labelText="SKU" mendatory="*" placeholder="eg: John" register={register("basicInfo.sku")} error={errors?.sku?.message} />
      <InputField labelText="Manufacturer" mendatory="*" placeholder="eg: John" register={register("basicInfo.manufacturer")} error={errors?.manufacturer?.message} />
      <InputField labelText="Model Number" placeholder="eg: 123" register={register("basicInfo.modelNumber")} />
    </div>
  );
});
export default BasicInfoFormGroup;
