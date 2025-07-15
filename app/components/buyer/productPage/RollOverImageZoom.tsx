import React from "react";

const RollOverImageZoom: React.FC<{ url: string; backgroundPosition: string }> = ({ url, backgroundPosition }) => {
  return (
    <div style={{ backgroundImage: `url(${url})`, backgroundSize: "300%", backgroundRepeat: "no-repeat", backgroundPosition }} className="w-full h-full bg-white rounded-2xl"></div>
  );
};

export default RollOverImageZoom;
