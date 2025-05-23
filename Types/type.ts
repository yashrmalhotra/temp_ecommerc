/*eslint-disable
@typescript-eslint/no-explicit-any
 */
import React, { Dispatch, SetStateAction } from "react";
import { FormState, UseFieldArrayAppend, UseFieldArrayRemove, UseFormGetValues, UseFormSetValue, FieldArrayWithId } from "react-hook-form";
import { z } from "zod";
import mongoose, { Document } from "mongoose";
export interface User {
  name: string;
}
export interface BuyerProductCard {
  title: string;
  mrp: number;
  price: number;
  imageUrl: string;
  url: string;
  layout?: string;
  ratings?: string;
}
export interface ImageCarouselProps {
  isDesktopView: boolean;
  images: any[];
  open: boolean;
}

export interface ImageViewProps {
  images: any[];
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;

  url: string;
}
export interface ImageInfo {
  url: string;
  id: number;
}
interface Url_Text {
  url: string;
  text: string;
}
export interface HeaderProps {
  setProducts?: React.Dispatch<SetStateAction<any[]>>;
  setBrands?: React.Dispatch<SetStateAction<string[]>>;
  setTotalPages?: React.Dispatch<SetStateAction<number>>;
}
export interface Option {
  options: Url_Text[];
  forpath?: string;
  isHover: boolean;
  setIsHover: (state: boolean) => void;
  getOptionsDivListScrollHeight: () => number | null;
  additionalStyle?: string;
}
export interface PinedLinkType {
  name: string;
  url: string;
}
export interface CardText {
  text: string;
  stats: number;
  url: string;
  amount?: boolean;
}
export interface InputProps {
  labelText: string;
  mendatory?: string;
  placeholder: string;
  additionalStyle?: string;
  register?: any;
  error?: any;
  disabled?: boolean;
}
export interface FormProps {
  category: string;
  subCategory: string;
  pid: string;
}
export interface CategorySelectorProps {
  onSelect: (category: string, subcategory: string) => void;
}
export interface FormGroupProps {
  register?: any;
  errors?: any;
}
export interface InventorySearchFilterProps {
  dispatchFilter: React.Dispatch<{ type: string; payload?: any }>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string | undefined;
  handleSearchClick: () => void;
}
export interface ProductInfo {
  category: FormDataEntryValue | null;
  createdBy: FormDataEntryValue | null;
  createdByStatus: FormDataEntryValue | null;
  subCategory: FormDataEntryValue | null;
  basicInfo: any;
  offer: any;
  images?: any;
  productDescription: any;
  dimensions: any;
  keywords: any;
  additionalInfo: any;
  status: string;
  fileIDs?: string[];
  urls?: string[];
  pid?: FormDataEntryValue | null;
}

export interface OTPProps {
  email: string;
  setVisible?: React.Dispatch<SetStateAction<boolean>>;
  path?: string;
  timer: string;
  resend: (email?: string) => Promise<void>;
}
export enum UserRole {
  SELLER = "seller",
  BUYER = "buyer",
}
export interface IUSER extends Document {
  name: string;
  email: string;
  password: string;
  cart: mongoose.Types.ObjectId[];
  googleId: string;
  role: string[];
  buyerAddresses?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    default?: boolean;
  };
  sellerShopDisplayName: string;
  sellerAddress?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  sellerAccountStatus: "actve" | "inactive";
  sellerBankAccountDetails: {
    accountType: "saving" | "current";
    accountHolderName: string;
    accountNumber: string;
    ifsc: string;
  };
  pinedLink: { url: string; name: string }[];

  isVerified: boolean;
  uid: string;
}
interface IDimension {
  digit: number;
  unit: "Meter" | "CM" | "KM" | "Inch" | "KG" | "Grams" | "LBS" | "Quantal";
}

export interface IProduct extends Document {
  category: string;
  subCategory: string;

