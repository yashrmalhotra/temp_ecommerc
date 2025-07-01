import React from "react";
import { CardText } from "@/Types/type";
import "../../CSS/Ecommerce.css";
const Infocard: React.FC<CardText> = ({ text, stats, amount, isLoading }) => {
  return (
    <div className="flex flex-col border-2 py-1 px-3 w-full md:w-1/4 rounded-lg border-slate-300 ">
      <div className="text-xl">
        <span>{text}</span>
      </div>

      <div className="text-xl">
        {isLoading ? (
          <div className="skeleton-loader w-1/2 h-5 rounded-xl"></div>
        ) : (
          <span>{amount ? <div> {stats.toLocaleString("en-IN", { style: "currency", currency: "INR" })} </div> : <div>{stats.toLocaleString("en-IN")}</div>}</span>
        )}
      </div>
    </div>
  );
};

export default Infocard;
