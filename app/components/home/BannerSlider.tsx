"use client";
import React, { useEffect, useRef, useState } from "react";
import { ImOpera } from "react-icons/im";
import "../../CSS/BannerSlider.css";
import { ImageInfo } from "../../../Types/type";
const BannerSlider: React.FC = () => {
  const [img, setImg] = useState<ImageInfo[]>([
    { url: "BIG SALE.jpg", id: 0 },
    { url: "ecommerce.jpg", id: 1 },
    { url: "Headphone.jpg", id: 2 },
    { url: "Laptop.jpeg", id: 3 },
    { url: "watch.jpeg", id: 4 },
  ]);
  const [index, setIndex] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    setCurrentIndex(img[0].id);
    intervalRef.current = setInterval(rotateImg, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  });
  const rotateImg = () => {
    const arr: ImageInfo[] = [...img];
    const url_id: ImageInfo | undefined = arr.shift();
    if (url_id) setCurrentIndex(url_id.id);

    if (url_id !== undefined) arr.push(url_id);
    setImg(arr);
  };
  return (
    <>
      <div className="relative h-[40vh] md:min-h-[53vh] overflow-x-hidden" id="img-container">
        {img.map((item: ImageInfo, i: number) => (
          <div id="img" key={item.url} className={`absolute w-full h-full imgslide ${i === index && "is-selected"}`}>
            <img src={item.url} alt="banner" className="w-full h-full" />
          </div>
        ))}
        <div id="dot-container" className="flex w-full gap-3 justify-center absolute z-10 bottom-3 transition-all ease-linear">
          {img.map((_, i) => (
            <div id="dot" key={i} className={`w-5 h-5 rounded-full  ${i === currentIndex ? "bg-blue-400" : "bg-gray-400"} `}></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BannerSlider;
