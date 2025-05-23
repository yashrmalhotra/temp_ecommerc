import { getDraftProduct } from "@/utill/action/sellerActions/product";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const uid = searchParams.get("uid");

  try {
    const draftProducts = await getDraftProduct(uid as string);
    return NextResponse.json({ success: true, draftProducts });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
