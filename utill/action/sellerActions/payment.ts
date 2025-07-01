import Product from "@/models/Product";

export const getPayments = async (uid: string, query: string | null, rows: number, page: number) => {
  const skip = page * rows;
  const limit = rows;
  const condition: { $or?: any; createdBy: string } = {
    createdBy: uid,
  };
  const facet: { payments?: Record<string, any>[]; totalPayments: Record<string, any>[] } = {
    totalPayments: [{ $count: "count" }],
  };
  if (query) {
    condition.$or = [{ "basicInfo.title": new RegExp(query, "i") }];
    facet.payments = [];
  } else {
    facet.payments = [{ $skip: skip }, { $limit: limit }];
  }
  const pipeline: any[] = [{ $match: condition }, { $facet: facet }];
  try {
    const results = await Product.aggregate(pipeline);
    const payments = results[0].payments;
    const totalPayments = results[0].totalPayments[0].count;
    return { payments, totalPayments };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
