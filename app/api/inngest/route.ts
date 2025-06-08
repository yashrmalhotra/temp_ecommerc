import { inngest } from "@/utill/inngest/inngest";
import { deleteItemToCartInDB, syncCartToDB, updateItemQtyInDB } from "@/utill/inngest/services/cart";
import { syncViewsToDB, syncClicksToDB } from "@/utill/inngest/services/track-views-clicks";
import { serve } from "inngest/next";
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncViewsToDB, syncClicksToDB, syncCartToDB, updateItemQtyInDB, deleteItemToCartInDB],
});
