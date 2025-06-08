import Product from "@/models/Product";

const getReturn = async (uid: string) => {
  const skip = 0;
  const limit = 10;
  const returnProdtuct = await Product.find({ createdBy: uid });
};
