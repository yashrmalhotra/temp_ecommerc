import React from "react";
import "../CSS/Ecommerce.css";
const ThreeDotLoader = () => {
  return (
    <div className="w-full fixed top-0 left-0 z-50 h-screen min-h-screen bg-black bg-opacity-40 flex justify-center items-center gap-2 three-dot-loader">
      <span className="w-3 h-3 rounded-full bg-blue-300"></span>
      <span className="w-3 h-3 rounded-full bg-blue-300"></span>
      <span className="w-3 h-3 rounded-full bg-blue-300"></span>
    </div>
  );
};

export default ThreeDotLoader;
