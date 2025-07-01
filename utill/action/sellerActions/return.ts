import Return from "@/models/Return";
const sortValues: Record<string, any> = {
  "Return date: Newest first": { createdAt: -1 },
  "Return date: Oldest first": { createdAt: 1 },
};
export const getReturn = async (uid: string, rows: number, page: number, query?: string, status?: string, sort?: string) => {
  const skip = page * rows;
  const limit = rows;
  const condition: { $or?: any; soldBy: string; status?: string } = { soldBy: uid };
  const facet: { returns?: Record<string, any>[]; totalReturns: Record<string, any>[] } = {
    totalReturns: [{ $count: "count" }],
  };
  const returnStage: any = [{ $skip: skip }, { $limit: limit }];

  // if (sort) {
  //   returnStage.push(sortValues[sort]);
  // }
  if (query) {
    condition.$or = [
      { pid: { $regex: new RegExp(query, "i") } },
      { oid: { $regex: new RegExp(query, "i") } },
      { "product.basicInfo.title": { $regex: new RegExp(query, "i") } },
      { "product.basicInfo.sku": { $regex: new RegExp(query, "i") } },
    ];
    facet.returns = [];
  } else {
    if (status) {
      condition.status = status;
    }

    facet.returns = returnStage;
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
    { $unwind: "$product" },
    { $match: condition },
    {
      $project: {
        oid: 1,
        pid: 1,
        status: 1,
        "product.basicInfo": 1,
        "product.images": 1,

        createdAt: 1,
      },
    },

    {
      $facet: facet,
    },
  ];
  try {
    const results = await Return.aggregate(pipeline);

    const returns = results[0].returns ?? [];
    const totalReturns = results[0].totalReturns[0].count ?? 0;

    return { returns, totalReturns };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
