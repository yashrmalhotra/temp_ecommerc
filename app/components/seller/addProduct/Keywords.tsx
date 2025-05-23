import React, { useEffect, memo } from "react";
import InputField from "../../InputField";
import { FormGroupProps, KeywordsProps } from "@/Types/type";
const Keywords: React.FC<FormGroupProps & KeywordsProps> = memo(({ register, errors, fields, append, remove }) => {
  useEffect(() => {
    append("");
  }, []);
  return (
    <section>
      <div>
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <InputField
              labelText="Keywords"
              placeholder="eg: It has 8gb ram for fast working"
              register={register(`keywords.${index}`)}
              error={errors?.[index]?.message}
              mendatory="*"
              additionalStyle="w-[90%]"
            />
            <button type="button" onClick={() => append("")} className="bg-cyan-700 active:bg-cyan-800 text-center py-1 text-white h-10 w-[5%] text-xl mt-5">
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
        ))}
      </div>
    </section>
  );
});
export default Keywords;
