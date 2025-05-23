import { getProductResult } from "@/utill/action/userActions/product";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");
  const pageNumber = Number(searchParams.get("page"));
  console.log("pg = ", pageNumber);
  try {
    const products = await getProductResult(query!, pageNumber!);

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
