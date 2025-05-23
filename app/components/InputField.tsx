"use client";
import { InputProps } from "@/Types/type";
import React, { memo } from "react";

const InputField: React.FC<InputProps> = memo(({ labelText, mendatory, placeholder, additionalStyle, register, error, disabled }) => {
  return (
    <div className={`flex flex-col ${additionalStyle}`}>
      <label className="font-semibold">
        {labelText} <span className="text-red-400">{mendatory}</span>
      </label>
      <input
        disabled={disabled && disabled}
        {...(register ? register : {})}
        placeholder={placeholder}
        className="border border-black focus:outline-2 outline-blue-400 p-2 h-10 disabled:bg-gray-300 disabled:outline-gray-300 disabled:cursor-not-allowed"
      />
      {error && <p className="text-red-500 font-bold">{error}</p>}
    </div>
  );
});

export default InputField;
