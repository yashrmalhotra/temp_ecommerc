"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ImageView from "./ImageView";
import "../../../CSS/Ecommerce.css";
import RollOverImageZoom from "./RollOverImageZoom";
import MobileImageView from "./MobileImageView";

const ImageCarousel: React.FC<{ isDesktopView: boolean; images: any[] }> = ({ isDesktopView, images }) => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isInside, setIsInside] = useState<boolean>(false);
  const [backgroundPosition, setBackgroundPosition] = useState<string>("");

  const renderedImages = !isDesktopView && images.length === 2 ? [...images, ...images] : images;

  const caraousel = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  let slides;

  useEffect(() => {
    if (caraousel && !isDesktopView) {
      const currentSlides = [...caraousel?.current?.children!];
      if (![...caraousel?.current?.children!].some((el) => el.classList.contains("active-slide"))) {
        caraousel?.current?.prepend(currentSlides[currentSlides.length - 1]);

        const updatedSlides = [...caraousel?.current?.children!];
        if (updatedSlides.length > 1) {
          updatedSlides[1].classList.add("active-slide");
          slides = updatedSlides;
        }
      }
    } else {
      setSelectedImage(images[0].url);
    }
  }, [isDesktopView]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    isSwiping.current = false;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    touchEndX.current = e.touches[0].clientX;
    if (Math.abs(touchStartX.current - touchEndX.current) > 30) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (slides?.length === 1 || !isSwiping.current) return;

    const delta = touchStartX.current - touchEndX.current;

    slides = [...caraousel.current?.children!];
    const currSlide = caraousel.current?.querySelector(".active-slide");
    currSlide?.classList.remove("active-slide");

    if (Math.abs(delta) < 50) return;

    if (delta > 50) {
      const target = currSlide?.nextElementSibling;
      target?.classList.add("active-slide");
      caraousel.current?.append(slides[0]);
      setActiveIndex((prev: number) => (prev + 1) % images.length);
    } else if (delta < 0) {
      const target = currSlide?.previousElementSibling;
      target?.classList.add("active-slide");
      caraousel.current?.prepend(slides[slides.length - 1]);
      setActiveIndex((prev: number) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleMouseEnterImage = () => {
    setIsInside(true);
  };

  const handleMouseLeaveImage = () => {
    setIsInside(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  const handleMobileViewOpen = () => {
    if (!isSwiping.current) {
      setSelectedImage(images[activeIndex].url);
      setOpen(true);
    }
  };

  return isDesktopView ? (
    <>
      <ImageView images={images} open={open} setOpen={setOpen} url={selectedImage} />
      <div className="w-full md:w-[48%] flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-2">
          {images.map((item: { url: string; fileID: string }) => (
            <button
              onClick={() => setSelectedImage(item.url)}
              key={item.url}
              className={`w-24 h-24 relative border ${item.url === selectedImage ? "border-blue-500 border-2" : "border-gray-300"}`}
            >
              <Image src={item.url} alt="img-selector" fill className="object-contain" />
            </button>
          ))}
        </div>

        <div onClick={() => setOpen(true)} className="relative border w-full">
          <div onMouseEnter={handleMouseEnterImage} onMouseLeave={handleMouseLeaveImage} onMouseMove={handleMouseMove} className="relative w-full aspect-square cursor-pointer">
            <Image key={selectedImage} src={selectedImage} alt="img" fill className="object-contain animation-fade-in" />
            <div className={`pointer-events-none fixed w-[40%] h-1/2 top-[30%] left-[55%] transition-opacity duration-300 ${isInside ? "opacity-100" : "opacity-0"} z-50`}>
              <RollOverImageZoom url={selectedImage} backgroundPosition={backgroundPosition} />
            </div>
          </div>
          <div className="w-full text-center text-slate-300">Roll over to zoom image</div>
        </div>
      </div>
    </>
  ) : (
    <>
      {open && <MobileImageView images={images} setOpen={setOpen} url={selectedImage} />}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={caraousel}
        onClick={handleMobileViewOpen}
        className="relative w-full aspect-square border overflow-hidden"
      >
        {renderedImages?.map((item: { url: string }, i: number) => (
          <div key={item.url + i} className="mob-carousel-slide absolute w-full h-full">
            <Image src={item.url} alt="image" fill />
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-center w-full">
        {images.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full  ${i === activeIndex ? "bg-gray-500" : "bg-gray-200"}`}></div>
        ))}
      </div>
    </>
  );
};

export default ImageCarousel;