  basicInfo: {
    title: string;
    brandName?: string;
    manufacturer?: string;
    modelNumber?: string;
    sku: string;
  };
  offer: {
    price?: number;
    mrp?: number;
    stock?: number;
  };
  images: { url: string; fileID: string }[]; // Assuming image paths/URLs
  productDescription: {
    description?: string;
    bulletPoints?: string[];
  };
  dimensions: {
    productDimensions: {
      length: IDimension;
      width: IDimension;
      height: IDimension;
      weight: IDimension;
    };
    packageDimensions: {
      length: IDimension;
      width: IDimension;
      height: IDimension;
      weight: IDimension;
    };
  };
  keywords?: string[];
  additionalInfo: {
    key?: string;
    value?: string;
  }[];
  performance: {
    sales: number;
    unit_sold: number;
    clicks: number;
    ratings: number;
    noOfRaters: number;
  };
  status: "live" | "draft" | "out of stock"; // This determines if it's a draft
  createdBy: string;
  createdByStatus: string;
  views: number;
  clickedKeywords: string[];
  orderedOnKeywords: string[];
  sku?: string;
  pid?: string;
}

export interface LoaderProps {
  width: string;
  height: string;
}
export interface UserForm {
  url: string;
  role: UserRole;
}
export interface ReactNodeProp {
  children: React.ReactNode;
}

export interface UserDetails {
  _id?: string;
  name: string;
  email: string;
  isVerified: boolean;
  uid: string;
  role: string[];
  buyerAddresses?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    default?: boolean;
  }[];
  sellerAccountStatus?: string;
  sellerShopDisplayName: string;
  sellerAddress?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  sellerBankAccountDetails: {
    accountType: "saving" | "current";
    accountHolderName: string;
    accountNumber: string;
    ifsc: string;
  };
  pinedLink: { name: string; url: string }[];
}

export interface Address {
  address: string;
  city?: string;
  state: string;
  pincode: string;
  default?: boolean;
  index?: number;
}
export interface UserDetailsContextTypes {
  userDetails: UserDetails | undefined;
  setUserDetails: React.Dispatch<SetStateAction<UserDetails | undefined>>;
  status: string;
}

export interface SearchContextTypes {
  pageNumber: number | undefined;
  setPageNumber: React.Dispatch<SetStateAction<number | undefined>>;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}
// Define filter state type
export interface FiltersState {
  brand: string[];
  rating: number[];
  category: string[];
  sortBy: string;
  price: [number, number];
}
export type FiltersAction =
  | { type: "TOGGLE_CHECKBOX"; payload: { field: keyof Pick<FiltersState, "brand" | "rating" | "category">; value: string | number } }
  | { type: "UPDATE_SORT"; payload: string }
  | { type: "UPDATE_PRICE"; payload: [number, number] }
  | { type: "UPDATE_MIN_PRICE"; payload: number }
  | { type: "UPDATE_MAX_PRICE"; payload: number };
export interface FilterSortProps {
  filters: any;
  dispatchFilter: React.Dispatch<FiltersAction>;
  brands: string[];
}
// Define actions for reducer

