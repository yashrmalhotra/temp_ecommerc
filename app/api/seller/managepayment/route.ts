import { getPayments } from "@/utill/action/sellerActions/payment";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const page = Number(searchParams.get("page"));
  const rows = Number(searchParams.get("rows"));
  const query = searchParams.get("query");

  try {
    const payments = await getPayments(uid as string, query, rows, page);
    return NextResponse.json({ success: true, payments });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
