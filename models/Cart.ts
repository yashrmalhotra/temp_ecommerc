import { ICart } from "@/Types/type";
import { Schema, model, models } from "mongoose";

const CartSchema = new Schema<ICart>(
  {
    pid: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    uid: {
      type: String,
      index: true,
    },
    qty: Number,
  },
  { timestamps: true }
);
const Cart = models?.Cart || model<ICart>("Cart", CartSchema);
export default Cart;