export const EmailOnlySchema = z.object({
  email: z.string().email("Please enter a valid email"),
});
export const FullSignUpFormSchema = z
  .object({
    name: z.string().min(1, "Name field is required"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must contains atleast 8 characters")
      .refine((val) => /[a-zA-Z]/.test(val), "Must contain atleast one letter")
      .refine((val) => /\d/.test(val), "Must contain atleast one number"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, { message: "Password and confirm password must be same", path: ["confirmPassword"] });
export const SignInFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const imageSchema = z
  .any()
  .refine((file) => file instanceof File && file.size > 0, {
    message: "Main image is required",
  })
  .refine((file) => file instanceof File && ["image/jpeg", "image/png"].includes(file.type), {
    message: "Only PNG and JPEG images are allowed",
  });

const optionalImageSchema = z
  .any()
  .refine((file) => file === undefined || (file instanceof File && ["image/jpeg", "image/png"].includes(file.type)), {
    message: "Only PNG and JPEG images are allowed",
  })
  .optional();
export const FormSchema = (mode: string) => {
  return z.object({
    pid: z.string(),
    category: z.string(),
    subCategory: z.string(),
    basicInfo: z.object({
      title: z.string().min(1, "Title is required"),
      brandName: mode === "submit" ? z.string().min(1, "Brand name is required") : z.string().optional(),
      manufacturer: mode === "submit" ? z.string().min(1, "Manufacturer is required") : z.string().optional(),
      sku: mode === "submit" ? z.string().min(1, "Sku is required") : z.string().optional(),
      modelNumber: z.string().optional(),
    }),
    offer: z
      .object({
        price:
          mode === "submit"
            ? z.string().min(1, "Price is required").regex(/^\d+$/, { message: "Price must be a number" }).transform(Number)
            : z.string().transform(Number).optional(),
        mrp:
          mode === "submit" ? z.string().min(1, "MRP is required").regex(/^\d+$/, { message: "MRP must be a number" }).transform(Number) : z.string().transform(Number).optional(),
        stock:
          mode === "submit"
            ? z.string().min(1, "Stock is required").regex(/^\d+$/, { message: "Stock must be a number" }).transform(Number)
            : z.string().transform(Number).optional(),
      })
      .refine((data) => data.mrp! >= data.price!, {
        message: "MRP must be greater than or equal to price",
        path: ["mrp"],
      }),
    images: z.tuple([imageSchema, optionalImageSchema, optionalImageSchema, optionalImageSchema]),

    productDescription: z.object({
      description: mode === "submit" ? z.string().min(20, "Description required minimum 20 letters") : z.string().optional(),
      bulletPoints: mode === "submit" ? z.array(z.string().min(10, "Minimum 10 letter required")).min(1, "At least 1 bullet point required") : z.array(z.string()).optional(),
    }),

    dimensions: z.object({
      productDimensions: z
        .object({
          length: z.object({
            digit:
              mode === "submit"
                ? z.string().min(1, "Length is required").regex(/^\d+$/, { message: "Length must be a number" }).transform(Number)
                : z
                    .string()
                    .refine((val) => val === "" || /^\d+$/.test(val), { message: "Length must be a number" })
                    .transform(Number)
                    .optional(),
            unit: z.enum(["Meter", "CM", "KM", "Inch"]),
          }),
          width: z.object({
            digit:
              mode === "submit"
                ? z.string().min(1, "Width is required").regex(/^\d+$/, { message: "Width must be a number" }).transform(Number)
                : z
                    .string()
                    .refine((val) => val === "" || /^\d+$/.test(val), { message: "Width must be a number" })
                    .transform(Number)
                    .optional(),
            unit: z.enum(["Meter", "CM", "KM", "Inch"]),
          }),
          height: z.object({
            digit:
              mode === "submit"
                ? z.string().min(1, "Height is required").regex(/^\d+$/, { message: "Height must be a number" }).transform(Number)
                : z
                    .string()
                    .refine((val) => val === "" || /^\d+$/.test(val), { message: "Height must be a number" })
                    .transform(Number)
                    .optional(),
            unit: z.enum(["Meter", "CM", "KM", "Inch"]),
          }),
          weight: z.object({
            digit:
              mode === "submit"
                ? z.string().min(1, "Weight is required").regex(/^\d+$/, { message: "Weight must be a number" }).transform(Number)
                : z
                    .string()
                    .refine((val) => val === "" || /^\d+$/.test(val), { message: "Weight must be a number" })
                    .transform(Number)
                    .optional(),
            unit: z.enum(["KG", "Grams", "LBS", "Quantal"]),
          }),
        })
        .refine((data) => data.length.unit === data.width.unit && data.width.unit === data.height.unit && data.height.unit === data.length.unit, {
          message: "Product dimensions unit values must be same",
        }),
      packageDimensions: z
        .object({
          length: z.object({
            digit:
              mode === "submit"
                ? z.string().min(1, "Length is required").regex(/^\d+$/, { message: "Length must be a number" }).transform(Number)
                : z
                    .string()
                    .refine((val) => val === "" || /^\d+$/.test(val), { message: "Length must be a number" })
                    .transform(Number)
                    .optional(),
            unit: z.enum(["Meter", "CM", "KM", "Inch"]),
          }),
          width: z.object({
            digit:
              mode === "submit"
                ? z.string().min(1, "Width is required").regex(/^\d+$/, { message: "Width must be a number" }).transform(Number)
                : z
                    .string()
                    .refine((val) => val === "" || /^\d+$/.test(val), { message: "Width must be a number" })
                    .transform(Number)
                    .optional(),
            unit: z.enum(["Meter", "CM", "KM", "Inch"]),
          }),
          height: z.object({
            digit:
              mode === "submit"
                ? z.string().min(1, "Height is required").regex(/^\d+$/, { message: "Height must be a number" }).transform(Number)
                : z
                    .string()
                    .refine((val) => val === "" || /^\d+$/.test(val), { message: "Height must be a number" })
                    .transform(Number)
                    .optional(),
            unit: z.enum(["Meter", "CM", "KM", "Inch"]),
          }),
          weight: z.object({
            digit:
              mode === "submit"
                ? z.string().min(1, "Weight is required").regex(/^\d+$/, { message: "Weight must be a number" }).transform(Number)
                : z
                    .string()
                    .refine((val) => val === "" || /^\d+$/.test(val), { message: "Weight must be a number" })
                    .transform(Number)
                    .optional(),
            unit: z.enum(["KG", "Grams", "LBS", "Quantal"]),
          }),
        })
        .refine((data) => data.length.unit === data.width.unit && data.width.unit === data.height.unit && data.height.unit === data.length.unit, {
          message: "Package dimensions unit values must be same",
        }),
    }),
    keywords: mode === "submit" ? z.array(z.string().min(1, "Keyword field must not be empty")).min(1, "At least 1 search Keyword  required") : z.array(z.string()).optional(),
    additionalInfo: z.array(
      z.object({
        key: z.string().min(1, "Key field must not be empty"),
        value: z.string().min(1, "Value field must not be empty"),
      })
    ),
  });
};

export interface ImageURL {
  img1: string;
  img2: string;
  img3: string;
  img4: string;
}
export interface AddressFormProps {
  setFormVisible: React.Dispatch<SetStateAction<boolean>>;
  email: string;
  address: Address;
}
export interface DeleteConfirmProps {
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: React.Dispatch<SetStateAction<boolean>>;
  address: Address;
  email: string;
}
export interface DisplayNameFieldProps {
  displayNameInputOpen: boolean;
  setDisplayNameInputOpen: React.Dispatch<SetStateAction<boolean>>;
  uid: string;
}

// For union usage (e.g., when form could be either mode)
type FormData = z.infer<ReturnType<typeof FormSchema>>; // works for both
export interface ImageProps {
  refs?: React.RefObject<{ [key: string]: HTMLInputElement | null }>;
  url: ImageURL;
  setUrl: Dispatch<SetStateAction<ImageURL>>;
  setValue: UseFormSetValue<FormData>;
  getValues: UseFormGetValues<FormData>;
}

export interface DescriptionProps {
  fields: FieldArrayWithId<FormData, "productDescription.bulletPoints", "id">[];
  append: UseFieldArrayAppend<FormData, "productDescription.bulletPoints">;
  remove: UseFieldArrayRemove;
}
export interface KeywordsProps {
  fields: FieldArrayWithId<FormData, "keywords", "id">[];
  append: UseFieldArrayAppend<FormData, "keywords">;
  remove: UseFieldArrayRemove;
}
export interface additionalInfoProps {
  fields: FieldArrayWithId<FormData, "additionalInfo", "id">[];
  append: UseFieldArrayAppend<FormData, "additionalInfo">;
  remove: UseFieldArrayRemove;
}
export const AddressZodSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Please enter valid pincode").max(6, "Please enter valid pincode").regex(/^\d+$/, { message: "Pincode must be a number" }),
  default: z.boolean(),
  index: z.number().optional(),
});
export const EditUserNameZodSchema = z.object({
  name: z.string().min(1, "Name field mus not be empty"),
});
export const ShopDisplayNameZodSchema = z.object({
  displayName: z.string().min(1, "Please enter shop display name"),
});
export const SellerAddressZodSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Please enter valid pincode").max(6, "Please enter valid pincode").regex(/^\d+$/, { message: "Pincode must be a number" }),
});
export type SellerAddressSchema = z.infer<typeof SellerAddressZodSchema>;
export interface SellerFormProps {
  formOpen: boolean;
  setFormOpen: React.Dispatch<SetStateAction<boolean>>;
  uid: string;
}
export interface SellerAddressSchemaProps {
  sellerAddress: SellerAddressSchema;
}
export const SellerBankAccountZodSchema = z.object({
  accountType: z.enum(["saving", "current"]),
  accountHolderName: z.string().min(1, "A/C holder name is required"),
  accountNumber: z.string().min(1, "Please enter account number").regex(/^\d+$/, { message: "Please enter valid account rumber" }),
  ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Please enter valid IFSC code" }),
});
export type SellerBankAccountSchema = z.infer<typeof SellerBankAccountZodSchema>;
export interface SellerBankAccountSchemaProps {
  sellerBankAccount: SellerBankAccountSchema;
}
