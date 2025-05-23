"use client";
import Image from "next/image";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const MobileImageView: React.FC<{
  images: {url:string}[];
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  url: string;
}> = ({ images, setOpen, url }) => {
  const initialIndex = images.findIndex((item) => item.url === url);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [lastTap, setLastTap] = useState(0);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isSwiping = useRef(false);

  useEffect(() => {
    const index = images.findIndex((item) => item.url === url);
    setCurrentIndex(index >= 0 ? index : 0);
  }, [url]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale !== 1) {
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
      return;
    }

    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (scale !== 1 && dragStart) {
      const touch = e.touches[0];
      setOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
      return;
    }

    touchEndX.current = e.touches[0].clientX;
    if (Math.abs(touchStartX.current - touchEndX.current) > 30) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (scale !== 1) return;

    if (images.length === 1 || !isSwiping.current) return;

    const delta = touchStartX.current - touchEndX.current;
    if (delta > 50 && currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (delta < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleThumbnailClick = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleDoubleTap = (e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (scale === 1) {
        setScale(3);
      } else {
        setScale(1);
        setOffset({ x: 0, y: 0 });
      }
    }
    setLastTap(now);
  };

  return (
    <div className="fixed w-full h-full bg-white z-50 top-0 flex flex-col items-center overflow-hidden">
      <button onClick={() => setOpen(false)} className="self-end m-2">
        <RxCross2 size={25} />
      </button>

      <div
        className="w-full flex h-[70%] transition-transform"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          touchAction: scale !== 1 ? "none" : "pan-y",
        }}
      >
        {images.map((item: { url: string }, i: number) => (
          <div
            key={item.url}
            className="w-full aspect-square relative shrink-0 flex items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={(e) => {
              handleTouchEnd();
              handleDoubleTap(e);
            }}
          >
            <Image
              src={item.url}
              alt="image"
              fill
              className="object-contain transition-transform"
              style={{
                transform: `scale(${i === currentIndex ? scale : 1}) translate(${i === currentIndex ? offset.x : 0}px, ${i === currentIndex ? offset.y : 0}px)`,
                transition: scale === 1 ? "transform 0.3s ease" : "none",
                touchAction: "none",
              }}
            />
          </div>
        ))}
      </div>
      {/* ThumbNail */}
      <div className="flex justify-center gap-2 overflow-hidden container mx-auto relative">
        {images.map((item: { url: string }, i: number) => (
          <button
            key={item.url}
            onClick={() => handleThumbnailClick(i)}
            className={`w-10 h-10 relative border ${i === currentIndex ? "border-blue-500 border-2" : "border-gray-300"}`}
          >
            <Image src={item.url} alt="thumb" fill className="object-contain" />
          </button>
        ))}
      </div>

      <div className="text-slate-400 mt-2">Double tap to zoom. Drag when zoomed.</div>
    </div>
  );
};

export default MobileImageView;
