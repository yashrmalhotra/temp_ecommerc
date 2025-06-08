import FlakeId from "flake-idgen";
import intFormat from "biguint-format";
import { ProductInfo } from "@/Types/type";
import axios from "axios";
export const formatTimer = (seconds: number): string => {
  const sec = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  return `${min}:${sec}`;
};

export const parseFormData = (formData: FormData) => {
  const productInfo: ProductInfo = {
    category: formData.get("category"),
    createdBy: formData.get("createdBy"),
    createdByStatus: formData.get("createdByStatus"),
    subCategory: formData.get("subCategory"),
    basicInfo: JSON.parse(formData.get("basicInfo") as string),
    offer: JSON.parse(formData.get("offer") as string),
    images: formData.getAll("images") as File[],
    productDescription: JSON.parse(formData.get("productDescription") as string),
    dimensions: JSON.parse(formData.get("dimensions") as string),
    keywords: JSON.parse(formData.get("keywords") as string),
    additionalInfo: JSON.parse(formData.get("additionalInfo") as string),
    status: formData.get("status") as string,
  };
  const pid = formData.get("pid");
  if (pid) {
    productInfo.pid = pid;
  }
  return productInfo;
};
const uid = new FlakeId({ id: 1 });
export const getUserId = (email: string) => {
  const spliceEmail = email.slice(0, 4);
  const id = intFormat(uid.next(), "dec");
  const idToString = id.toString().slice(4, 11);
  return spliceEmail + idToString;
};

const categoryCodes = {
  Electronics: "MXMH",
  Fashion: "NEKP",
  Home: "PKEM",
  Books: "GKKX",
  Sports: "CHKJ",
};
const subCategoryCodes = {
  Mobiles: "PKGU",
  Laptops: "XEHD",
  Cameras: "IEYO",
  MEN: "PXVP",
  Women: "BKPX",
  Kids: "WUSK",
  Fiction: "RGHG",
  Novel: "PKBM",
  Comics: "IKPU",
  Cricket: "IJSH",
  Football: "RKKD",
  Fitness: "RSDP",
};
const pid = new FlakeId({ id: 2 });
type catKey = keyof typeof categoryCodes;
type subcatKey = keyof typeof subCategoryCodes;
export const getProductId = (cat: catKey, subcat: subcatKey) => {
  const catCode = categoryCodes[cat];
  const subcatCode = subCategoryCodes[subcat];
  const id = intFormat(pid.next(), "dec");
  const idToString = id.toString().slice(4, 11);
  console.log(idToString, "idts");
  return catCode + subcatCode + idToString;
};

export const parseProduct = async (product: any) => {
  product.offer.mrp = String(product.offer.mrp);
  product.offer.price = String(product.offer.price);
  product.offer.stock = String(product.offer.stock);
  const fetchImages = await Promise.all(
    product.images.map(async (file: { url: string; fileID: string }, i: number) => {
      try {
        const response = await axios.get(file.url, { responseType: "blob" });
        const blob = response.data;
        const image = new File([blob], file.url, { type: blob.type });
        return image;
      } catch (error) {
        console.log("error in fetching data of image", error);
        return null; // return null or handle failed downloads gracefully
      }
    })
  );
  while (fetchImages.length < 4) {
    fetchImages.push(undefined);
  }
  product.images = fetchImages;

  product.dimensions.productDimensions.length.digit = String(product.dimensions.productDimensions.length.digit);
  product.dimensions.productDimensions.width.digit = String(product.dimensions.productDimensions.width.digit);
  product.dimensions.productDimensions.height.digit = String(product.dimensions.productDimensions.height.digit);
  product.dimensions.productDimensions.weight.digit = String(product.dimensions.productDimensions.weight.digit);

  product.dimensions.packageDimensions.length.digit = String(product.dimensions.packageDimensions.length.digit);
  product.dimensions.packageDimensions.width.digit = String(product.dimensions.packageDimensions.width.digit);
  product.dimensions.packageDimensions.height.digit = String(product.dimensions.packageDimensions.height.digit);
  product.dimensions.packageDimensions.weight.digit = String(product.dimensions.packageDimensions.weight.digit);

  if (product.additionalInfo && !Array.isArray(product.additionalInfo)) {
    product.additionalInfo = Object.entries(product.additionalInfo).map(([key, value]) => ({
      key,
      value: String(value ?? ""),
    }));
  }

  return product;
};

const totalVisible = 7;
export const getPaginationRange = (currentPage: number, totalPages: number) => {
  const range = [];

  if (totalPages <= totalVisible) {
    for (let i = 1; i <= totalPages; i++) {
      range.push(i);
    }
  } else {
    const left = Math.max(1, currentPage - 3);
    const right = Math.min(totalPages, currentPage + 3);
    if (left > 2) range.push(1, "...");
    else for (let i = 1; i < left; i++) range.push(i);
    for (let i = left; i <= right; i++) range.push(i);

    if (right < totalPages - 1) range.push("...", totalPages);
    else for (let i = right + 1; i <= totalPages; i++) range.push(i);
  }

  return range;
};
