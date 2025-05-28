"use client";
import React from "react";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { ReactNodeProp } from "@/Types/type";

const ReduxProvider: React.FC<ReactNodeProp> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
