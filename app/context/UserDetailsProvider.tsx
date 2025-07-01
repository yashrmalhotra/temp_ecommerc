"use client";
import React, { useState, createContext, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { UserDetailsContextTypes, UserDetails, ReactNodeProp } from "@/Types/type";
import axios from "axios";
import { addBulkCart } from "@/app/redux/cartSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useSellerNotification } from "./SellerNotificationProvider";
const UserDetailsContext = createContext<UserDetailsContextTypes | undefined>(undefined);

const UserDetailsProvider: React.FC<ReactNodeProp> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>(undefined);
  const { data: session, status } = useSession();

  const dispatchCartAction = useAppDispatch()!;
  const cartItems = useAppSelector((state) => state.cart);
  const { setSellerId } = useSellerNotification()!;
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    (async () => {
      try {
        if (status === "authenticated") {
          console.log("cart length", cartItems);
          const response = await axios.get(`/api/user/getuser/${session?.user?.email}`);
          const { user } = response.data;
          setUserDetails({
            name: user.name!,
            email: user.email!,
            uid: user.uid,
            role: user.role,
            isVerified: user.isVerified!,
            buyerAddresses: user.buyerAddresses,
            sellerShopDisplayName: user.sellerShopDisplayName,
            sellerAddress: user.sellerAddress,
            sellerAccountStatus: user.sellerAccountStatus,
            sellerBankAccountDetails: user.sellerBankAccountDetails,
            pinedLink: user.pinedLink,
          });
          if (user.role.includes("seller")) {
            setSellerId(user.uid);
          }
        }
      } catch (error) {
        console.log("Error, ");
      }
    })();
  }, [status]);
  useEffect(() => {
    (async () => {
      try {
        if (status === "authenticated" && userDetails) {
          const { data } = await axios.get(`/api/cart?uid=${userDetails.uid}`);
          dispatchCartAction(addBulkCart(data.ids));
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [status, session, userDetails]);

  return <UserDetailsContext.Provider value={{ userDetails, setUserDetails, status }}>{children}</UserDetailsContext.Provider>;
};
export const useUserDetails = () => useContext(UserDetailsContext);
export default UserDetailsProvider;
