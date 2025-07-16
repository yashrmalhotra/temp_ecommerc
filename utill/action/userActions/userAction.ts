"use server";
import { connectToDataBase } from "@/utill/connectDB";
import User from "@/models/User";
import { Address, UserDetails } from "@/Types/type";
import nodemailer from "nodemailer";
import { client } from "../../connectDB";
import { EventEmitter } from "stream";
import { getUserId } from "@/utill/utillityFunctions";
export const checkExistingUser = async (email: string, role?: string): Promise<void | string> => {
  await connectToDataBase();
  
  const user = await User.findOne({ email }).select("email role");

  if (user) {
    if (role === "buyer") {
      if (user.role.includes("buyer")) {
        throw new Error("User email already exists as a buyer");
      } else {
        user.role.push("buyer");
        await user.save();
        return "Buyer";
      }
    } else if (role === "seller") {
      if (user.role.includes("seller")) {
        throw new Error("User email already exists as a seller");
      } else {
        user.role.push("seller");
        await user.save();
        return "Seller";
      }
    }
  }
};
export const createUser = async (data: any): Promise<void> => {
  await connectToDataBase();
  try {
    await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      uid: getUserId(data.email),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const getUser = async (email: string): Promise<UserDetails> => {
  await connectToDataBase();
  const user = await User.findOne({ email }).select("-password -createdAt -updatedAt");

  return user;
};
const transPorter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS,
  },
});
const otpEmitter = new EventEmitter();

otpEmitter.on("otp:generated", async (email: string, OTP: number) => {
  

  const cooldown = await client.get(`cooldown:${email}`);
  if (!cooldown) {
    await transPorter.sendMail(
      {
        from: `Ecommerce ${process.env.EMAIL}`,
        to: email,
        subject: "Verification Email ",
        html: `
  <p style="font-size:15px; color:black;">OTP for verfication is <span style="font-weight:1000;">${OTP} will expires in 30 minutes</span></p>
  `,
      },
      async (error: any, emailSuccess: any) => {
        if (error) {
          console.log(error);
        } else {
          await client.set(`cooldown:${email}`, `${email}`, "EX", 300);
          console.log(emailSuccess);
        }
      }
    );
  } else {
    console.log("please send mail after 5 min");
  }
});

export const sendOTPVerificationMail = async (email: string): Promise<void> => {
  const OTP = Math.floor(1000 + Math.random() * 9000);
  await client.set(`verify:${email}`, `${OTP}`, "EX", 1800);
  otpEmitter.emit("otp:generated", email, OTP);
};

export const verifyOTP = async (email: string, otp: string) => {
  await connectToDataBase();
  const storedOTP = await client.get(`verify:${email}`);

  if (!storedOTP || otp !== storedOTP) {
    throw new Error("Wrong otp or otp has been expired");
  }

  if (otp === storedOTP) {
    const user = await User.findOne({ email }).select("isVerified");
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }
    return true;
  }
};

export const addBuyerAddress = async (email: string, buyerAddress: Address) => {
  await connectToDataBase();
  try {
    const user = await User.findOne({ email });

    if (!user.buyerAddresses) {
      user.buyerAddresses = [];
    }

    const isAddressExist = user.buyerAddresses.some((val: Address) => val.address === buyerAddress.address);

    if (isAddressExist) {
      throw new Error("Address is already save");
    }
    if (user.buyerAddresses.length === 0) {
      buyerAddress = { ...buyerAddress, default: true };
    }

    user.buyerAddresses.push(buyerAddress);
    await user.save();
  } catch (error: any) {
    console.log("update address error", error);
    throw new Error(error.message || "Something went wrong!");
  }
};

export const updateBuyerAddress = async (email: string, buyerAddress: Address): Promise<void> => {
  await connectToDataBase();
  try {
    const user = await User.findOne({ email });
    const index = buyerAddress.index!;
    if (user.buyerAddresses[index].default && buyerAddress.default) {
      try {
        delete buyerAddress.index;
        user.buyerAddresses[index] = buyerAddress;

        await user.save();
      } catch (error: any) {
        throw new Error(error.message);
      }
    } else if (!user.buyerAddresses[index].default && buyerAddress.default) {
      try {
        const previousDefaultAddress = user.buyerAddresses[0];
        previousDefaultAddress.default = false;
        user.buyerAddresses[0] = buyerAddress;
        user.buyerAddresses[index] = previousDefaultAddress;
        console.log("fxn end", user.buyerAddresses);

        await user.save();
      } catch (error: any) {
        throw new Error(error.message);
      }
    } else {
      try {
        delete buyerAddress.index;
        user.buyerAddresses[index] = buyerAddress;

        await user.save();
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const deleteBuyerAddress = async (email: string, buyerAddress: Address): Promise<void> => {
  await connectToDataBase();
  const user = await User.findOne({ email });
  const index = buyerAddress.index!;
  try {
    if (index === 0) {
      user.buyerAddresses[index + 1].default = true;
      user.buyerAddresses.splice(0, 1);
      await user.save();
    } else {
      user.buyerAddresses.splice(index, 1);
      await user.save();
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
