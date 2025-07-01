import { SellerOrderPaginationProps } from "@/Types/type";
import React from "react";

const Pagination: React.FC<SellerOrderPaginationProps> = ({ rows, page, setPage, setRows, totalPages }) => {
  const handlePage = (pos: string) => {
    if (pos === "next") {
      setPage(page + 1);
    } else {
      setPage(page - 1);
    }
  };
  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRows(Number(e.target.value));
    setPage(0);
  };

  return (
    <>
      <div className="flex items-center gap-3 ml-[2vw] mt-5">
        <div>
          <select onChange={handleRowsChange} value={rows} name="" id="" className="p-2">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div>
          {page + 1} of {totalPages}
        </div>

        <div className="flex gap-2 text-xs">
          <button onClick={() => handlePage("prev")} disabled={page === 0} className="bg-slate-300 disabled:bg-slate-400 hover:bg-blue-300 active:bg-blue-400 px-2 py-1 rounded-xl">
            prev
          </button>
          <button
            onClick={() => handlePage("next")}
            disabled={page + 1 === totalPages}
            className="bg-slate-300 disabled:bg-slate-400 hover:bg-blue-300  active:bg-blue-400 px-2 py-1 rounded-xl"
          >
            next
          </button>
        </div>
      </div>
    </>
  );
};

export default Pagination;
