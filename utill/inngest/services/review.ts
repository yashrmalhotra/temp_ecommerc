import Product from "@/models/Product";
import { inngest } from "../inngest";
import Review from "@/models/Review";

export const addReviewInDb = inngest.createFunction({ id: "add-review" }, { event: "add-review-in-db" }, async ({ event }) => {
  const { rating, review, uid, oid, pid, name } = event.data;
  try {
    await Product.updateOne({ pid }, { $set: { "performance.ratings": rating }, $inc: { "performance.numberOfRaters": 1 } });
    await Review.updateOne(
      {
        pid,
        oid,
        uid,
        name,
      },
      { $set: { review, rating } },
      { upsert: true }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
});
