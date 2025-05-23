import React from "react";
import { CardText } from "@/Types/type";
import Link from "next/link";
const Infocard: React.FC<CardText> = ({ text, stats, url, amount }) => {
  return (
    <div className="flex flex-col border-2 px-3 w-full md:w-1/4 rounded-lg border-slate-300 ">
      <div className="text-xl">{text}</div>
      <Link href={url} className="hover:underline w-fit">
        <div className="text-xl">{amount ? <div> {stats.toLocaleString("en-IN", { style: "currency", currency: "INR" })} </div> : <div>{stats.toLocaleString("en-IN")}</div>}</div>
      </Link>
    </div>
  );
};

export default Infocard;
