import { IRETURN } from "@/Types/type";
import { Schema, model, models } from "mongoose";

const ReturnSchema = new Schema<IRETURN>(
  {
    oid: String,
    pid: String,
    uid: String,
    soldBy: String,
    status: { type: String, enum: ["Created", "Return Approved", "Refunded"] },
  },
  { timestamps: true }
);

const Return = models?.Return || model("Return", ReturnSchema);
export default Return;
