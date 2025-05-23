"use client";
import React, { useReducer, useState } from "react";
import Header from "../Header";
import FilterSortMenu from "./FilterSortMenu";
import { FiltersState, FiltersAction, ProductInfo } from "@/Types/type";
import ProductResult from "./ProductResult";
const initialState: FiltersState = {
  brand: [],
  rating: [],
  category: [],
  sortBy: "",
  price: [0, 50000],
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
    case "UPDATE_SORT":
      return { ...state, sortBy: action.payload };
    case "UPDATE_PRICE":
      return { ...state, price: action.payload };
    case "UPDATE_MIN_PRICE":
      return {
        ...state,
        price: [Math.min(action.payload, state.price[1]), state.price[1]],
      };
    case "UPDATE_MAX_PRICE":
      return {
        ...state,
        price: [state.price[0], Math.max(action.payload, state.price[0])],
      };
    default:
      return state;
  }
};
const ProductPage = () => {
  const [filters, dispatch] = useReducer(filterReducer, initialState);
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  return (
    <>
      <Header setProducts={setProducts} setBrands={setBrands} setTotalPages={setTotalPages} />
      <FilterSortMenu filters={filters} dispatchFilter={dispatch} brands={brands} />
      <ProductResult products={products} totalPages={totalPages} />
    </>
  );
};

export default ProductPage;
