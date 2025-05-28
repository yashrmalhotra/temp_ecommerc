import Product from "@/models/Products";
import { connectToDataBase } from "@/utill/connectDB";
import { getProductId } from "@/utill/utillityFunctions";
import ImageKit from "imagekit";
import { pipeline } from "stream";
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKITIO_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKITIO_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKITIO_URL_ENDPOINT as string,
});
export const addProduct = async (data: any): Promise<void> => {
  await connectToDataBase();
  const images = data.images.filter((item: string) => item !== undefined);

  try {
    const product = await Product.findOne({
      createdBy: data.uid,
      $or: [
        { "basicInfo.title": data.basicInfo.title, createdBy: data.createdBy },
        { "basicInfo.sku": data.basicInfo.sku, createdBy: data.createdBy },
      ],
    });
    if (product) {
      throw new Error(` SKU already exists and status of SKU is ${product.status}`);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }

  try {
    if ((data.offer.price === 0 || data.offer.mrp === 0) && data.status === "submit") {
      data.status = "inactive";
    } else if (data.offer.stock === 0 && data.status === "submit") {
      data.status = "out of stock";
    } else if (data.status === "submit") {
      data.status = "live";
    }
    data.pid = getProductId(data.category, data.subCategory);

    const uploadedImages = await Promise.all(
      images.map(async (image: File) => {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const url = await imageKit.upload({
          file: buffer,
          fileName: `${data.createdBy}-${image.name}`,
        });
        return { url: url.url, fileID: url.fileId };
      })
    );

    data.images = uploadedImages;
    await Product.create(data);
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong by db");
  }
};

export const getProduct = async (uid: string, rows: number, page: number, filterStatus: string, sort: string, query: string) => {
  const filter: { createdBy: string; status?: string; $or?: any } = { createdBy: uid };
  if (query) {
    filter.$or = [{ "basicInfo.title": { $regex: new RegExp(query, "i") } }, { "basicInfo.sku": { $regex: new RegExp(query, "i") } }];
  }
  if (filterStatus && filterStatus != "all") {
    filter.status = filterStatus;
  }

  console.log("filter", query);

  await connectToDataBase();
  console.log(uid, filter);
  const skip = rows * page;
  const limit = rows;

  let sortStage: any = { createdAt: -1 };

  switch (sort) {
    case "SLTH":
      sortStage = { "offer.stock": 1 };
      break;
    case "SHTL":
      sortStage = { "offer.stock": -1 };
      break;
    case "PLTH":
      sortStage = { "offer.price": 1 };
      break;
    case "PHTL":
      sortStage = { "offer.price": -1 };
      break;
    case "newestFirst":
      sortStage = { createdAt: -1 };
      break;
    case "oldestFirst":
      sortStage = { createdAt: 1 };
      break;
    default:
      sortStage = { createdAt: -1 };
      break;
  }

  try {
    const pipeline = await Product.aggregate([
      { $match: filter },
      { $sort: sortStage },
      {
        $facet: {
          products: [{ $skip: skip }, { $limit: limit }],
          totalProduct: [{ $count: "count" }],
        },
      },
    ]);

    return { data: pipeline[0].products, totalProducts: pipeline[0].totalProduct[0].count };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
// export const getProductByQuery = async (query: string) => {
//   await connectToDataBase();
//   try {
//     const products = await Product.find();

//     return products;
//   } catch (error: any) {
//     console.log(error);
//     throw new Error(error.message);
//   }
// };
export const editProduct = async (data: any) => {
  await connectToDataBase();
  console.log(data, "data");
  console.log("data", data.images);
  if ((data.offer.price === 0 || data.offer.mrp === 0) && data.status === "submit") {
    data.status = "inactive";
  } else if (data.offer.stock === 0 && data.status === "submit") {
    data.status = "out of stock";
  } else if (data.status === "submit") {
    data.status = "live";
  }
  try {
    const images = data.images.filter((item: string) => item !== undefined);
    const product = await Product.findOne({ pid: data.pid });
    const imageURLs = images.map((item: { name: string }) => item.name);
    const getFileIdsToDeleteFromIK = product.images
      .filter((item: { url: string }) => !imageURLs.some((imgURL: string) => imgURL === item.url))
      .map((file: { fileID: string }) => file.fileID);
    const newFiles = images.filter((item: { name: string }) => !item.name.includes("https:"));
    const newOrderOfImageURLs = imageURLs.map((url: string) => product.images.find((img: { url: string }) => img.url === url));

    if (getFileIdsToDeleteFromIK.length > 0) {
      await imageKit.bulkDeleteFiles(getFileIdsToDeleteFromIK);
    } else {
      delete data["images"];
    }
    if (newFiles.length > 0) {
      const uploadedImages = await Promise.all(
        newFiles.map(async (img: File) => {
          const file = await img.arrayBuffer();
          const buffer = Buffer.from(file);
          const imgUpload = await imageKit.upload({
            file: buffer,
            fileName: `${data.createdBy}-${img.name}`,
          });
          return { url: imgUpload.url, fileID: imgUpload.fileId };
        })
      );
      data.images = [...newOrderOfImageURLs, ...uploadedImages];
    } else {
      data.images = newOrderOfImageURLs;
    }
    await Product.updateOne({ pid: data.pid }, { $set: data });
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
export const deleteProduct = async (pid: string) => {
  await connectToDataBase();
  try {
    const product = await Product.findOneAndDelete({ pid });

    const fileIds = product.images.map((item: { fileID: string }) => item.fileID);

    await imageKit.bulkDeleteFiles(fileIds);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getDraftProduct = async (createdBy: string) => {
  await connectToDataBase();
  try {
    const products = await Product.find({ createdBy, status: "draft" }).select("basicInfo.title offer.price pid");
    return products;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
