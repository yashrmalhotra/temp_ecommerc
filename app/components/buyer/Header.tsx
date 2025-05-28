/*eslint-disable
@typescript-eslint/no-explicit-any
 */
"use client";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaMicrophoneAlt, FaSearch, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import Options from "../Options";
import "../../CSS/Ecommerce.css";
import { IoMdArrowDropdown } from "react-icons/io";
import { Autocomplete } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Loader from "../Loader";
import { useSearchContext } from "@/app/context/SearchProvider";
import { HeaderProps } from "@/Types/type";

import { useAppSelector } from "../../redux/hooks";

const Header: React.FC<HeaderProps> = ({ setProducts, setBrands, setTotalPages, dispatchFilter, filters, setRange }) => {
  const [isCategoryOptionHover, setIsCategoryHover] = useState<boolean>(false);
  const [isAccountHover, setIsAccountHover] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const optionsContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryDivListRef = useRef<HTMLDivElement | null>(null);
  const accountDivListRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const params = useSearchParams();
  const searchContext = useSearchContext()!;
  const cartItems = useAppSelector((state) => state.cart);
  const router = useRouter();
  useEffect(() => {
    const query = params.get("q");
    if (query) {
      handleSearch(query);
    }
    controllerRef.current = new AbortController();
    return () => {
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, [searchContext?.pageNumber, filters]);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (keyword && keyword.length >= 2) {
      timeout = setTimeout(async () => {
        try {
          setIsLoading(true);
          const { data } = await axios.get(`/api/user/autosuggest?keyword=${keyword}`);
          setOptions(data.suggestions);
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [keyword]);
  const handleCategoryContainerExpand = (): void => {
    setIsCategoryHover(true);
  };

  const handleCategoryContainerShrink = (): void => {
    setIsCategoryHover(false);
  };
  const handleAccountContainerExpand = (): void => {
    setIsAccountHover(true);
  };

  const handleAccountContainerShrink = (): void => {
    setIsAccountHover(false);
  };

  const getCategoryOptionsDivListScrollHeight = (): number | null => {
    return categoryDivListRef.current && categoryDivListRef.current.scrollHeight;
  };

  const getAccountOptionsDivListScrollHeight = (): number | null => {
    return accountDivListRef.current && accountDivListRef.current.scrollHeight;
  };

  const handleSearch = async (value: string) => {
    if (!value) return;

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    if (setBrands && setProducts && value && setTotalPages && setRange) {
      try {
        searchContext?.setIsLoading(true);
        const { data } = await axios.post("/api/productresults", { query: value, page: searchContext.pageNumber, filters }, { signal: controller.signal })!;
        setProducts(data.products.products);
        setBrands(data.products.brands);
        if (filters?.price[0] === null && filters?.price[1] === null) {
          setRange(data.products.range as number[]);
        }
        setTotalPages(data?.products?.totalCount);
      } catch (error: any) {
        if (axios.isCancel(error)) {
          console.log("Aborted previous request");
        } else {
          console.log("Request error:", error);
        }
      } finally {
        searchContext?.setIsLoading(false);
      }
    }

    router.replace(`/search?q=${value}`);
  };

  return (
    <>
      <header className="w-full px-3 bg-blue-300  border-2 flex fixed top-0 z-50 h-14 md:justify-around items-center box-border">
        <Link href="/" className="hover:underline">
          <div className="font-bold">Brand Name</div>
        </Link>
        <div
          ref={optionsContainerRef}
          onMouseEnter={handleCategoryContainerExpand}
          onMouseLeave={handleCategoryContainerShrink}
          className={`relative hidden md:flex flex-col gap-1 justify-center hover:cursor-pointer hover:underline options-container`}
        >
          <div className="flex w-52 justify-center">
            <span>Category</span>
            <span>
              <IoMdArrowDropdown size={25} id="cat-arrow" />
            </span>
          </div>
          <Options
            options={[
              { url: "/category/cloth", text: "Clothes" },
              { url: "/category/electronics", text: "Electronics" },
              { url: "/category/homedecor", text: "Home Decor" },
              { url: "/category/kitchen_dinning", text: "Kitchen & Dinning" },
              { url: "/category/mobile_accesories", text: "Mobile & Accessories" },
            ]}
            isHover={isCategoryOptionHover}
            setIsHover={setIsCategoryHover}
            ref={categoryDivListRef}
            getOptionsDivListScrollHeight={getCategoryOptionsDivListScrollHeight}
          />
        </div>
        <div className="w-full md:w-1/2">
          <form action="" className="flex">
            <div className="w-full flex relative items-center">
              <Autocomplete
                freeSolo
                sx={{ width: "100%" }}
                options={options}
                onInputChange={(_, value) => setKeyword(value)}
                onChange={(_, value) => handleSearch(value!)}
                renderInput={(params: any) => (
                  <div ref={params.InputProps.ref} className="w-full relative">
                    <input
                      {...params.inputProps}
                      type="text"
                      name="search"
                      placeholder="Search"
                      className="w-full p-2 rounded-s-xl outline-orange-400 active:border-orange-400"
                      autoComplete="off"
                      onKeyDown={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          if (dispatchFilter) dispatchFilter({ type: "CLEAR_ALL", payload: "" });
                          e.preventDefault();
                          handleSearch(keyword);
                        }
                      }}
                    />
                  </div>
                )}
              />
              <button className="absolute right-7 flex justify-center items-center hover:bg-gray-300 w-fit h-fit rounded-[50%]">
                <FaMicrophoneAlt size={25} color="blue" />
              </button>
              {isLoading && (
                <div className="absolute right-1">
                  <Loader width="w-5" height="h-5" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (dispatchFilter) dispatchFilter({ type: "CLEAR_ALL", payload: "" });
                handleSearch(keyword);
              }}
              className="bg-purple-400 rounded-e-xl p-3"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        <div onMouseEnter={handleAccountContainerExpand} onMouseLeave={handleAccountContainerShrink} className="hidden md:flex relative w-36 justify-center options-container">
          <FaUserCircle size={35} color="black" />
          <Options
            options={[
              { url: "/acc/setting", text: "My Account" },
              { url: "/acc/order", text: "Orders" },
              { url: "/acc/wishlist", text: "Wishlist" },
            ]}
            forpath="account"
            isHover={isAccountHover}
            setIsHover={setIsAccountHover}
            ref={accountDivListRef}
            getOptionsDivListScrollHeight={getAccountOptionsDivListScrollHeight}
          />
        </div>

        <div className="relative hidden md:flex flex-col items-center justify-center">
          <span className="absolute z-10 text-white w-full text-center left-1 top-[-7px] text-xl font-bold">{cartItems.length}</span>
          <FaShoppingCart size={35} />
        </div>
      </header>
    </>
  );
};

export default Header;
