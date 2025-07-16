import Product from "@/models/Product";
import { client, connectToDataBase } from "@/utill/connectDB";
import { inngest } from "@/utill/inngest/inngest";

export const getTrendingProducts = async () => {
  await connectToDataBase();
  try {
    const products = await Product.find({}).sort({ "performance.sales": -1 }).limit(5).select("basicInfo pid offer images performance.ratings");
    return products;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
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

          productAge: {
            $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24],
          },

          recencyScore: {
            $cond: [
              {
                $lte: [
                  {
                    $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24],
                  },
                  15,
                ],
              },
              1,
              0,
            ],
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

          ratings: { $ifNull: [{ $divide: ["$performance.ratings", "$performance.numberOfRaters"] }, 0] },
        },
      },

      {
        $addFields: {
          totalScore: {
            $add: [
              { $multiply: ["$orderedMatchScore", 5] },
              { $multiply: ["$clickedMatchScore", 5] },
              { $multiply: [{ $ifNull: ["$views", 0] }, 0.5] },
              { $multiply: ["$ratings", 2] },
              { $multiply: ["$recencyScore", 5] },
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
              ratings: 1,
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
    const minPrice = result[0].priceRange[0]?.minPrice;
    const maxPrice = result[0].priceRange[0]?.maxPrice;

    let brands: string[] = [];
    if (products.length > 0) {
      brands = await Product.distinct("basicInfo.brandName", { subCategory: products[0].subCategory }, { collation: { locale: "en", strength: 1 } });
    }
    return { products, brands, totalCount, range: [minPrice, maxPrice] };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getProduct = async (pid: string) => {
  await connectToDataBase();
  const product = await Product.aggregate([
    { $match: { pid } },
    {
      $lookup: {
        from: "reviews",
        localField: "pid",
        foreignField: "pid",
        as: "reviews",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "uid",
        as: "seller",
      },
    },
    { $unwind: "$seller" },
    {
      $project: {
        pid: 1,
        createdBy: 1,
        basicInfo: 1,
        productDescription: 1,
        offer: 1,
        "dimensions.productDimensions": 1,
        createdByStatus: 1,
        status: 1,
        images: 1,
        performance: 1,
        "reviews.name": 1,
        "reviews.rating": 1,
        "reviews.review": 1,
        "seller.sellerShopDisplayName": 1,
      },
    },
  ]);

  return { productDetails: product[0] };
};
export const updateProductViews = async (pids: string[], viewedBy: string) => {
  try {
    const key = `viewed-set:${viewedBy}`;
    const isAdded = await client.sadd(key, ...pids);
    if (isAdded === 0) {
      
      return;
    }
  
    await client.expire(key, 3600);
    await inngest.send({
      name: "product-viewed",
      data: {
        pids,
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const updateProductClicks = async (pid: string, clickedBy: string, clickedKeyword: string) => {
  const key = `clicked-set:${clickedBy}`;
  const isAdded = await client.sadd(key, pid);

  try {
    if (isAdded === 0) {
      
      return;
    }
    

    client.expire(key, 3600);
    await inngest.send({
      name: "product-clicked",
      data: {
        pid,
        clickedKeyword,
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
