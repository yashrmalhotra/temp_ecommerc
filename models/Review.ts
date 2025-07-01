import { IREVIEW } from "@/Types/type";
import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema<IREVIEW>(
  {
    oid: String,
    pid: String,
    uid: String,
    name: String,
    rating: Number,
    review: String,
  },
  { timestamps: true }
);

const Review = models?.Review || model("Review", ReviewSchema);
export default Review;
