"use client";
import React, { useState, createContext, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { UserDetailsContextTypes, UserDetails, ReactNodeProp, UserRole } from "@/Types/type";
import axios from "axios";
const UserDetailsContext = createContext<UserDetailsContextTypes | undefined>(undefined);

const UserDetailsProvider: React.FC<ReactNodeProp> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>(undefined);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    (async () => {
      try {
        if (session) {
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
        }
      } catch (error) {
        console.log("Error, ");
      }
    })();
  }, [status, session]);

  return <UserDetailsContext.Provider value={{ userDetails, setUserDetails, status }}>{children}</UserDetailsContext.Provider>;
};
export const useUserDetails = useContext(UserDetailsContext);
export default UserDetailsProvider;
