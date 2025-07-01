import { inngest } from "@/utill/inngest/inngest";
import { deleteItemToCartInDB, syncCartToDB, updateItemQtyInDB } from "@/utill/inngest/services/cart";
import {
  addOrderToDB,
  createOrderWithCart,
  deleteCancelOrderInDB,
  deleteMultiDropPaymentOrderInDb,
  paymemtConfirmInDB,
  updateOrderStatusInDB,
} from "@/utill/inngest/services/order";
import { cancelReturnInDB, createReturnInDB, updateRefundStatusInDB, updateReturnStatusInDB } from "@/utill/inngest/services/return";
import { addReviewInDb } from "@/utill/inngest/services/review";
import { syncViewsToDB, syncClicksToDB } from "@/utill/inngest/services/track-views-clicks";
import { serve } from "inngest/next";
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncViewsToDB,
    syncClicksToDB,
    syncCartToDB,
    updateItemQtyInDB,
    deleteItemToCartInDB,

    addOrderToDB,
    addReviewInDb,
    deleteCancelOrderInDB,
    createOrderWithCart,
    paymemtConfirmInDB,
    updateOrderStatusInDB,
    createReturnInDB,
    cancelReturnInDB,
    updateReturnStatusInDB,
    updateRefundStatusInDB,
    deleteMultiDropPaymentOrderInDb,
  ],
});
