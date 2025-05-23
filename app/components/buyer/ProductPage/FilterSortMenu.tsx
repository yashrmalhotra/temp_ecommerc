"use client";
import React, { ChangeEvent } from "react";
import Slider from "@mui/material/Slider";
import { FaStar } from "react-icons/fa";
import { FilterSortProps } from "@/Types/type";
import { BsSliders } from "react-icons/bs";
const ratings = [4, 3];
const minAllowed = 0;
const maxAllowed = 50000;

const FilterSortMenu: React.FC<FilterSortProps> = ({ filters, dispatchFilter, brands }) => {
  const handleCheckboxChange = (field: "brand" | "rating" | "category", value: string | number) => {
    dispatchFilter({ type: "TOGGLE_CHECKBOX", payload: { field, value } });
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      dispatchFilter({ type: "UPDATE_PRICE", payload: [newValue[0], newValue[1]] });
    }
  };

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatchFilter({ type: "UPDATE_MIN_PRICE", payload: Number(e.target.value) });
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatchFilter({ type: "UPDATE_MAX_PRICE", payload: Number(e.target.value) });
  };

  return (
    <section>
      <button className="border p-2 rounded-xl mt-[4.5rem] flex items-center md:hidden">
        <BsSliders /> &nbsp; <span>Filter</span>
      </button>
      <aside className="border-y-0 fixed hidden md:block top-[4.2rem] left-0 w-[30%] h-[calc(100vh-64px)] bg-white border-r border-gray-200 overflow-y-auto p-4 box-border">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Categories */}
        {/* Brands */}
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

        {/* Price Range */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Price Range</h3>
          <div className="flex items-center gap-2 mb-2">
            <input type="number" value={filters.price[0]} min={minAllowed} max={filters.price[1]} onChange={handleMinChange} className="w-1/2 border rounded px-2 py-1 text-sm" />
            <span className="text-gray-500">-</span>
            <input type="number" value={filters.price[1]} min={filters.price[0]} max={maxAllowed} onChange={handleMaxChange} className="w-1/2 border rounded px-2 py-1 text-sm" />
          </div>
          <Slider value={filters.price} onChange={handleSliderChange} valueLabelDisplay="auto" min={minAllowed} max={maxAllowed} sx={{ width: "98%" }} />
          <div className="text-sm text-gray-600 mt-1">
            {filters.price[0].toLocaleString("en-In", { style: "currency", currency: "INR" })} - {filters.price[1].toLocaleString("en-In", { style: "currency", currency: "INR" })}
          </div>
        </div>
      </aside>
    </section>
  );
};

export default FilterSortMenu;
