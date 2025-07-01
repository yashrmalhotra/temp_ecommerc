import Order from "@/models/Order";
import { connectToDataBase } from "@/utill/connectDB";

const filterValues: Record<string, any> = {
  "Multi Quantity": { qty: { $gt: 1 } },
};

const sortValues: Record<string, any> = {
  "Order date: Newest first": { createdAt: -1 },
  "Order date: Oldest first": { createdAt: 1 },
  "Ship by date: Ascending": { shipByDate: 1 },
  "Ship by date: Descending": { shipByDate: -1 },
  "Price: Ascending": { amount: 1 },
  "Price: Descending": { amount: -1 },
  "Quantity: Ascending": { qty: 1 },
  "Quantity: Descending": { qty: -1 },
};

export const getOrder = async (sellerId: string, query: string | null, rows: number, page: number, status: string, filter: string | null, sort: string | null) => {
  await connectToDataBase();

  const skip = page * rows;
  const limit = rows;

  const orderStage: any[] = [];

  // Apply sort if available
  if (sort && sortValues[sort]) {
    orderStage.push({ $sort: sortValues[sort] });
  }

  const facet: {
    orders?: Record<string, any>[];
    totalOrders: Record<string, any>[];
  } = {
    totalOrders: [{ $count: "count" }],
  };

  const condition: {
    soldBy: string;
    $or?: any[];
    status?: any;
    [key: string]: any;
  } = { soldBy: sellerId };

  if (query) {
    condition.$or = [
      { pid: { $regex: new RegExp(query, "i") } },
      { oid: { $regex: new RegExp(query, "i") } },
      { "product.basicInfo.title": { $regex: new RegExp(query, "i") } },
      { "product.basicInfo.sku": { $regex: new RegExp(query, "i") } },
    ];

    facet.orders = orderStage;
  } else {
    if (status === "Send") {
      condition.status = { $nin: ["Pending", "Ordered"] };
    } else {
      condition.status = status;
    }
    orderStage.push({ $skip: skip }, { $limit: limit });

    if (filter && filterValues[filter]) {
      Object.assign(condition, filterValues[filter]);
    }

    facet.orders = orderStage;
  }

  const pipeline: any[] = [
    {
      $lookup: {
        from: "products",
        localField: "pid",
        foreignField: "pid",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $match: condition,
    },
    {
      $project: {
        oid: 1,
        pid: 1,
        soldBy: 1,
        amount: 1,
        qty: 1,
        status: 1,
        "product.basicInfo": 1,
        "product.images": 1,
        shipByDate: 1,
        createdAt: 1,
      },
    },
    {
      $facet: facet,
    },
  ];

  try {
    const results = await Order.aggregate(pipeline);

    const orders = results[0].orders ?? [];
    const totalOrders = results[0].totalOrders?.[0]?.count ?? 0;

    return { orders, totalOrders };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getOrderById = async (oid: string) => {
  try {
    const order = await Order.aggregate([
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
          from: "users",
          localField: "uid",
          foreignField: "uid",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $unwind: "$product" },

      {
        $project: {
          qty: 1,
          amount: 1,
          orderedByAddress: 1,
          "user.name": 1,
          "user.email": 1,
          "product.basicInfo.title": 1,
          "product.basicInfo.sku": 1,
          "product.images": 1,
          "product.dimensions.packageDimensions": 1,
        },
      },
    ]);
    return order[0];
  } catch (error: any) {
    console.log("error", error);
    throw new Error(error.message);
  }
};
