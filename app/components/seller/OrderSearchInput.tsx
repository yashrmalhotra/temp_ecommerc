"use client";
import { SellerSearchOrderProps } from "@/Types/type";
import React, { SetStateAction, useState } from "react";
import { FaSearch } from "react-icons/fa";
const OrderSearchInput: React.FC<SellerSearchOrderProps> = ({ style, setQuery, handleSearch }) => {
  const [input, setInput] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className={`flex rounded-xl ${style}`}>
      <input
        onChange={handleChange}
        type="text"
        placeholder="Enter order-id/title/sku"
        className="w-full border h-10 px-1 rounded-s-xl box-border outline-orange-400 active:border-orange-400"
      />
      <button onClick={handleSearch} className="bg-blue-400 active:bg-blue-500 rounded-e-xl h-10 px-2">
        <FaSearch color="white" />
      </button>
    </div>
  );
};

export default OrderSearchInput;
