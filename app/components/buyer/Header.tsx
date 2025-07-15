/*eslint-disable
@typescript-eslint/no-explicit-any
 */
"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaMicrophoneAlt, FaSearch, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import Options from "../Options";
import "../../CSS/Ecommerce.css";
import { Autocomplete } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Loader from "../Loader";
import { useSearchContext } from "@/app/context/SearchProvider";
import { HeaderProps } from "@/Types/type";
import { useAppSelector } from "../../redux/hooks";
import { FaRegCircleStop } from "react-icons/fa6";
const Header: React.FC<HeaderProps> = ({ setProducts, setBrands, setTotalPages, dispatchFilter, filters, setRange }) => {
  const [isAccountHover, setIsAccountHover] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);

  const accountDivListRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const params = useSearchParams();
  const searchContext = useSearchContext()!;
  const cartItems = useAppSelector((state) => state.cart);
  const router = useRouter();
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (transcript === "") return;
    setKeyword(transcript);
    console.log(transcript);
  }, [transcript]);
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
      }, 700);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [keyword]);

  const handleAccountContainerExpand = (): void => {
    setIsAccountHover(true);
  };

  const handleAccountContainerShrink = (): void => {
    setIsAccountHover(false);
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

  const handleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleSearchClick = async () => {
    SpeechRecognition.stopListening();

    if (dispatchFilter) dispatchFilter({ type: "CLEAR_ALL", payload: "" });
    await handleSearch(keyword);
    resetTranscript();
  };
  return (
    <>
      <header className="w-full px-3 bg-blue-300  border-2 flex fixed top-0 z-50 h-14 md:justify-around items-center box-border">
        <Link href="/" className="hover:underline">
          <div className="font-bold">
            <img src="greatmart.png" alt="" width={100} height={100} />
          </div>
        </Link>
        <Link href="/category" className="hover:underline hidden md:inline">
          <div className="font-bold">Category</div>
        </Link>

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
                      value={keyword}
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
              {browserSupportsSpeechRecognition && (
                <button type="button" onClick={handleListening} className="absolute right-7 flex justify-center items-center hover:bg-gray-300 w-fit h-fit rounded-[50%]">
                  {listening ? <FaRegCircleStop size={25} color="red" /> : <FaMicrophoneAlt size={25} color="blue" />}
                </button>
              )}
              {isLoading && (
                <div className="absolute right-1">
                  <Loader width="w-5" height="h-5" />
                </div>
              )}
            </div>

            <button type="button" onClick={handleSearchClick} className="bg-purple-400 active:bg-purple-500 rounded-e-xl p-3">
              <FaSearch />
            </button>
          </form>
        </div>

        <div onMouseEnter={handleAccountContainerExpand} onMouseLeave={handleAccountContainerShrink} className="hidden md:flex relative w-36 justify-center options-container">
          <FaUserCircle size={35} color="black" />
          <Options
            options={[
              { url: "/acc/setting", text: "My Account" },
              { url: "/order", text: "Orders" },
            ]}
            forpath="account"
            isHover={isAccountHover}
            setIsHover={setIsAccountHover}
            ref={accountDivListRef}
            getOptionsDivListScrollHeight={getAccountOptionsDivListScrollHeight}
          />
        </div>

        <Link href="/cart" className="relative hidden md:flex flex-col items-center justify-center">
          <span className="absolute z-10 text-white w-full text-center left-1 top-[-7px] text-xl font-bold">{Object.keys(cartItems).length || 0}</span>
          <FaShoppingCart size={35} />
        </Link>
      </header>
    </>
  );
};

export default Header;
