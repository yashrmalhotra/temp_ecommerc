"use client";
import React, { useEffect, useReducer, useRef, useState } from "react";
import Header from "../Header";
import FilterSortMenu from "./FilterSortMenu";
import { FiltersState, FiltersAction, ProductInfo } from "@/Types/type";
import ProductResult from "./ProductResult";
const initialState: FiltersState = {
  brand: [],
  rating: [],
  sortBy: "RELEVANT",
  discount: null,
  price: [null, null],
};

const filterReducer = (state: FiltersState, action: FiltersAction): FiltersState => {
  switch (action.type) {
    case "TOGGLE_CHECKBOX": {
      const { field, value } = action.payload;
      const currentSet = new Set(state[field] as (string | number)[]);
      if (currentSet.has(value)) {
        currentSet.delete(value);
      } else {
        currentSet.add(value);
      }
      return { ...state, [field]: Array.from(currentSet) };
    }
    case "SORT_BY":
      return { ...state, sortBy: action.payload };
    case "UPDATE_PRICE":
      return { ...state, price: action.payload };
    case "DISCOUNT":
      return { ...state, discount: action.payload };
    case "CLEAR_ALL":
      return initialState;
    default:
      return state;
  }
};
const ProductPage = () => {
  const [filters, dispatch] = useReducer(filterReducer, initialState);
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [range, setRange] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);

  return (
    <>
      <Header setProducts={setProducts} setBrands={setBrands} setTotalPages={setTotalPages} dispatchFilter={dispatch} filters={filters} setRange={setRange} />
      <FilterSortMenu filters={filters} dispatchFilter={dispatch} brands={brands} range={range} />
      <ProductResult products={products} totalPages={totalPages} />
    </>
  );
};

export default ProductPage;
