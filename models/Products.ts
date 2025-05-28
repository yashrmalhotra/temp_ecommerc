import { IProduct } from "@/Types/type";
import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema<IProduct>(
  {
    category: { type: String },
    subCategory: { type: String },
    basicInfo: {
      title: { type: String },
      brandName: { type: String },
      manufacturer: { type: String },
      sku: { type: String },
      modelNumber: { type: String },
    },
    offer: {
      price: { type: Number },
      mrp: { type: Number },
      stock: { type: Number },
    },
    images: [{ url: String, fileID: String }],
    productDescription: {
      description: { type: String },
      bulletPoints: { type: [String] },
    },
    dimensions: {
      productDimensions: {
        length: {
          digit: { type: Number },
          unit: { type: String, enum: ["Meter", "CM", "KM", "Inch"] },
        },
        width: {
          digit: { type: Number },
          unit: { type: String, enum: ["Meter", "CM", "KM", "Inch"] },
        },
        height: {
          digit: { type: Number },
          unit: { type: String, enum: ["Meter", "CM", "KM", "Inch"] },
        },
        weight: {
          digit: { type: Number },
          unit: { type: String, enum: ["KG", "Grams", "LBS", "Quantal"] },
        },
      },
      packageDimensions: {
        length: {
          digit: { type: Number },
          unit: { type: String, enum: ["Meter", "CM", "KM", "Inch"] },
        },
        width: {
          digit: { type: Number },
          unit: { type: String, enum: ["Meter", "CM", "KM", "Inch"] },
        },
        height: {
          digit: { type: Number },
          unit: { type: String, enum: ["Meter", "CM", "KM", "Inch"] },
        },
        weight: {
          digit: { type: Number },
          unit: { type: String, enum: ["KG", "Grams", "LBS", "Quantal"] },
        },
      },
    },
    keywords: { type: [String], index: true },
    additionalInfo: [{ key: { type: String }, value: { type: String } }],
    performance: {
      sales: Number,
      unit_sold: Number,
      clicks: Number,
      ratings: Number,
      noOfRaters: Number,
    },
    status: { type: String, enum: ["live", "draft", "out of stock", "inactive"] },
    createdBy: { type: String, index: true },
    createdByStatus: { type: String, default: "inactive" },
    sku: String,
    views: Number,
    clickCount: Number,
    clickedKeywords: [String],
    orderedOnKeywords: [String],
    pid: String,
  },

  { timestamps: true }
);

ProductSchema.index({ "basicInfo.title": 1 });
const Product = models?.Product || model<IProduct>("Product", ProductSchema);

export default Product;
