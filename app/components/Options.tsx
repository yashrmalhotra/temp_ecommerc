import React, { forwardRef } from "react";
import Link from "next/link";
import { Option } from "../../Types/type";
import "../CSS/Header.css";

const Options = forwardRef<HTMLDivElement, Option>(({ options, forpath, isHover, setIsHover, getOptionsDivListScrollHeight }, ref) => {
  const height = isHover ? getOptionsDivListScrollHeight() : 0;

  return (
    <div
      ref={ref}
      style={{
        height: `${height}px`,
        overflow: "hidden",
      }}
      className="w-full absolute z-10 bg-white top-10 ht options px-2 rounded-md"
      id="category-option"
    >
      <ul>
        {options.map((item, i) => (
          <Link href={item.url} key={item.text} className="hover:underline">
            <li className="border-y-2 text-center hover:bg-slate-300 font-bold">{item.text}</li>
          </Link>
        ))}
        {forpath === "account" && (
          <li className="border-y-2 text-center">
            <button className="bg-sky-700 hover:cursor-pointer hover:bg-sky-800 w-full rounded-md text-white font-bold">LogOut</button>
          </li>
        )}
      </ul>
    </div>
  );
});

export default Options;
