import Product from "@/models/Product";
import { client, connectToDataBase } from "../../connectDB";
import { inngest } from "@/utill/inngest/inngest";
import Cart from "@/models/Cart";

export const addItemToCart = async (data: Record<string, any>) => {
  const { uid, pid } = data;
  try {
    const stock = await client.hget("stock", pid);

    if (stock && Number(stock) === 0) {
      throw new Error("Currently unavailable");
    } else {
      const product = await Product.findById(pid).select("offer.stock");
      await client.hset("stock", pid, product.offer.stock);
      await client.expire("stock", 300);

      if (product.offer.stock == 0) {
        throw new Error("Currently unavailable");
      }

      await client.hset(`cart:${uid}`, pid, 1);
      await inngest.send({
        name: "add-to-cart",
        data: {
          pid,
          uid,
        },
      });
    }
  } catch (error: any) {
    console.log("error", error.message);
    throw new Error(error.message);
  }
};

export const getCartItemId = async (uid: string) => {
  await connectToDataBase();

  try {
    const cachedIds = await client.hgetall(`cart:${uid}`);

    if (Object.keys(cachedIds).length > 0) {
      const result: Record<string, number> = {};
      for (const [key, value] of Object.entries(cachedIds)) {
        result[key] = Number(value);
      }
      return result;
    }
    const itemIds: { pid: string; qty: number }[] = await Cart.find({ uid });
    const flattened: string[] = [];
    const result: Record<string, number> = {};
    if (itemIds) {
      for (const { pid, qty } of itemIds) {
        flattened.push(pid, qty.toString());
        result[pid] = qty;
      }
      await client.hset(`cart:${uid}`, ...flattened);
      return result;
    }
    return {};
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getCartItem = async (uid: string) => {
  try {
    const items = await Cart.find({ uid }).populate({
      path: "pid",
      select: "basicInfo pid images offer status createdByStatus",
    });
    return items;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const updateCartItemQty = async (data: [string, string, number]) => {
  const [pid, uid, qty] = data;
  try {
    await client.hincrby(`cart:${uid}`, pid, qty);
    await inngest.send({
      name: "update-cart-qty",
      data: {
        data: [pid, uid, qty],
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteItemToCart = async (uid: string, pid: string) => {
  try {
    await client.hdel(`cart:${uid}`, pid);
    await inngest.send({
      name: "delete-cart-item",
      data: { uid, pid },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
