import Product from "@/models/Product";

export const getOrder = async (createdBy: string) => {
  const orders = await Product.find({ createdBy }).select("basicInfo.title offer images").limit(5);

  return orders;
};

export const getOrderById = async (id: string) => {
  try {
    const order = await Product.findOne({ "basicInfo.brandName": id });
    return order;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
