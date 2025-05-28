"use client";

import { ReactNodeProp, SearchContextTypes } from "@/Types/type";
import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext<SearchContextTypes | undefined>(undefined);

const SearchProvider: React.FC<ReactNodeProp> = ({ children }) => {
  const [pageNumber, setPageNumber] = useState<number | undefined>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return <SearchContext.Provider value={{ pageNumber, setPageNumber, setIsLoading, isLoading }}>{children}</SearchContext.Provider>;
};

export const useSearchContext = () => useContext(SearchContext);
export default SearchProvider;
