import { getTrendingProducts } from "@/utill/action/userActions/product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const products = await getTrendingProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
