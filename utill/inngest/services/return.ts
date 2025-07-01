import { connectToDataBase } from "@/utill/connectDB";
import { inngest } from "../inngest";
import Order from "@/models/Order";
import Return from "@/models/Return";
import { createRefund } from "@/utill/action/userActions/order";
export const createReturnInDB = inngest.createFunction({ id: "return-created" }, { event: "create-return-in-db" }, async ({ event }) => {
  await connectToDataBase();
  const { oid } = event.data;
  try {
    const order = await Order.findOne({ oid });

    const sevenDaysInMs = 7 * 1000 * 3600 * 24;
    const sevenDaysOlder = Date.now() - order.deliveredAt > sevenDaysInMs;
    console.log("7 days older", sevenDaysOlder);
    if (!sevenDaysOlder) {
      order.status = "Returned";
      await order.save();

      await Return.create({
        oid,
        pid: order.pid,
        uid: order.uid,
        soldBy: order.soldBy,
        status: "Created",
      });
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
});
export const cancelReturnInDB = inngest.createFunction({ id: "return-cancel" }, { event: "cancel-return-in-db" }, async ({ event }) => {
  await connectToDataBase();
  const { oid } = event.data;
  try {
    await Return.deleteOne({ oid });
    await Order.updateOne({ oid }, { $set: { status: "Delivered" } });
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
});
export const updateReturnStatusInDB = inngest.createFunction({ id: "return-status" }, { event: "update-return-in-db" }, async ({ event }) => {
  await connectToDataBase();
  const { oid } = event.data;
  console.log("oid return", oid);
  try {
    await Return.updateOne({ oid }, { $set: { status: "Return Approved" } });
    const order = await Order.findOneAndUpdate({ oid }, { $set: { status: "Return Approved" } });
    await createRefund(order.oid, order.paymentId, order.amount);
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
});
export const updateRefundStatusInDB = inngest.createFunction({ id: "refund-status" }, { event: "update-refund-in-db" }, async ({ event }) => {
  await connectToDataBase();
  const { oid } = event.data;
  try {
    await Return.updateOne({ oid }, { $set: { status: "Refunded" } });
    await Order.updateOne({ oid }, { $set: { status: "Refunded" } });
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
});
