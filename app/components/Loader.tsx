import { LoaderProps } from "@/Types/type";
import React from "react";

const Loader: React.FC<LoaderProps> = ({ width, height }) => {
  return (
    <div
      className={`${width} ${height} rounded-full border-[5px] border-white border-t-[5px]  border-r-[5px] animate-spin self-center border-t-yellow-500 border-r-yellow-500 bg-transparent`}
    ></div>
  );
};

export default Loader;
