import Product from "@/models/Product";
import User from "@/models/User";
import { connectToDataBase } from "@/utill/connectDB";

export const getProductForEdit = async (id: string) => {
  await connectToDataBase();
  const product = await Product.findOne({ pid: id }).select("-_id -createdAt -updatedAt");
  return product;
};

export const updateShopDisplayName = async (uid: string, sellerShopDisplayName: string) => {
  await connectToDataBase();
  try {
    const existingShopDisplayName = await User.findOne({ sellerShopDisplayName }).select("sellerShopDisplayName");

    if (existingShopDisplayName) {
      throw new Error("Shop name already exists");
    }

    await User.updateOne({ uid }, { $set: { sellerShopDisplayName } });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateAddress = async (uid: string, updateAddress: any) => {
  await connectToDataBase();
  try {
    await User.updateOne({ uid }, { $set: { sellerAddress: updateAddress } });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateBankAccountDetails = async (uid: string, bankAccountDetails: any) => {
  await connectToDataBase();
  try {
    await User.updateOne({ uid }, { $set: { sellerBankAccountDetails: bankAccountDetails } });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updatePinedLink = async (uid: string, pinedLink: { url: string; name: string }[]) => {
  await connectToDataBase();
  try {
    await User.updateOne({ uid }, { $set: { pinedLink } });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
