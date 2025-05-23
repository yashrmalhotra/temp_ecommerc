"use client";
import React, { useEffect, useReducer, useState } from "react";
import ManageInventorLoader from "./ManageInventoryLoader";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import axios from "axios";
import Link from "next/link";
import SellerNavbar from "../SellerNavbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import SearchFilter from "./SearchFilter";
const statuStyle = {
  draft: "bg-gray-200 text-gray-400",
  live: "bg-green-200 text-green-400",
  "out of stock": "bg-red-200 text-red-400",
  inactive: "bg-red-200 text-red-400",
};
const statusPriority: Record<string, number> = {
  live: 4,
  "out of stock": 3,
  inactive: 2,
  draft: 1,
};
const initalState = {
  status: "all",
  sortBy: "all",
};

const filterReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SORT_BY":
      return { ...state, sortBy: action.payload };

    default:
      return state;
  }
};
let clearInputTimeout: NodeJS.Timeout;
const ManageInventory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<any>([]);
  const context = useUserDetails();
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>();
  const [rows, setRows] = useState<number>(5);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [pid, setPid] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterState, dispatchFilter] = useReducer(filterReducer, initalState);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/seller/manageinventory?uid=${context?.userDetails?.uid}&page=${page}&rows=${rows}`);
        setProducts(response.data.products);
        const totalProducts = Number(response.data.totalProducts);
        setTotalPages(Math.ceil(totalProducts / rows));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page, rows]);

  const handleDeleteConfirmOpen = (pid: string) => {
    setDeleteConfirmOpen(true);
    setPid(pid);
  };
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };
  const handleDelete = async () => {
    try {
      await axios.delete("/api/seller/product", {
        data: {
          pid,
        },
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const handlePage = (pos: string) => {
    if (pos === "next") {
      setPage(page + 1);
    } else {
      setPage(page - 1);
    }
  };
  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRows(Number(e.target.value));
    setPage(0);
  };

  const StatusText = ({ status }: { status: "live" | "draft" | "out of stock" }) => {
    return <span className={`${statuStyle[status]} rounded-sm p-1`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(e.target.value);
    if (clearInputTimeout) clearTimeout(clearInputTimeout);
    if (value.trim() === "") {
      clearInputTimeout = setTimeout(async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/seller/manageinventory?uid=${context?.userDetails?.uid}&page=${page}&rows=${rows}`);
          setProducts(response.data.products);
          setTotalPages(Math.ceil(Number(response.data.totalProducts) / rows));
        } catch (error) {
          console.error("Failed to load all products", error);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    }
  };

  const handleSearchClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/seller/manageinventory?query=${searchQuery}`);
      dispatchFilter({ type: "SET_STATUS", payload: "all" });
      dispatchFilter({ type: "SORT_BY", payload: "all" });
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const filterProducts = products
    .filter((p: any) => {
      if (filterState.status === "all") return true;
      return p.status === filterState.status;
    })
    .sort((a: any, b: any) => {
      switch (filterState.sortBy) {
        case "SLTH":
          return a.offer.stock - b.offer.stock;
        case "SHTL":
          return b.offer.stock - a.offer.stock;
        case "PLTH":
          return a.offer.price - b.offer.price;
        case "PHTL":
          return b.offer.price - a.offer.price;
        case "newestFirst":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "oldestFirst":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "statusLTH":
          return statusPriority[a.status] - statusPriority[b.status];
        case "statusHTL":
          return statusPriority[b.status] - statusPriority[a.status];
        default:
          return 0;
      }
    });

  return (
    <main className="mt-[87px]">
      <SellerNavbar additionalStyle="w-[920px] md:flex md:w-full" />
      <SearchFilter dispatchFilter={dispatchFilter} searchQuery={searchQuery} handleSearchChange={handleSearchChange} handleSearchClick={handleSearchClick} />
      <div className="header flex container md:ml-[2vw] mr-[2vw] mt-2 bg-slate-200  ">
        <div className="w-full grid grid-cols-[50px_100px_300px_100px_100px_400px] md:grid-cols-[5vw_10vw_35vw_18vw_18vw_10vw]">
          <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">S.no</div>
          <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Image</div>
          <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Title</div>
          <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Price</div>
          <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Stock</div>
          <div className="border-b bg-white p-1 box-border text-center font-semibold w-full">Actions</div>
        </div>
      </div>
      {isLoading && <ManageInventorLoader />}
      <div className="flex flex-col md:ml-[2vw] mr-[2vw] bg-slate-200">
        {filterProducts.map((item: any, i: number) => (
          <div key={item._id} className="w-full grid grid-cols-[50px_100px_300px_100px_100px_400px] md:grid-cols-[5vw_10vw_35vw_18vw_18vw_10vw]">
            <div className="border-b bg-white p-1 box-border text-center w-full">{i + 1}</div>
            <div className="border-b bg-white p-1 box-border text-center w-full flex items-center justify-center">
              <img src={item.images[0].url} alt="product-image" className="w-[70%]" />
            </div>
            <div className="border-b bg-white p-1 box-border w-full">
              <div>{item.basicInfo.title}</div>
              <div className="text-gray-300">SKU: {item.basicInfo.sku}</div>
              <div>{item.basicInfo.pid}</div>
              <div>
                <StatusText status={item.status} />
              </div>
            </div>
            <div className="border-b bg-white p-1 box-border text-center w-full">{item.offer.price.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
            <div className="border-b bg-white p-1 box-border text-center w-full">{item.offer.stock.toLocaleString("en-IN")}</div>
            <div className="border-b bg-white p-1 box-border text-center w-full flex flex-col gap-2">
              <Link href={{ pathname: "/seller/add-product", query: { id: item.pid } }} className="bg-slate-300 hover:bg-blue-300 active:bg-blue-400 rounded-xl">
                Edit
              </Link>
              <button onClick={() => handleDeleteConfirmOpen(item.pid)} className="bg-slate-300 hover:bg-blue-300 active:bg-blue-400 rounded-xl">
                Delete
              </button>
              <button className="bg-slate-300 hover:bg-blue-300 active:bg-blue-400 rounded-xl">Out of Stock</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 ml-[2vw] mt-5">
        <div>
          <select onChange={handleRowsChange} name="" id="" className="p-2">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div>
          {page + 1} of {totalPages}
        </div>

        <div className="flex gap-2 text-xs">
          <button onClick={() => handlePage("prev")} disabled={page === 0} className="bg-slate-300 disabled:bg-slate-400 hover:bg-blue-300 active:bg-blue-400 px-2 py-1 rounded-xl">
            prev
          </button>
          <button
            onClick={() => handlePage("next")}
            disabled={page + 1 === totalPages}
            className="bg-slate-300 disabled:bg-slate-400 hover:bg-blue-300  active:bg-blue-400 px-2 py-1 rounded-xl"
          >
            next
          </button>
        </div>
      </div>
      <Dialog onClose={handleDeleteConfirmClose} open={deleteConfirmOpen} sx={{ zIndex: 40 }}>
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure do you want to delete product</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} autoFocus disableRipple sx={{ bgcolor: "#1d4ed8", color: "white", "&:active": { bgcolor: "#3b82f6 " } }}>
            Close
          </Button>
          <Button onClick={handleDelete} disableRipple autoFocus sx={{ bgcolor: "#ef4444", color: "white", "&:active": { bgcolor: "#b91c1c" } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default ManageInventory;
