import { useSearchContext } from "@/app/context/PaginationProvider";
import { getPaginationRange } from "@/utill/utillityFunctions";
import React from "react";

const SlidingWindowPagination: React.FC<{ totalPages: number }> = ({ totalPages }) => {
  const searchContext = useSearchContext()!;
  const pageNumberButtons: (string | number)[] = getPaginationRange(searchContext.pageNumber!, totalPages);
  return (
    <div className="flex gap-2">
      {pageNumberButtons.map((item: number | string, i: number) =>
        item === "..." ? (
          <span key={i}>...</span>
        ) : (
          <button
            onClick={() => searchContext?.setPageNumber(Number(item) - 1)}
            key={i}
            className={`p-2 rounded-xl ${item === searchContext.pageNumber! + 1 ? "bg-blue-300" : "bg-gray-400"}`}
          >
            {item}
          </button>
        )
      )}
    </div>
  );
};

export default SlidingWindowPagination;
