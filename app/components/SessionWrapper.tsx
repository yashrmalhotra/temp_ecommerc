"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ReactNodeProp } from "@/Types/type";
const SessionWrapper: React.FC<ReactNodeProp> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;
