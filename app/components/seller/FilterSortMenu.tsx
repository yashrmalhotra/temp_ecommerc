"use client";
import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { MdOutlineSort } from "react-icons/md";
import { Menu, MenuItem, Collapse } from "@mui/material";
import { SellerOrderFilterSortProps } from "@/Types/type";

const FilterSortMenu: React.FC<SellerOrderFilterSortProps> = ({ filterOptions, sortOptions }) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const filterOpen = Boolean(filterAnchorEl);
  const sortOpen = Boolean(sortAnchorEl);
  return (
    <div className="flex gap-5">
      <div className="">
        <button
          onClick={(e: React.MouseEvent<HTMLElement>) => setFilterAnchorEl(e.currentTarget)}
          className="flex-shrink-0  flex bg-blue-400 active:bg-blue-500 text-white h-10 px-2 py-3 box-border rounded-xl items-center"
        >
          <FaFilter size={20} /> &nbsp; <span>Filter</span>
        </button>
        <Menu anchorEl={filterAnchorEl} open={filterOpen} onClose={() => setFilterAnchorEl(null)} slots={{ transition: Collapse }} slotProps={{ transition: { timeout: 300 } }}>
          {filterOptions.map((item: string, i: number) => (
            <MenuItem key={i}>{item}</MenuItem>
          ))}
        </Menu>
      </div>
      <div>
        <button
          onClick={(e: React.MouseEvent<HTMLElement>) => setSortAnchorEl(e.currentTarget)}
          className="flex-shrink-0 flex bg-blue-400 active:bg-blue-500 text-white h-10 px-2 py-3 box-border rounded-xl items-center"
        >
          <MdOutlineSort size={20} /> &nbsp;<span>Sort</span>
        </button>
        {sortOptions && (
          <Menu anchorEl={sortAnchorEl} open={sortOpen} onClose={() => setSortAnchorEl(null)} slots={{ transition: Collapse }} slotProps={{ transition: { timeout: 300 } }}>
            {sortOptions.map((item: string, i: number) => (
              <MenuItem key={i}>{item}</MenuItem>
            ))}
          </Menu>
        )}
      </div>
    </div>
  );
};

export default FilterSortMenu;
