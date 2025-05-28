"use client";
import React, { useState } from "react";
import { FaFilter, FaSearch, FaSort } from "react-icons/fa";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { InventorySearchFilterProps } from "@/Types/type";
const SearchFilter: React.FC<InventorySearchFilterProps> = ({ dispatchFilter, handleSearchChange, searchQuery, handleSearchClick }) => {
  const [filterEl, setFilterEl] = useState<null | HTMLElement>(null);
  const [sortEl, setSortEl] = useState<null | HTMLElement>(null);
  const openFilterMenu = Boolean(filterEl);
  const openSortMenu = Boolean(sortEl);
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterEl(null);
  };
  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortEl(event.currentTarget);
  };
  const handleSortClose = () => {
    setSortEl(null);
  };
  return (
    <div className="flex w-[920px] mt-1 md:w-full justify-between bg-cyan-700 p-2">
      <div className="flex relative items-center">
        <input
          onChange={handleSearchChange}
          type="text"
          name="search"
          placeholder="Search by tilte/sku"
          value={searchQuery}
          className="w-full h-10 px-1 rounded-s-xl box-border outline-orange-400 active:border-orange-400"
          autoComplete="off"
        />

        <button onClick={handleSearchClick} className="bg-blue-400 rounded-e-xl h-10 px-2">
          <FaSearch color="white" />
        </button>
      </div>
      <div className="flex gap-3">
        <Button
          disableRipple
          sx={{
            background: "#60a5fa",
            "&:active": {
              background: "#3b82f6",
            },
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "white",
            borderRadius: "0.75rem",
          }}
          id="filter-button"
          aria-controls={openFilterMenu ? "filter-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openFilterMenu ? "true" : undefined}
          onClick={handleFilterClick}
        >
          <FaFilter color="white" /> <span>Filter</span>
        </Button>
        <Menu id="filter-menu" anchorEl={filterEl} open={openFilterMenu} onClose={handleFilterClose}>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SET_STATUS", payload: "all" });
              handleFilterClose();
            }}
          >
            All
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SET_STATUS", payload: "live" });
              handleFilterClose();
            }}
          >
            Live
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SET_STATUS", payload: "inactive" });
              handleFilterClose();
            }}
          >
            Inactive
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SET_STATUS", payload: "out of stock" });
              handleFilterClose();
            }}
          >
            Out of Stock
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SET_STATUS", payload: "draft" });
              handleFilterClose();
            }}
          >
            Draft
          </MenuItem>
        </Menu>
        <Button
          disableRipple
          sx={{
            background: "#60a5fa",
            "&:active": {
              background: "#3b82f6",
            },
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "white",
            borderRadius: "0.75rem",
          }}
          id="sort-button"
          aria-controls={openSortMenu ? "sort-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openSortMenu ? "true" : undefined}
          onClick={handleSortClick}
        >
          <FaSort color="white" /> <span>Sort</span>
        </Button>
        <Menu id="sort-menu" anchorEl={sortEl} open={openSortMenu} onClose={handleSortClose}>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SORT_BY", payload: "all" });

              handleSortClose();
            }}
          >
            All
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SORT_BY", payload: "SLTH" });
              handleSortClose();
            }}
          >
            Stock:Low To High
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SORT_BY", payload: "SHTL" });
              handleSortClose();
            }}
          >
            Stock: High to Low
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SORT_BY", payload: "PLTH" });
              handleSortClose();
            }}
          >
            Price:Low To High
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SORT_BY", payload: "PHTL" });
              handleSortClose();
            }}
          >
            Price: High To Low
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SORT_BY", payload: "newestFirst" });
              handleSortClose();
            }}
          >
            Newest First
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatchFilter({ type: "SORT_BY", payload: "oldestFirst" });
              handleSortClose();
            }}
          >
            Oldest first
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default SearchFilter;
