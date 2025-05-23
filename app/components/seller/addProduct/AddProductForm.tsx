"use client";
import React, { useEffect, useRef, useState } from "react";
import SellerNavbar from "../SellerNavbar";
import Link from "next/link";
import BasicInfoFormGroup from "./BasicInfoFormGroup";
import OfferFormGroup from "./OfferFormGroup";
import Description from "./Decription";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import AdditionalInfo from "./AdditionalInfo";
import { FormSchema, ImageURL } from "@/Types/type";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Images from "./Images";
import Keywords from "./Keywords";
import { FormProps } from "@/Types/type";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import "../../../CSS/Ecommerce.css";
import axios from "axios";
import ThreeDotLoader from "../../ThreeDotLoader";
import { parseProduct } from "@/utill/utillityFunctions";
import { useRouter } from "next/navigation";
type formData = z.infer<ReturnType<typeof FormSchema>>;
const AddProductForm: React.FC<FormProps> = ({ category, subCategory, pid }) => {
  const [mode, setMode] = useState<string>("");
  const [tab, setTab] = useState<string>("basic_info");
  const inputRef = useRef<{ [key: string]: HTMLInputElement | null }>({
    inputRef1: null,
    inputRef2: null,
    inputRef3: null,
    inputRef4: null,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navRef = useRef<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const context = useUserDetails();
  const [mainImageURL, setMainImageURL] = useState<string>();
  const [urls, setUrls] = useState<ImageURL>({
    img1: "",
    img2: "",
    img3: "",
    img4: "",
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    reset,
    formState: { errors },
  } = useForm<formData>({
    defaultValues: {
      pid: "",
      basicInfo: {
        title: "",
        brandName: "",
        manufacturer: "",
        sku: "",
        modelNumber: "",
      },
      offer: {
        mrp: undefined,
        price: undefined,
        stock: undefined,
      },
      images: [undefined, undefined, undefined, undefined],
      productDescription: {
        description: "",
        bulletPoints: [""],
      },
      dimensions: {
        productDimensions: {
          length: {
            digit: "",
            unit: "CM",
          },
          width: {
            digit: "",
            unit: "CM",
          },
          height: {
            digit: "",
            unit: "CM",
          },
          weight: {
            digit: "",
            unit: "Grams",
          },
        },
        packageDimensions: {
          length: {
            digit: "",
            unit: "CM",
          },
          width: {
            digit: "",
            unit: "CM",
          },
          height: {
            digit: "",
            unit: "CM",
          },
          weight: {
            digit: "",
            unit: "Grams",
          },
        },
      },
      additionalInfo: [{ key: "", value: "" }],
    },
    resolver: zodResolver(FormSchema(mode)),
  });

  const {
    fields: bulletPointField,
    append: bulletPointAppend,
    remove: bulletPointRemove,
  } = useFieldArray({
    control,
    name: "productDescription.bulletPoints",
  });
  const {
    fields: keywordField,
    append: keywordAppend,
    remove: keywordRemove,
  } = useFieldArray({
    control,
    name: "keywords",
  });
  const {
    fields: additionalInfoField,
    append: additionalnfoAppend,
    remove: additionalInforemove,
  } = useFieldArray({
    control,
    name: "additionalInfo",
  });

  const router = useRouter();
  useEffect(() => {
    if (pid) {
      (async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/seller/product?pid=${pid}`);

          const product = response.data.product;
          setMainImageURL(product.images[0].url);
          product.images.forEach((file: { url: string }, i: number) => setUrls((prev) => ({ ...prev, [`img${i + 1}`]: file.url })));
          const parsedProduct = await parseProduct(product);
          console.log("parsedProduct", parsedProduct, "product");
          reset(parsedProduct);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setValue("category", category);
      setValue("subCategory", subCategory);
    }
  }, []);

  const handleTabSwitch = (tabName: string) => {
    setTab(tabName);
  };

  const onSubmit = async (data: any, currentMode: string) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            formData.append("images", file);
          }
        });
      } else if (value !== undefined) {
        if (typeof value === "object" && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });

    formData.append("status", currentMode);
    formData.append("createdBy", context?.userDetails?.uid as string);
    formData.append("createdByStatus", context?.userDetails?.sellerAccountStatus as string);
    if (pid) {
      try {
        setIsLoading(true);

        await axios.put("/api/seller/product", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        window.location.reload();
      } catch (error: any) {
        setError("root", {
          type: "manual",
          message: error.message,
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }
    try {
      setIsLoading(true);
      await axios.post("/api/seller/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.replace("/seller/manage-inventory");
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(navRef.current.scrollLeft);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !navRef.current) return;

    const x = e.pageX;
    const walk = x - startX;
    navRef.current.scrollLeft = scrollLeft - walk;
  };
  const stopDragging = () => {
    setIsDragging(false);
  };
  const submitForm = (currentMode: string) => {
    setMode(currentMode);
    setTimeout(() => {
      handleSubmit((data: any) => onSubmit(data, currentMode))();
    }, 10);
  };
  console.log(errors);
  return (
    <>
      {isLoading && <ThreeDotLoader />}
      <SellerNavbar />
      <main className="mt-[110px]">
        {pid && (
          <div className="flex mt-7 border container p-2 mx-auto items-center gap-2 rounded-xl">
            <img src={`${mainImageURL}`} alt="main_image" width={200} height={200} />
            <div>
              <div className="text-2xl font-bold hover:underline">
                <Link href={""} className="hover:underline">
                  {getValues("basicInfo.title")}
                </Link>
              </div>
              <div className="font-bold"> {getValues("offer.price")}</div>
            </div>
          </div>
        )}
        <nav
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={stopDragging}
          onMouseUp={stopDragging}
          ref={navRef}
          className="mt-7 border-2  flex gap-8 overflow-hidden px-3 py-1  md:justify-around shadow-xl container mx-auto md:text-sm rounded-xl "
        >
          <button onClick={() => handleTabSwitch("basic_info")} className={`${tab === "basic_info" && "border-b-2 border-blue-700"} flex gap-2 flex-shrink-0 items-center`}>
            Basic info {errors.basicInfo && <div className="w-5 h-5 ml-1 bg-red-500 rounded-full text-white">i</div>}
          </button>
          <button onClick={() => handleTabSwitch("offer")} className={`${tab === "offer" && "border-b-2 border-blue-700"} flex gap-2 flex-shrink-0 items-center`}>
            Offer {errors.offer && <div className="w-5 h-5 ml-1 bg-red-500 rounded-full text-white">i</div>}
          </button>{" "}
          <button onClick={() => handleTabSwitch("images")} className={`${tab === "images" && "border-b-2 border-blue-700"} flex gap-2 flex-shrink-0 items-center`}>
            Images {errors.images && <div className="w-5 h-5 ml-1 bg-red-500 rounded-full text-white">i</div>}
          </button>
          <button onClick={() => handleTabSwitch("description")} className={`${tab === "description" && "border-b-2 border-blue-700"} flex gap-2 flex-shrink-0 items-center`}>
            Product Description {errors.productDescription && <div className="w-5 h-5 ml-1 bg-red-500 rounded-full text-white">i</div>}
          </button>
          <button onClick={() => handleTabSwitch("keywords")} className={`${tab === "keywords" && "border-b-2 border-blue-700"} flex gap-2 flex-shrink-0 items-center`}>
            Keywords {errors.dimensions && <div className="w-5 h-5 ml-1 bg-red-500 rounded-full text-white">i</div>}
          </button>
          <button
            onClick={() => handleTabSwitch("additional_info")}
            className={`${tab === "additional_info" && "border-b-2 border-blue-700"} flex gap-2 flex-shrink-0 items-center`}
          >
            Additional info {(errors.dimensions || errors.additionalInfo) && <div className="w-5 h-5 ml-1 bg-red-500 rounded-full text-white">i</div>}
          </button>
        </nav>

        <div className="container p-2  mx-auto md:text-sm mb-5">
          <h5 className="text-xl font-bold mt-2">
            Indicated by <span className="text-red-400">*</span> must be filled
          </h5>
          <Controller
            name="images.0"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(e: HTMLInputElement) => {
                  inputRef.current.inputRef1 = e;
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  field.onChange(file);
                  const url = URL.createObjectURL(file);
                  setValue("images.0", file);
                  setUrls({ ...urls, img1: url });
                }}
              />
            )}
          />
          <Controller
            name="images.1"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(e: HTMLInputElement) => {
                  inputRef.current.inputRef2 = e;
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  field.onChange(file);
                  const url = URL.createObjectURL(file);
                  setValue("images.1", file);
                  setUrls({ ...urls, img2: url });
                }}
              />
            )}
          />
          <Controller
            name="images.2"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(e: HTMLInputElement) => {
                  inputRef.current.inputRef3 = e;
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  field.onChange(file);
                  const url = URL.createObjectURL(file);
                  setValue("images.2", file);
                  setUrls({ ...urls, img3: url });
                }}
              />
            )}
          />
          <Controller
            name="images.3"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(e: HTMLInputElement) => {
                  inputRef.current.inputRef4 = e;
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  field.onChange(file);
                  const url = URL.createObjectURL(file);
                  setValue("images.3", file);
                  setUrls({ ...urls, img4: url });
                }}
              />
            )}
          />
          <form>
            {tab === "basic_info" && <BasicInfoFormGroup register={register} errors={errors.basicInfo} />}
            {tab === "offer" && <OfferFormGroup register={register} errors={errors.offer} />}
            {tab === "images" && <Images register={register} errors={errors.images} refs={inputRef} url={urls} setUrl={setUrls} setValue={setValue} getValues={getValues} />}
            {tab === "description" && (
              <Description register={register} errors={errors.productDescription} fields={bulletPointField} append={bulletPointAppend} remove={bulletPointRemove} />
            )}
            {tab === "keywords" && <Keywords register={register} errors={errors.keywords} fields={keywordField} append={keywordAppend} remove={keywordRemove} />}
            {tab === "additional_info" && (
              <AdditionalInfo register={register} errors={errors} fields={additionalInfoField} append={additionalnfoAppend} remove={additionalInforemove} />
            )}

            <div className="flex md:justify-end mt-1 gap-3">
              <button type="button" className="bg-slate-700 text-white rounded-xl py-2 px-5" onClick={() => submitForm("draft")}>
                Save as draft
              </button>
              <button
                type="button"
                disabled={!context?.userDetails?.isVerified}
                className="active-on-verified bg-blue-700 relative disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-xl py-2 px-5"
                onClick={() => submitForm("submit")}
              >
                Submit
                {!context?.userDetails?.isVerified && (
                  <div className="verification-active-message absolute bottom-[90%] -left-1 bg-black font-bold p-2 w-32 text-white">
                    Please verified first to access this option
                  </div>
                )}
              </button>
            </div>
            {errors?.root && <div className="text-red-500 font-bold">{errors?.root?.message}</div>}
          </form>
        </div>
      </main>
    </>
  );
};

export default AddProductForm;
