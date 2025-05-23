"use client";
import React, { memo, useEffect } from "react";
import "../../../CSS/Ecommerce.css";
import { FormGroupProps, ImageProps } from "@/Types/type";
import { MdFlipCameraAndroid, MdDeleteForever } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
const Images: React.FC<FormGroupProps & ImageProps> = memo(({ errors, refs, url, setUrl, setValue, getValues }) => {
  const openFile = (ref: HTMLInputElement) => {
    ref.click();
  };

  useEffect(() => {
    console.log("urls = ", url);
  }, [url]);
  const changeFile = (ref: HTMLInputElement) => {
    ref.click();
  };
  const handleDelete = (key: string, formKey: string): void => {
    setUrl({ ...url, [key]: "" });
    setValue(formKey as any, undefined);
  };

  const moveImage = (key1: string, val1: string, key2: string, val2: string, formKey1: string, formValue1: File, formKey2: string, formValue2: File) => {
    setUrl({ ...url, [key1]: val2, [key2]: val1 });
    setValue(formKey1 as any, formValue2);
    setValue(formKey2 as any, formValue1);
  };
  return (
    <section>
      <div className="flex flex-wrap w-full gap-8 justify-center md:justify-between mt-5">
        <div className={`form-image-container md:w-[21%] aspect-square ${!url.img1 && "bg-slate-400"} flex flex-col items-center justify-center rounded-lg flex-shrink-0`}>
          {url.img1 ? (
            <div className="relative form-image w-full h-full">
              <div className="absolute bg-black hidden bottom-0 bg-opacity-25 z-10 w-full justify-around items-center h-10 form-image-tooltip">
                <button type="button">
                  <IoIosArrowBack size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>{" "}
                <button type="button" onClick={() => moveImage("img1", url.img1, "img2", url.img2, "images.0", getValues("images.0"), "images.1", getValues("images.1"))}>
                  <IoIosArrowForward size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>{" "}
                <button type="button" onClick={() => changeFile(refs?.current.inputRef1)}>
                  <MdFlipCameraAndroid size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>
                <button type="button" onClick={() => handleDelete("img1", "images.0")}>
                  <MdDeleteForever size={25} color="red" stroke="10" className="hover:fill-red-700" />{" "}
                </button>
              </div>
              <img className="w-full h-full cover" src={url.img1} alt="image" height={500} width={500} />
            </div>
          ) : (
            <>
              <div className="flex">
                <button onClick={() => openFile(refs?.current.inputRef1)} type="button" className="active:text-blue-800 hover:underline">
                  Main Image
                </button>
                &nbsp;
                <span className="text-red-400 font-extrabold">*</span>
              </div>
              {errors?.[0] && <div className="text-red-500 font-bold">{errors[0]?.message}</div>}
            </>
          )}
        </div>
        <div className={`form-image-container md:w-[21%] aspect-square ${!url.img2 && "bg-slate-400"} flex flex-col items-center justify-center rounded-lg flex-shrink-0`}>
          {url.img2 ? (
            <div className="form-image relative w-full h-full">
              <div className="absolute bg-black hidden bottom-0 bg-opacity-25 z-10 w-full justify-around h-10 form-image-tooltip">
                <button type="button" onClick={() => moveImage("img2", url.img2, "img1", url.img1, "images.1", getValues("images.1"), "images.0", getValues("images.0"))}>
                  <IoIosArrowBack size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>{" "}
                <button type="button" onClick={() => moveImage("img2", url.img2, "img3", url.img3, "images.1", getValues("images.1"), "images.2", getValues("images.2"))}>
                  <IoIosArrowForward size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>{" "}
                <button type="button" onClick={() => changeFile(refs?.current.inputRef2)}>
                  <MdFlipCameraAndroid size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>
                <button type="button" onClick={() => handleDelete("img2", "images.1")}>
                  <MdDeleteForever size={25} color="red" stroke="10" className="hover:fill-red-700" />{" "}
                </button>
              </div>
              <img className="w-full h-full cover" src={url.img2} alt="image" height={500} width={500} />
            </div>
          ) : (
            <>
              <div className="flex">
                <button
                  onClick={() => openFile(refs?.current.inputRef2)}
                  type="button"
                  disabled={!getValues("images.0")}
                  className="active:text-blue-800 hover:underline disabled:cursor-not-allowed"
                >
                  Image
                </button>
                &nbsp;
              </div>
              {errors?.[1] && <div className="text-red-500 font-bold">{errors[1]?.message}</div>}
            </>
          )}{" "}
        </div>
        <div className={`form-image-container md:w-[21%] aspect-square ${!url.img3 && "bg-slate-400"} flex flex-col items-center justify-center rounded-lg flex-shrink-0`}>
          {url.img3 ? (
            <div className="relative form-image w-full h-full">
              <div className="absolute bg-black hidden bottom-0 bg-opacity-25 z-10 w-full justify-around h-10 form-image-tooltip">
                <button type="button" onClick={() => moveImage("img3", url.img3, "img2", url.img2, "images.2", getValues("images.2"), "images.1", getValues("images.1"))}>
                  <IoIosArrowBack size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>{" "}
                <button type="button" onClick={() => moveImage("img3", url.img3, "img4", url.img4, "images.2", getValues("images.2"), "images.3", getValues("images.3"))}>
                  <IoIosArrowForward size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>{" "}
                <button type="button" onClick={() => changeFile(refs?.current.inputRef3)}>
                  <MdFlipCameraAndroid size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>
                <button type="button" onClick={() => handleDelete("img3", "images.2")}>
                  <MdDeleteForever size={25} color="red" stroke="10" className="hover:fill-red-700" />{" "}
                </button>
              </div>
              <img className="w-full h-full cover" src={url.img3} alt="image" height={500} width={500} />
            </div>
          ) : (
            <>
              <div className="flex">
                <button
                  onClick={() => openFile(refs?.current.inputRef3)}
                  disabled={!getValues("images.1")}
                  type="button"
                  className="active:text-blue-800 hover:underline disabled:cursor-not-allowed"
                >
                  Image
                </button>
                &nbsp;
              </div>
              {errors?.[2] && <div className="text-red-500 font-bold">{errors[2]?.message}</div>}
            </>
          )}
        </div>
        <div className={`form-image-container md:w-[21%] aspect-square ${!url.img4 && "bg-slate-400"} flex flex-col items-center justify-center rounded-lg flex-shrink-0`}>
          {url.img4 ? (
            <div className="relative form-image w-full h-full">
              <div className="absolute bg-black hidden bottom-0 bg-opacity-25 z-10 w-full justify-around h-10 form-image-tooltip">
                <button type="button" onClick={() => moveImage("img4", url.img4, "img3", url.img3, "images.2", getValues("images.2"), "images.3", getValues("images.3"))}>
                  <IoIosArrowBack size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>{" "}
                <button type="button">
                  <IoIosArrowForward size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>{" "}
                <button type="button" onClick={() => changeFile(refs?.current.inputRef4)}>
                  <MdFlipCameraAndroid size={25} color="white" stroke="10" className="hover:fill-blue-400" />{" "}
                </button>
                <div className="w-[1px] h-full bg-white bg-opacity-70"></div>
                <button type="button" onClick={() => handleDelete("img4", "images.3")}>
                  <MdDeleteForever size={25} color="red" stroke="10" className="hover:fill-red-700" />{" "}
                </button>
              </div>
              <img className="w-full h-full cover" src={url.img4} alt="image" height={500} width={500} />
            </div>
          ) : (
            <>
              <div className="flex">
                <button
                  onClick={() => openFile(refs?.current.inputRef4)}
                  type="button"
                  disabled={!getValues("images.2")}
                  className="active:text-blue-800 hover:underline disabled:cursor-not-allowed"
                >
                  Image
                </button>
                &nbsp;
              </div>
              {errors?.[2] && <div className="text-red-500 font-bold">{errors[2]?.message}</div>}
            </>
          )}
        </div>
      </div>
    </section>
  );
});

export default Images;
