import Order from "@/models/Order";
import Product from "@/models/Product";

import { connectToDataBase } from "@/utill/connectDB";
import { inngest } from "@/utill/inngest/inngest";
import { Cashfree, CFEnvironment } from "cashfree-pg";

import { client } from "../../connectDB";
export const getOrder = async (uid: string) => {
  await connectToDataBase();
  const orders = await Order.aggregate([
    { $match: { uid } },
    {
      $lookup: {
        from: "products",
        localField: "pid",
        foreignField: "pid",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        oid: 1,
        qty: 1,
        amount: 1,
        "product.basicInfo.title": 1,
        "product.images": 1,
        "product.pid": 1,
        createdAt: 1,
        status: 1,
      },
    },
  ]);

  return orders;
};

export const getOrderById = async (oid: string) => {
  await connectToDataBase();
  try {
    const order = await await Order.aggregate([
      { $match: { oid } },
      {
        $lookup: {
          from: "products",
          localField: "pid",
          foreignField: "pid",
          as: "product",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "oid",
          foreignField: "oid",
          as: "review",
        },
      },
      { $unwind: "$product" },
      { $unwind: { path: "$review", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          qty: 1,
          amount: 1,
          "product.basicInfo.title": 1,
          "product.images": 1,
          "product.pid": 1,
          createdAt: 1,
          deliveredAt: 1,
          status: 1,
          oid: 1,
          pid: 1,
          "review.name": 1,
          "review.rating": 1,
          "review.review": 1,
        },
      },
    ]);

    return { order: order[0] };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
const cashFree = new Cashfree(CFEnvironment.SANDBOX, process.env.CASHFREE_APP_ID, process.env.CASHFREE_APP_SECRET);

const getPaymentSession = async (order_amount: number, customer_id: string, customer_name: string, customer_email: string) => {
  const request = {
    order_amount,
    order_currency: "INR",
    customer_details: {
      customer_id,
      customer_name,
      customer_email,
      customer_phone: "+91999999991",
    },
    order_meta: {
      return_url: `https://greatmart.vercel.app/order`,
    },
    order_note: "Test order",
  };
  try {
    const { data } = await cashFree.PGCreateOrder(request);

    return { session: data.payment_session_id, paymentId: data.order_id };
  } catch (error: any) {
    console.log("error from payment", error);
    throw new Error(error.message);
  }
};
export const processOrder = async (
  pid: string,
  uid: string,
  customer_name: string,
  customer_email: string,
  soldBy: string,
  address: Record<string, any>,
  kw: string,
  qty: number
) => {
  await connectToDataBase();
  console.log("customer email", customer_email);
  const product = await Product.findOne({ pid }).select("offer.stock offer.price createdBy");
  if (product.offer.stock < Number(qty)) {
    throw new Error("Low stock");
  }

  try {
    const { session, paymentId } = await getPaymentSession(product.offer.price * qty, uid, customer_name, customer_email);
    await inngest.send({
      name: "add-order-to-db",
      data: { pid, uid, soldBy, orderedByAddress: address, kw, qty, amount: product.offer.price * qty, status: "Pending", paymentId, paymentSession: session },
    });

    return session;
  } catch (error: any) {
    console.log("error", error.message);
  }
};

export const processBulkOrder = async (data: Record<string, any>) => {
  try {
    const { session, paymentId } = await getPaymentSession(data.total, data.uid, data.customer_name, data.customer_email);
    await inngest.send({ name: "add-cart-order-in-db", data: { orderData: data.orderData, uid: data.uid, orderedByAddress: data.address, paymentId } });

    return session;
  } catch (error: any) {
    console.log("errr", error);
    throw new Error(error.message);
  }
};

export const cancelOrder = async (oid: string) => {
  try {
    await inngest.send({ name: "cancel-order", data: { oid } });
  } catch (error: any) {
    console.log("error", error.message);
  }
};

export const retryPayment = async (oid: string) => {
  try {
    const session = await client.get(`orderpay:${oid}`);
    if (session) {
      return session;
    }
    const order = await Order.findOne({ oid }).select("paymentSession");
    return order.paymentSession;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createRefund = async (orderId: string, paymentId: string, amount: number) => {
  const request = {
    refund_id: orderId,
    refund_amount: amount,
  };
  try {
    await cashFree.PGOrderCreateRefund(paymentId, request);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
