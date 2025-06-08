import Product from "@/models/Product";
import { connectToDataBase } from "@/utill/connectDB";

export const getOrder = async (to: string, query: string | null, rows: number, page: number) => {
  await connectToDataBase();
  const skip = page * rows;
  const limit = rows;
  const orderStage = [{ $skip: skip }, { $limit: limit }];
  const facet: { orders?: Record<string, any>[]; totalOrders: Record<string, any>[] } = {
    totalOrders: [{ $count: "count" }],
  };
  const condition: { createdBy: string; $or?: any[] } = { createdBy: to };
  if (query !== "") {
    condition.$or = [{ "basicInfo.title": { $regex: new RegExp(query, "i") } }, { "basicInfo.sku": { $regex: new RegExp(query, "i") } }];
    facet.orders = [];
  } else {
    console.log("are you running");
    facet.orders = orderStage;
  }

  const pipeline: any = [
    { $match: condition },
    {
      $facet: facet,
    },
  ];

  try {
    const results = await Product.aggregate(pipeline);

    const orders = results[0].orders;
    const totalOrders = results[0].totalOrders[0].count;

    return { orders, totalOrders };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
