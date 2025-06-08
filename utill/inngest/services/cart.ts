import Cart from "@/models/Cart";
import { inngest } from "../inngest";
import { connectToDataBase } from "@/utill/connectDB";

export const syncCartToDB = inngest.createFunction(
  {
    id: "add-cart",
  },
  { event: "add-to-cart" },
  async ({ event }) => {
    await connectToDataBase();
    const { pid, uid } = event.data;

    try {
      await Cart.create({ pid, uid, qty: 1 });
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const updateItemQtyInDB = inngest.createFunction(
  {
    id: "update-qty",
  },
  { event: "update-cart-qty" },
  async ({ event }) => {
    await connectToDataBase();
    const { data } = event.data;
    const [pid, uid, qty] = data;

    try {
      await Cart.updateOne({ pid, uid }, { $inc: { qty } });
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const deleteItemToCartInDB = inngest.createFunction(
  {
    id: "delete-cart",
  },
  { event: "delete-cart-item" },
  async ({ event }) => {
    const { uid, pid } = event.data;
    console.log("data", pid, uid);
    try {
      await Cart.deleteOne({ pid, uid });
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);
