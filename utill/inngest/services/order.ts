import { client, connectToDataBase } from "@/utill/connectDB";
import { inngest } from "../inngest";
import mongoose from "mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getGroupOrderId, getOrderId } from "@/utill/utillityFunctions";
import { sellerEvent } from "@/utill/action/sellerActions/sellerEvents";
import { createRefund } from "@/utill/action/userActions/order";
import ReadOnlyOrders from "@/app/components/seller/manage-order/ReadOnlyOrder";
export const addOrderToDB = inngest.createFunction(
  {
    id: "add-order",
  },
  { event: "add-order-to-db" },
  async ({ event, step }) => {
    await connectToDataBase();
    const { pid, uid, soldBy, orderedByAddress, qty, kw, paymentId, paymentSession } = event.data;
    await step.run("Create order transaction", async () => {
      const session = await mongoose.startSession();
      try {
        session.startTransaction();
        const product = await Product.findOne({ pid }).select("offer.stock offer.price").session(session);
        if (product.offer.stock < qty) {
          console.log("insufficient stock");
          session.abortTransaction();
          return { "out of stock": true, uid };
        }
        product.offer.stock -= qty;
        if (product.orderedOnKeywords) {
          product.orderedOnKeywords.push(kw);
        } else {
          product.orderedOnKeywords = [kw];
        }
        await product.save({ session });

        const oid = getOrderId(soldBy, uid);
        await client.set(`orderpay:${oid}`, paymentSession);
        await Order.create({
          oid,
          pid,
          uid,
          paymentId,
          paymentSession,
          soldBy,
          orderedByAddress,
          status: "Pending",
          qty,
          amount: product.offer.price * qty,
        });
        await session.commitTransaction();

        return { success: true };
      } catch (error: any) {
        await session.abortTransaction();
        console.log(error);
        throw new Error(error.message);
      } finally {
        session.endSession();
      }
    });
  }
);

export const deleteCancelOrderInDB = inngest.createFunction({ id: "dalete-cancel-order" }, { event: "cancel-order" }, async ({ event }) => {
  const { oid } = event.data;
  await connectToDataBase();
  try {
    const order = await Order.findOneAndDelete({ oid });
    if (order.status === "Ordered") {
      await createRefund(order.oid, order.paymentId, order.amount);
    }
    await Product.updateOne({ pid: order.pid }, { $inc: { "offer.stock": order.qty } });
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
});

export const paymemtConfirmInDB = inngest.createFunction({ id: "payment-confirm" }, { event: "payment-confirm-in-db" }, async ({ event }) => {
  const { paymentId } = event.data;
  await connectToDataBase();

  try {
    const todayDate = new Date();
    const shipByDate = new Date(todayDate.getTime() + 1 * 24 * 3600 * 1000);
    const orders = await Order.find({ paymentId });
    for (const item of orders) {
      item.status = "Ordered";
      item.shipByDate = shipByDate;
      await Product.updateOne({ pid: item.pid }, { $inc: { "performance.sales": item.amount, "performance.unit_sold": item.qty } });
      await client.publish("order-created", JSON.stringify({ sellerId: item.soldBy, oid: item.oid }));
      if (item.paymentSession) {
        delete item.paymentSession;
      }
      await item.save();
    }
  } catch (error: any) {
    console.log("error", error);
    throw new Error(error.message);
  }
});
export const updateOrderStatusInDB = inngest.createFunction({ id: "update-status" }, { event: "update-order-status-in-db" }, async ({ event, step }) => {
  const { oids } = event.data;
  await connectToDataBase();
  await step.run("Status Shipped", async () => {
    console.log("oid status sleep shipped", oids);
    try {
      await Order.updateMany({ oid: { $in: oids } }, { $set: { status: "Shipped" } });
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error.message);
    }
  });

  await step.sleep("deliver order test", "1m");
  await step.run("Status Delivered", async () => {
    try {
      await Order.updateMany({ oid: { $in: oids } }, { $set: { status: "Delivered", deliveredAt: new Date() } });
    } catch (error: any) {
      console.log("error", error);
      throw new Error(error.message);
    }
  });
});

export const createOrderWithCart = inngest.createFunction(
  {
    id: "create-order-with-cart",
  },
  {
    event: "add-cart-order-in-db",
  },
  async ({ event }) => {
    const { orderData, uid, orderedByAddress, paymentSession, paymentId } = event.data;
    await connectToDataBase();
    const groupOrderId = getGroupOrderId(uid);
    try {
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        for (const item of orderData) {
          const product = await Product.findOne({ pid: item.pid }).session(session);
          if (product.offer.stock < orderData.qty) {
            continue;
          }
          product.offer.stock -= item.qty;
          await product.save({ session });
          const oid = getOrderId(product.createdBy, uid);
          await Order.create({
            oid,
            uid,
            pid: product.pid,
            groupOrderId,
            paymentId,
            orderedByAddress,
            paymentSession,
            soldBy: product.createdBy,
            qty: item.qty,
            amount: item.qty * product.offer.price,
            status: "Pending",
          });
        }
      });
    } catch (error) {
      console.log("error", error);
      throw new Error("error");
    }
  }
);

export const deleteMultiDropPaymentOrderInDb = inngest.createFunction({ id: "delete-multi-order" }, { event: "delete-multi-order-drop-payment" }, async ({ event }) => {
  const { paymentId } = event.data;
  try {
    const orders = await Order.find({ paymentId });
    if (orders.length > 1) {
      await Order.deleteMany({ paymentId });
    }
  } catch (error) {
    console.log("error", error);
    throw new Error("error");
  }
});
