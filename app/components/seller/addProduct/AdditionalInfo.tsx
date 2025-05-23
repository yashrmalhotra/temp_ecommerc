import React, { memo } from "react";
import InputField from "../../InputField";
import { additionalInfoProps, FormGroupProps } from "@/Types/type";
const dimensionOptions: string[] = ["CM", "Meter", "KM", "Inch"];
const weightOptions: string[] = ["KG", "Grams", "LBS", "Quantal"];
const AdditionalInfo: React.FC<FormGroupProps & additionalInfoProps> = memo(({ register, errors, fields, append, remove }) => {
  console;
  return (
    <section>
      <div className="flex flex-col gap-2 mt-2">
        <h3 className="text-[1rem] font-bold">Product Dimension</h3>
        <div className="flex w-full gap-2 items-center">
          <InputField
            labelText="Length"
            mendatory="*"
            placeholder="eg: 1"
            additionalStyle="w-1/2 h-20"
            register={register("dimensions.productDimensions.length.digit")}
            error={errors?.dimensions?.productDimensions?.length?.digit?.message}
          />
          <div className="h-20 w-1/2">
            <label htmlFor="">
              Unit <span className="text-red-400">*</span>
            </label>
            <select {...register("dimensions.productDimensions.length.unit")} className="w-full p-0 h-10 self-end border border-black">
              {dimensionOptions.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex w-full gap-2 items-center">
          <InputField
            labelText="Width"
            mendatory="*"
            placeholder="eg: 1"
            additionalStyle="w-1/2 h-20"
            register={register("dimensions.productDimensions.width.digit")}
            error={errors?.dimensions?.productDimensions?.width?.digit?.message}
          />
          <div className="h-20 w-1/2">
            <label htmlFor="">
              Unit <span className="text-red-400">*</span>
            </label>
            <select {...register("dimensions.productDimensions.width.unit")} className="w-full p-0 h-10 self-end border border-black">
              {dimensionOptions.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex w-full gap-2 items-center">
          <InputField
            labelText="Height"
            mendatory="*"
            placeholder="eg: 1"
            additionalStyle="w-1/2 h-20"
            register={register("dimensions.productDimensions.height.digit")}
            error={errors?.dimensions?.productDimensions?.height?.digit?.message}
          />
          <div className="h-20 w-1/2">
            <label htmlFor="">
              Unit <span className="text-red-400">*</span>
            </label>
            <select {...register("dimensions.productDimensions.height.unit")} className="w-full p-0 h-10 self-end border border-black">
              {dimensionOptions.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex w-full gap-2 items-center">
          <InputField
            labelText="Weight"
            mendatory="*"
            placeholder="eg: 1"
            additionalStyle="w-1/2 h-20"
            register={register("dimensions.productDimensions.weight.digit")}
            error={errors?.dimensions?.productDimensions?.weight?.digit?.message}
          />
          <div className="h-20 w-1/2">
            <label htmlFor="">
              Unit <span className="text-red-400">*</span>
            </label>
            <select {...register("dimensions.productDimensions.weight.unit")} className="w-full p-0 h-10 self-end border border-black">
              {weightOptions.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <h3 className="text-[1rem] font-bold">Package Dimension</h3>
        <div className="flex w-full gap-2 items-center">
          <InputField
            labelText="Length"
            mendatory="*"
            placeholder="eg: 1"
            additionalStyle="w-1/2 h-20"
            register={register("dimensions.packageDimensions.length.digit")}
            error={errors?.dimensions?.packageDimensions?.length?.digit?.message}
          />
          <div className="h-20 w-1/2">
            <label htmlFor="">
              Unit <span className="text-red-400">*</span>
            </label>
            <select {...register("dimensions.packageDimensions.length.unit")} className="w-full p-0 h-10 self-end border border-black">
              {dimensionOptions.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex w-full gap-2 items-center">
          <InputField
            labelText="Width"
            mendatory="*"
            placeholder="eg: 1"
            additionalStyle="w-1/2 h-20"
            register={register("dimensions.packageDimensions.width.digit")}
            error={errors?.dimensions?.packageDimensions?.width?.digit?.message}
          />
          <div className="h-20 w-1/2">
            <label htmlFor="">
              Unit <span className="text-red-400">*</span>
            </label>
            <select {...register("dimensions.packageDimensions.width.unit")} className="w-full p-0 h-10 self-end border border-black">
              {dimensionOptions.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex w-full gap-2 items-center">
          <InputField
            labelText="Height"
            mendatory="*"
            placeholder="eg: 1"
            additionalStyle="w-1/2 h-20"
            register={register("dimensions.packageDimensions.height.digit")}
            error={errors?.dimensions?.packageDimensions?.height?.digit?.message}
          />
          <div className="h-20 w-1/2">
            <label htmlFor="">
              Unit <span className="text-red-400">*</span>
            </label>
            <select {...register("dimensions.packageDimensions.height.unit")} className="w-full p-0 h-10 self-end border border-black">
              {dimensionOptions.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex w-full gap-2 items-center">
          <InputField
            labelText="Weight"
            mendatory="*"
            placeholder="eg: 1"
            additionalStyle="w-1/2 h-20"
            register={register("dimensions.packageDimensions.weight.digit")}
            error={errors?.dimensions?.packageDimensions?.weight?.digit?.message}
          />
          <div className="h-20 w-1/2">
            <label htmlFor="">
              Unit <span className="text-red-400">*</span>
            </label>
            <select {...register("dimensions.packageDimensions.weight.unit")} className="w-full p-0 h-10 self-end border border-black">
              {weightOptions.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        {fields.length === 0 ? (
          <button onClick={() => append({ key: "", value: "" })}> Add Additional Info</button>
        ) : (
          fields.map((_, index: number) => (
            <div key={index}>
              <div className="flex w-full gap-2">
                <InputField
                  labelText="Specification Type"
                  placeholder="eg:os"
                  register={register(`additionalInfo.${index}.key`)}
                  additionalStyle="w-[80%]"
                  mendatory="*"
                  error={errors?.additionalInfo?.[index]?.key?.message}
                />
                <InputField
                  labelText="Specification Value"
                  placeholder="eg:os"
                  register={register(`additionalInfo.${index}.value`)}
                  additionalStyle="w-[80%]"
                  mendatory="*"
                  error={errors?.additionalInfo?.[index]?.key?.message}
                />
              </div>
              <div className="flex w-full justify-end">
                <button
                  type="button"
                  onClick={() => append({ key: "", value: "" })}
                  className="bg-cyan-700 active:bg-cyan-800 text-center py-1 text-white h-10 w-[5%] text-xl mt-5"
                >
                  +
                </button>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => remove(index)}
                  className="bg-cyan-700 active:bg-cyan-800 disabled:bg-cyan-500 text-center py-1 text-white w-[5%] h-10 text-xl mt-5"
                >
                  -
                </button>
              </div>
            </div>
          ))
        )}
        {errors?.productDimensions && <div className="text-red-500 font-bold"> {errors?.dimensions?.productDimensions?.message}</div>}
        {errors?.packageDimensions && <div className="text-red-500 font-bold"> {errors?.dimensions?.packageDimensions?.message}</div>}
      </div>
    </section>
  );
});

export default AdditionalInfo;
