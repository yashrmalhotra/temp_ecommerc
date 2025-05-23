import { IUSER } from "@/Types/type";
import mongoose, { model, Schema, models } from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new Schema<IUSER>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
    googleId: { type: String },
    role: [
      {
        type: "String",
        enum: ["buyer", "seller"],
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        quantity: Number,
      },
    ],
    buyerAddresses: [{ address: String, city: String, state: String, pincode: String, default: Boolean }],
    sellerShopDisplayName: { type: String, unique: true },
    sellerAddress: {
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    sellerAccountStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    sellerBankAccountDetails: {
      accountType: { type: String, enum: ["saving", "current"] },
      accountHolderName: {
        type: String,
      },
      accountNumber: {
        type: String,
      },
      ifsc: {
        type: String,
      },
    },
    pinedLink: [{ url: String, name: String }],
    uid: { type: String, unique: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } else {
    next();
  }
});

const User = models?.User || model<IUSER>("User", UserSchema);

export default User;
