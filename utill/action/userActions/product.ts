import Product from "@/models/Products";
import { client, connectToDataBase } from "@/utill/connectDB";
import { stepLabelClasses } from "@mui/material";

export const getSuggestion = async (keyword: string) => {
  await connectToDataBase();
  const result = await Product.find({ keywords: { $elemMatch: { $regex: new RegExp(keyword, "i") } } }).select("keywords -_id");
  if (result) {
    const flatKeywords = new Set(result.flatMap((item) => item.keywords).filter((kw) => kw.toLowerCase().includes(keyword.toLowerCase()))); // use filter because of if any keywprdfiel has keyword that doen not match with user query so remove it
    const suggestions = Array.from(flatKeywords);
    return suggestions;
  }
};

export const getProductResult = async (query: string, pageNumber: number) => {
  await connectToDataBase();
  const skip = pageNumber * 10;
  try {
    const searchCondition = {
      $or: [
        { subCategory: { $regex: new RegExp(query, "i") } },
        { "basicInfo.title": { $regex: new RegExp(query, "i") } },
        { "basicInfo.sku": { $regex: new RegExp(query, "i") } },
        { "productDescription.description": { $regex: new RegExp(query, "i") } },
        { keywords: { $in: [new RegExp(query, "i")] } },
      ],
      createdByStatus: "active",
      status: "live",
    };

    const pipeline = [
      { $match: searchCondition },
      {
        $facet: {
          products: [
            { $skip: skip },
            { $limit: 10 },
            {
              $project: {
                basicInfo: 1,
                "offer.mrp": 1,
                "offer.price": 1,
                images: 1,
                subCategory: 1,
                pid: 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Product.aggregate(pipeline);

    const products = result[0].products;
    const totalCount = result[0].totalCount[0]?.count || 0;

    const brands = await Product.distinct("basicInfo.brandName", { subCategory: products[0].subCategory });

    return { products, brands, totalCount };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getProduct = async (pid: string) => {
  await connectToDataBase();
  const product = await Product.findOne({ pid }).select("-_id -keywords");

  return product;
};
export const updateProductViews = async (pids: string[], viewedBy: string) => {
  try {
    await client.sadd(`viewed-list:${viewedBy}`, ...pids);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
