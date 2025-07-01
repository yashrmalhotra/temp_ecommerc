import { getSalesData } from "@/utill/action/sellerActions/sellerActions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  try {
    const details = await getSalesData(uid as string);
    return NextResponse.json({ success: true, details });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
