import Image from "next/image";
import React from "react";
import "../CSS/HomeLayout.css";
const ProductCard = () => {
  const n = 250;
  return (
    <div className="box-border p-2 my-2 item">
      <div className="border-2 border-gray-200 rounded-xl w-52 md:w-48 p-2">
        <div className="flex justify-center">
          <Image src="/l1.jpeg" alt="product" width={150} height={150} />
        </div>
        <div id="price_title_button">
          <div>{n.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</div>
          <div className="w-full text-ellipsis overflow-hidden lineClamp">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione incidunt atque eligendi magni architecto necessitatibus commodi exercitationem. Molestias voluptatibus
            sit nostrum, eum et expedita blanditiis.
          </div>
        </div>
        <button className="bg-cyan-500  text-white font-bold w-full rounded-md active:bg-cyan-700 mt-2">Buy</button>
      </div>
    </div>
  );
};

export default ProductCard;
