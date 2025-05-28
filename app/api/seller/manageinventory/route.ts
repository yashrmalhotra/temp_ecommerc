import { getProduct } from "@/utill/action/sellerActions/product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  const uid = searchParams.get("uid");
  const rows = Number(searchParams.get("rows"));
  const page = Number(searchParams.get("page"));
  const status = searchParams.get("status");
  const sort = searchParams.get("sort");

  try {
    const products = await getProduct(uid as string, rows as number, page as number, status as string, sort as string, query as string);
    return NextResponse.json({ success: true, products: products.data, totalProducts: products.totalProducts });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
