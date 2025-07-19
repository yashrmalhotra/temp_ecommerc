"use client";
import { ReactNodeProp, SellerNotificationContextTypes } from "@/Types/type";
import React, { createContext, useContext, useState, useEffect } from "react";
const NotificationContext = createContext<SellerNotificationContextTypes | null>(null);

const SellerNotificationProvider: React.FC<ReactNodeProp> = ({ children }) => {
  const [oid, setOid] = useState<string[]>([]);
  const [sellerId, setSellerId] = useState<string>("");

  // useEffect(() => {
  //   if (!sellerId) return;
  //   const eventSrc = new EventSource(`/api/seller/notify?sid=${sellerId}`);
  //   eventSrc.onmessage = (event) => {
  //     setOid((prev) => [...prev, event.data]);
  //   };
  //   eventSrc.onerror = (err) => {
  //     console.log("event:", err);
  //     eventSrc.close();
  //   };
  //   return () => eventSrc.close();
  // }, [sellerId]);
  return <NotificationContext.Provider value={{ oid, setOid, setSellerId }}>{children}</NotificationContext.Provider>;
};
export const useSellerNotification = () => useContext(NotificationContext);
export default SellerNotificationProvider;
