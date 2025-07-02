"use client";
import React, { useEffect, useState, useMemo } from "react";
import Header from "../Header";
import Image from "next/image";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import axios from "axios";
import ProductCardSkeletonLoader from "../ProductCardSkeletonLoader";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Loader from "../../Loader";
import { deleteItem, updateQty } from "@/app/redux/cartSlice";
import MobileNav from "../MobileNav";
import { useRouter } from "next/navigation";
import ThreeDotLoader from "../../ThreeDotLoader";
import { load } from "@cashfreepayments/cashfree-js";
import { Dialog, Typography } from "@mui/material";
import { GoAlertFill } from "react-icons/go";

const Cart = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isQtyLoading, setIsQtyLoading] = useState<Record<string, boolean>>({});
  const [isCheckOutLoading, setIsCheckOutLoading] = useState<boolean>(false);
  const [isRemovingLoading, setIsRemovingLoading] = useState<Record<string, boolean>>({});
  const dispatchCartAction = useAppDispatch();
  const [cart, setCart] = useState<any[]>([]);
  const { userDetails } = useUserDetails()!;
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const cartItems = useAppSelector((state) => state.cart);

  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        if (userDetails) {
          setIsLoading(true);
        }

        const { data } = await axios.get(`/api/cart-item?uid=${userDetails?.uid}`);

        for (const item of data.items) {
          if (item.pid.offer.stock !== 0 && item.pid.createdByStatus === "active" && item.pid.status === "live") {
            item.isSelected = true;
          } else {
            item.isSelected = false;
          }
        }
        setCart(data.items);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userDetails]);

  const handleSelectChange = (i: number) => {
    const newCart = [...cart];
    newCart[i].isSelected = !newCart[i].isSelected;
    setCart(newCart);
  };

  const handleQty = async (id: string, qty: number) => {
    try {
      setIsQtyLoading({ ...isQtyLoading, [id]: true });
      await axios.put("/api/cart", { data: [id, userDetails?.uid, qty] });
      dispatchCartAction(updateQty([id, qty]));
    } catch (error) {
      console.log(error);
    } finally {
      setIsQtyLoading({ ...isQtyLoading, [id]: false });
    }
  };

  const selectedItems = useMemo(() => cart.filter((item) => item.isSelected), [cart]);
  const totalPrice = useMemo(() => {
    return selectedItems.reduce((total: number, item: any) => total + item.pid.offer.price * (cartItems[item.pid._id] || 1), 0);
  }, [cart, cartItems]);
  const totalMRP = useMemo(() => {
    return selectedItems.reduce((total: number, item: any) => total + item.pid.offer.mrp * (cartItems[item.pid._id] || 1), 0);
  }, [cart, cartItems]);
  const totalSavings = useMemo(() => {
    return totalMRP - totalPrice;
  }, [cart, cartItems]);
  const totalDiscount = useMemo(() => {
    if (totalMRP === 0) return 0;
    return Math.round((totalSavings / totalMRP) * 100);
  }, [cart, cartItems]);

  const handleSelectAll = () => {
    const newCart = [...cart];

    newCart.forEach((item: any) => {
      item.isSelected = true;
    });
    setCart(newCart);
  };
  const handleDeSelectAll = () => {
    const newCart = [...cart];

    newCart.forEach((item: any) => {
      item.isSelected = false;
    });
    setCart(newCart);
  };
  const handleDelete = async (pid: string) => {
    try {
      setIsRemovingLoading({ ...isRemovingLoading, [pid]: true });
      await axios.delete(`/api/cart-item`, {
        data: {
          uid: userDetails?.uid,
          pid,
        },
      });
      const shallowCart = [...cart];
      const newCart = shallowCart.filter((item) => item.pid._id !== pid);
      setCart(newCart);

      dispatchCartAction(deleteItem(pid));
    } catch (error) {
    } finally {
      setIsRemovingLoading({ ...isRemovingLoading, [pid]: false });
    }
  };

  const initializeSDK = async (sessionId: string) => {
    try {
      const cashfree = await load({
        mode: "sandbox",
      });

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };
      cashfree
        .checkout(checkoutOptions)
        .then(() => {
          router.replace("/order");
        })
        .catch((error: any) => {
          console.error("Cashfree checkout failed:", error); // Log the actual error
          setError("Payment failed: " + (error.message || "Unknown error"));
          setOpen(true); // Open the error dialog
        });
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  };
  const handleCheckOut = async () => {
    const buyerAddress = userDetails?.buyerAddresses[0];
    if (!buyerAddress) {
      alert("Please enter address first");
      router.replace("/acc");
      return;
    }
    const selectedItems = cart.filter((item: Record<string, any>) => item.isSelected);
    const orderData = selectedItems.map((item: Record<string, any>) => ({ pid: item.pid.pid, qty: cartItems[item.pid._id] }));

    const details = {
      uid: userDetails?.uid,
      customer_name: userDetails?.name,
      customer_email: userDetails?.email,
      orderedByAddress: buyerAddress,
      total: totalPrice,
      orderData,
    };

    try {
      setIsCheckOutLoading(true);
      const { data } = await axios.post("/api/cart/checkout", { details });
      await initializeSDK(data.session);
    } finally {
      setIsCheckOutLoading(false);
    }
  };
  return (
    <>
      <Header />
      {isCheckOutLoading && <ThreeDotLoader />}
      <Dialog open={open} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { padding: "10px", width: { sx: "80%", md: "30%" } } } }}>
        <Typography
          sx={{
            color: "red",
            fontWeight: "bold",
            fontSize: { sx: "1rem", md: "1.5rem" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            width: "100%",
          }}
        >
          <GoAlertFill fill="yellow" />
          {error}
        </Typography>
      </Dialog>

      {isLoading ? (
        <div className="mt-14">
          {Array(5)
            .fill("")
            .map((_, i: number) => (
              <ProductCardSkeletonLoader key={i + 1} layout="list" />
            ))}
        </div>
      ) : (
        <>
          <section className="mt-14 bg-gray-200 justify-center flex flex-col md:flex-row min-h-[calc(100vh-3.5rem)] md:gap-8">
            <div className="w-[95%] mx-auto md:mx-0 md:w-[55%] bg-white px-2">
              {Object.keys(cartItems).length === 0 ? (
                <div className="flex w-full h-full items-center font-bold justify-center">No items</div>
              ) : (
                <div>
                  {cart.every((product) => product.isSelected) ? (
                    <button onClick={handleDeSelectAll} className="text-blue-300 hover:underline decoration-blue-300 active:decoration-blue-400 active:text-blue-400">
                      Deselect all
                    </button>
                  ) : (
                    <button onClick={handleSelectAll} className="text-blue-300 hover:underline decoration-blue-300 active:decoration-blue-400 active:text-blue-400">
                      Select All
                    </button>
                  )}
                  {cart.map((item: any, i: number) => (
                    <div key={i + 1} className="flex flex-col md:flex-row">
                      <div className="mt-5">
                        <input
                          type="checkbox"
                          onChange={() => handleSelectChange(i)}
                          disabled={item.pid.offer.stock === 0 || item.pid.createdByStatus === "inactive" || item.pid.status !== "live"}
                          checked={item.isSelected}
                          className="disabled:cursor-not-allowed"
                          name=""
                          id=""
                        />
                      </div>
                      <div className="w-[70px] h-[100px] md:w-[150px] md:h-[100px] relative mx-auto">
                        <Image src={item.pid.images[0].url} alt="product" fill className="aspect-[2/1] md:object-contain" />
                      </div>
                      <div className="w-full mt-5">
                        <Link href={`/${item.pid.pid}`} className="text-ellipsis overflow-hidden line-clamp-3">
                          {item.pid.basicInfo.title}
                        </Link>
                        <div>
                          <span>{item.pid.offer.price.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>&nbsp;
                          <span className="line-through text-slate-400">MRP: {item.pid.offer.mrp.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>&nbsp;
                          <span className="text-green-400">{Math.ceil(((item.pid.offer.mrp - item.pid.offer.price) / item.pid.offer.mrp) * 100)}% off</span>
                        </div>

                        {item.pid.offer.stock === 0 || item.pid.createdByStatus !== "active" || item.pid.status !== "live" ? (
                          <div className="flex gap-3 ml-2">
                            <div className="font-bold text-red-500">Currently unavailable</div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="flex">
                              <button
                                onClick={() => handleQty(item.pid._id, -1)}
                                disabled={cartItems[item.pid._id] === 1 || isQtyLoading[item.pid._id]}
                                className="p-2 bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed active:bg-slate-400 rounded-sm"
                              >
                                -
                              </button>
                              <span className="bg-white p-2 flex">
                                {isQtyLoading[item.pid._id] ? <Loader width="w-5" height="h-5" /> : <span>{cart ? cartItems[item.pid._id] : ""}</span>}
                              </span>
                              <button
                                onClick={() => handleQty(item.pid._id, 1)}
                                disabled={isQtyLoading[item.pid._id]}
                                className="p-2 bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed active:bg-slate-200 rounded-sm"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => handleDelete(item.pid._id)}
                              className="ml-1 flex justify-center w-32 h-7 hover:bg-red-500 active:bg-red-400 hover:text-white loader"
                            >
                              {isRemovingLoading[item.pid._id] ? <Loader width="w-5" height="h-5" /> : <span>Remove from cart</span>}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-[95%] md:w-[25%] mx-auto md:mx-0 bg-white px-2 flex flex-col gap-2 py-2">
              <div className="flex justify-between">
                <div>Total Price ({selectedItems.length} items):</div>
                <div>{totalMRP.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
              </div>
              <div className="flex justify-between">
                <div>
                  Total savings <span className="text-green-400">({totalDiscount}%)</span>:
                </div>
                <div className="text-green-400">-{totalSavings.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
              </div>
              <div className="w-full h-[2px] bg-black"></div>
              <div className="flex justify-between">
                <div>Total price:</div>
                <div>{totalPrice.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
              </div>
              <button onClick={handleCheckOut} className="bg-cyan-500 active:bg-cyan-700 text-white self-center font-bold w-full md:w-[70%] rounded-md">
                Buy Now
              </button>
            </div>
          </section>
        </>
      )}
      <MobileNav />
    </>
  );
};

export default Cart;
