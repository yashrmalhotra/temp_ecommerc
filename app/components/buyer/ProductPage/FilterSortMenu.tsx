"use client";
import React from "react";
import Slider from "@mui/material/Slider";
import { FaStar } from "react-icons/fa";
import { FilterSortProps } from "@/Types/type";
import { BsSliders } from "react-icons/bs";
const ratings = [4, 3];

const FilterSortMenu: React.FC<FilterSortProps> = ({ filters, dispatchFilter, brands, range }) => {
  const handleCheckboxChange = (field: "brand" | "rating", value: string | number) => {
    dispatchFilter({ type: "TOGGLE_CHECKBOX", payload: { field, value } });
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      dispatchFilter({ type: "UPDATE_PRICE", payload: [newValue[0], newValue[1]] });
    }
  };

  console.log("filters", filters, range);
  return (
    <section>
      <button className="border p-2 rounded-xl mt-[4.5rem] flex items-center md:hidden">
        <BsSliders /> &nbsp; <span>Filter</span>
      </button>
      <aside className="border-y-0 fixed hidden md:block top-[4.2rem] left-0 w-[30%] h-[calc(100vh-64px)] bg-white border-r border-gray-200 overflow-y-auto p-4 box-border">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Brand</h3>
          {brands?.map((brand) => (
            <label key={brand} className="block text-sm mb-1">
              <input type="checkbox" className="mr-2" checked={filters.brand.includes(brand)} onChange={() => handleCheckboxChange("brand", brand)} />
              {brand}
            </label>
          ))}
        </div>

        {/* Ratings */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Ratings</h3>
          {ratings.map((rating) => (
            <div key={rating} className="flex items-center">
              <input type="checkbox" className="mr-2" checked={filters.rating.includes(rating)} onChange={() => handleCheckboxChange("rating", rating)} />
              <label key={rating} className="block text-sm mb-1">
                {rating === 4 && (
                  <div className="flex items-center">
                    {new Array(4).fill("").map((_, i: number) => (
                      <FaStar key={i} className="fill-amber-600" />
                    ))}
                    <span>& up</span>
                  </div>
                )}
                {rating === 3 && (
                  <div className="flex items-center">
                    {new Array(3).fill("").map((_, i: number) => (
                      <FaStar key={i} className="fill-amber-600" />
                    ))}
                    <span>& up</span>
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start">
          <h3 className="font-medium mb-2">Discount</h3>
          <button onClick={() => dispatchFilter({ type: "DISCOUNT", payload: null })}>Clear</button>
          <button onClick={() => dispatchFilter({ type: "DISCOUNT", payload: 10 })} className={`${filters.discount === 10 && "font-bold"}`}>
            10% off or more
          </button>
          <button onClick={() => dispatchFilter({ type: "DISCOUNT", payload: 20 })} className={`${filters.discount === 20 && "font-bold"}`}>
            20% off or more
          </button>
          <button onClick={() => dispatchFilter({ type: "DISCOUNT", payload: 30 })} className={`${filters.discount === 30 && "font-bold"}`}>
            30% off or more
          </button>
          <button onClick={() => dispatchFilter({ type: "DISCOUNT", payload: 40 })} className={`${filters.discount === 40 && "font-bold"}`}>
            40% off or more
          </button>
          <button onClick={() => dispatchFilter({ type: "DISCOUNT", payload: 50 })} className={`${filters.discount === 50 && "font-bold"}`}>
            50% off or more
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Price Range</h3>

          <Slider
            value={!filters.price[0] && !filters.price[1] ? range : filters.price}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={range[0]}
            max={range[1]}
            sx={{ width: "98%" }}
          />
          <div className="text-sm text-gray-600 mt-1">
            {range[0]?.toLocaleString("en-In", { style: "currency", currency: "INR" })} - {range[1]?.toLocaleString("en-In", { style: "currency", currency: "INR" })}
          </div>
        </div>

        <div className="flex flex-col items-start mb-3">
          <h3 className="font-medium mb-2">Sort By</h3>
          <button onClick={() => dispatchFilter({ type: "SORT_BY", payload: "RELEVANT" })} className={`${filters.sortBy === "RELEVANT" && "font-bold"}`}>
            Relevant
          </button>
          <button onClick={() => dispatchFilter({ type: "SORT_BY", payload: "PLTH" })} className={`${filters.sortBy === "PLTH" && "font-bold"}`}>
            Price: Low to High
          </button>
          <button onClick={() => dispatchFilter({ type: "SORT_BY", payload: "PHTL" })} className={`${filters.sortBy === "PHTL" && "font-bold"}`}>
            Price: High to Low
          </button>
          <button onClick={() => dispatchFilter({ type: "SORT_BY", payload: "DHTL" })} className={`${filters.sortBy === "DHTL" && "font-bold"}`}>
            Discount: Highest First
          </button>{" "}
          <button onClick={() => dispatchFilter({ type: "SORT_BY", payload: "NEWARV" })} className={`${filters.sortBy === "NEWARV" && "font-bold"}`}>
            Newest Arrival
          </button>
        </div>
      </aside>
    </section>
  );
};

export default FilterSortMenu;
