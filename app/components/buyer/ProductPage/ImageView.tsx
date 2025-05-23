import React, { useEffect, useState } from "react";
import "../../../CSS/Ecommerce.css";
import { Dialog, DialogContent } from "@mui/material";
import { ImageViewProps } from "@/Types/type";
import Image from "next/image";

const style = { position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", overflow: "hidden" };
const ImageView: React.FC<ImageViewProps> = ({ images, open, setOpen, url }) => {
  const [selectedImage, setSelectedImage] = useState<string>();
  const [zoom, setZoom] = useState<number>(0);
  const [transformOrigin, setTransformOrigin] = useState<string>("");
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    url ? setSelectedImage(url) : setSelectedImage(images[0].url);
  }, [url]);

  useEffect(() => {
    setZoom(0);
  }, [selectedImage]);

  const handleZoom = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTransformOrigin(`${x}% ${y}%`);
    if (zoom === 0) {
      setZoom(3);
      setIsZoomed(true);
    } else {
      setZoom(0);
      setIsZoomed(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTransformOrigin(`${x}% ${y}%`);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            height: "80vh",
            marginInline: "auto",
          },
        },
      }}
    >
      <DialogContent sx={style}>
        <Image
          onMouseMove={handleMouseMove}
          onClick={handleZoom}
          key={selectedImage}
          src={selectedImage!}
          alt="image"
          fill
          className="object-contain animation-fade-in"
          style={{
            transform: zoom === 0 ? "scale(1)" : `scale(${zoom})`,
            transformOrigin: transformOrigin,
            transition: "transform 0.3s ease-in-out",
            cursor: zoom === 0 ? "zoom-in" : "zoom-out",
          }}
        />
      </DialogContent>
      <DialogContent sx={{ overflow: "hidden" }}>
        <div className="flex justify-center gap-2 overflow-hidden container mx-auto">
          {images.map((item: { url: string; fileID: string }) => (
            <button
              onClick={() => setSelectedImage(item.url)}
              key={item.fileID}
              className={`w-10 h-10 relative border ${item.url === selectedImage ? "border-blue-500 border-2" : "border-gray-300"}`}
            >
              <Image src={item.url} alt="img-selector" fill className="object-contain" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageView;
