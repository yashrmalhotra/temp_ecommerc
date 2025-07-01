import { IORDER } from "@/Types/type";
import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema<IORDER>(
  {
    oid: String,
    pid: String,
    uid: String,
    groupOrderId: String,
    paymentId: String,
    paymentSession: String,
    orderedBy: String,
    soldBy: String,
    orderedByAddress: { address: String, city: String, state: String, pincode: String },
    status: { type: String, enum: ["Pending", "Ordered", "Shipped", "Delivered", "Returned", "Return Approved", "Refunded"] },
    qty: Number,
    amount: Number,
    shipByDate: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

const Order = models?.Order || model("Order", OrderSchema);
export default Order;
