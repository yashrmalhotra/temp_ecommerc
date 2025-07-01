import EventEmitter from "events";
import User from "@/models/User";
import { connectToDataBase } from "@/utill/connectDB";
export const sellerEvent = globalThis.sellerEvent ?? new EventEmitter();
if (!globalThis.sellerEvent) {
  globalThis.sellerEvent = sellerEvent;
}
sellerEvent.on("detailsUpdated", async (uid: string) => {
  await connectToDataBase();
  const user = await User.findOne({ uid }).select("sellerShopDisplayName sellerAccountStatus sellerAddress sellerBankAccountDetails");
  const hasDisplayName = !!user?.sellerShopDisplayName?.trim();
  const hasAddress = !!user?.sellerAddress?.address?.trim();
  const hasBankDetails = !!user?.sellerBankAccountDetails?.accountType?.trim();
  if (hasDisplayName && hasAddress && hasBankDetails) {
    user.sellerAccountStatus = "active";
    await user.save();
  }
});
