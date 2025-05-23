import { DescriptionProps, FormGroupProps } from "@/Types/type";
import React, { memo, useEffect } from "react";
import InputField from "../../InputField";

const Decription: React.FC<FormGroupProps & DescriptionProps> = memo(({ register, errors, fields, append, remove }) => {
  useEffect(() => {
    append("");
  }, []);
  return (
    <section className="flex flex-col gap-2">
      <div>
        <div className="flex flex-col gap-2">
          <label htmlFor="">Description</label>
          <textarea
            {...register("productDescription.description")}
            placeholder="eg: The product color is red."
            className="border border-black focus:outline-2 resize-none h-32 focus:outline-blue-400 p-2"
            id=""
          ></textarea>
          {errors && <p className="text-red-500 font-bold">{errors?.description?.message}</p>}
        </div>
      </div>

      <div>
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <InputField
              labelText="Bullet point"
              placeholder="eg: It has 8gb ram for fast working"
              register={register(`productDescription.bulletPoints.${index}`)}
              error={errors?.bulletPoints[index]?.message}
              mendatory="*"
              additionalStyle="w-[90%]"
            />
            <button type="button" onClick={() => append("")} className="bg-cyan-700 active:bg-cyan-800 text-center py-1 text-white h-10 w-[5%] text-xl mt-5">
              +
            </button>{" "}
            <button
              type="button"
              disabled={index === 0}
              onClick={() => remove(index)}
              className="bg-cyan-700 active:bg-cyan-800 disabled:bg-cyan-500 text-center py-1 text-white w-[5%] h-10 text-xl mt-5"
            >
              -
            </button>
          </div>
        ))}
      </div>
    </section>
  );
});
export default Decription;
