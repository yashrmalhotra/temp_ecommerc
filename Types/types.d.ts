import { Connection } from "mongoose";
import React from "react";
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    connection: Connection | null;
    promise: Promise<Connection> | null;
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>>;
  }
}
