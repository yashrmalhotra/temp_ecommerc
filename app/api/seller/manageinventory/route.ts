import { getProduct, getProductByQuery } from "@/utill/action/sellerActions/product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  const uid = searchParams.get("uid");
  const rows = Number(searchParams.get("rows"));
  const page = Number(searchParams.get("page"));
  try {
    if (query) {
      const products = await getProductByQuery(query);
      return NextResponse.json({ success: true, products });
    }
    const products = await getProduct(uid as string, rows as number, page as number);
    return NextResponse.json({ success: true, products: products.data, totalProducts: products.totalProducts });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
