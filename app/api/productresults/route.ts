import { getProductResult } from "@/utill/action/userActions/product";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const data = await req.json();
  const query = data.query;
  const pageNumber = Number(data.page);
  const filters = data.filters;
  try {
    const products = await getProductResult(query!, pageNumber!, filters);

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
