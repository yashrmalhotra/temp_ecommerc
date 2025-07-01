import { inngest } from "@/utill/inngest/inngest";
import { Cashfree, CFEnvironment } from "cashfree-pg";
const cashFree = new Cashfree(CFEnvironment.SANDBOX, process.env.CASHFREE_APP_ID, process.env.CASHFREE_APP_SECRET);

export const cashfreeVerify = async (signature: any, rawBody: any, timeStamp: any) => {
  const isVerified = cashFree.PGVerifyWebhookSignature(signature, rawBody, timeStamp);
  const webhookData = JSON.parse(rawBody);
  if (!isVerified) {
    console.log("Signature is not valid");
    throw new Error("Signature is not valid");
  }
  if (webhookData.type === "PAYMENT_SUCCESS_WEBHOOK") {
    try {
      await inngest.send({ name: "payment-confirm-in-db", data: { paymentId: webhookData.data.order.order_id } });
    } catch (error: any) {
      console.log("error from cashfreefxn check pay", error);
      throw new Error(error.message);
    }
  }
  if (webhookData.type === "REFUND_STATUS_WEBHOOK") {
    try {
      await inngest.send({ name: "update-refund-in-db", data: { oid: webhookData.data.refund.refund_id } });
    } catch (error: any) {
      console.log("error from cashfreefxn check refund", error);
      throw new Error(error.message);
    }
  }
};
export const cashfreeVerifyForCart = async (signature: any, rawBody: any, timeStamp: any) => {
  const isVerified = cashFree.PGVerifyWebhookSignature(signature, rawBody, timeStamp);
  const webhookData = JSON.parse(rawBody);
  if (!isVerified) {
    console.log("Signature is not valid");
    throw new Error("Signature is not valid");
  }
  if (webhookData.type === "PAYMENT_SUCCESS_WEBHOOK") {
    try {
      await inngest.send({ name: "cart-payment-confirm-in-db", data: { paymentId: webhookData.data.order.order_id } });
    } catch (error: any) {
      console.log("error from cashfreefxn check pay", error);
      throw new Error(error.message);
    }
  }
};
