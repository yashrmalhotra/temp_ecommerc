import Product from "@/models/Product";
import { inngest } from "../inngest";
import { connectToDataBase } from "@/utill/connectDB";

export const syncViewsToDB = inngest.createFunction({ id: "track-views" }, { event: "product-viewed" }, async ({ event }) => {
  const { pids } = event.data;

  try {
    await connectToDataBase();
    await Product.updateMany({ pid: { $in: pids } }, { $inc: { views: 1 } });
    return { success: true };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
});

export const syncClicksToDB = inngest.createFunction({ id: "track-clicked" }, { event: "product-clicked" }, async ({ event }) => {
  const { pid, clickedKeyword } = event.data;
  try {
    await connectToDataBase();

    await Product.updateMany({ pid }, { $addToSet: { clickedKeywords: clickedKeyword }, $inc: { clickCount: 1 } });
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
});
