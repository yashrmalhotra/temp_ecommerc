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

export const getProductResult = async (query: string, pageNumber: number, filters: any) => {
  await connectToDataBase();

  const searchQuery = query.toLowerCase();
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

    const pipeline: any = [
      { $match: searchCondition },
      {
        $addFields: {
          orderedMatchScore: {
            $size: {
              $filter: {
                input: { $ifNull: ["$orderedKeywords", []] },
                as: "kw",
                cond: { $eq: [{ $toLower: "$$kw" }, searchQuery] },
              },
            }, // count keywords matched
          },
          clickedMatchScore: {
            $size: {
              $filter: {
                input: { $ifNull: ["$clickedKeywords", []] },
                as: "kw",
                cond: { $eq: [{ $toLower: "$$kw" }, searchQuery] },
              },
            },
          },

          discountPercentage: {
            $cond: {
              if: { $gt: ["$offer.mrp", 0] },
              then: {
                $round: [{ $multiply: [{ $divide: [{ $subtract: ["$offer.mrp", "$offer.price"] }, "$offer.mrp"] }, 100] }, 0],
              },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          totalScore: {
            $add: [
              { $multiply: ["$orderedMatchScore", 5] },
              { $multiply: ["$clickedMatchScore", 5] },
              { $multiply: [{ $ifNull: ["$views", 0] }, 0.5] },
              { $multiply: [{ $ifNull: ["$performance.ratings", 0] }, 2] },
            ],
          },
        },
      },
    ];

    const additionalMatch: Record<string, any> = {};

    if (filters.brand.length > 0) {
      additionalMatch["basicInfo.brandName"] = { $in: filters.brand };
    }
    if (filters.discount) {
      additionalMatch["discountPercentage"] = { $gte: filters.discount };
    }
    if (filters.price[0] !== null && filters.price[1] !== null) {
      additionalMatch["offer.price"] = { $gte: filters.price[0], $lte: filters.price[1] };
    }
    if (Object.keys(additionalMatch).length > 0) {
      pipeline.push({ $match: additionalMatch });
    }
    switch (filters.sortBy) {
      case "RELEVANT":
        pipeline.push({ $sort: { totalScore: -1 as const } });
        break;
      case "PLTH":
        pipeline.push({ $sort: { "offer.price": 1 } });
        break;
      case "PHTL":
        pipeline.push({ $sort: { "offer.price": -1 } });
        break;
      case "DHTL":
        pipeline.push({ $sort: { discountPercentage: -1 } });
        break;
      case "NEWARV":
        pipeline.push({ $sort: { createdAt: -1 } });
        break;
    }
    pipeline.push({
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
              discountPercentage: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
        priceRange: [
          {
            $group: {
              _id: null,
              minPrice: { $min: "$offer.price" },
              maxPrice: { $max: "$offer.price" },
            },
          },
        ],
      },
    });

    const result = await Product.aggregate(pipeline);

    const products = result[0].products;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const minPrice = result[0].priceRange[0].minPrice;
    const maxPrice = result[0].priceRange[0].maxPrice;

    const brands = await Product.distinct("basicInfo.brandName", { subCategory: products[0].subCategory }, { collation: { locale: "en", strength: 1 } });
    return { products, brands, totalCount, range: [minPrice, maxPrice] };
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
    await client.sadd(`viewed-set:${viewedBy}`, ...pids);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const updateProductClicks = async (pid: string, clickedKeyword: string) => {
  await connectToDataBase();
  try {
    await Product.updateOne({ pid }, { $addToSet: { clickedKeywords: clickedKeyword }, $inc: { clickCount: 1 } });
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const syncViewsClick = async (uid: string) => {
  try {
    const viewsClick = await client.smembers(`viewed-set:${uid}`);

    await Product.updateMany({ pid: { $in: viewsClick } }, { $inc: { views: 1 } });

    await client.del(`viewed-set:${uid}`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
