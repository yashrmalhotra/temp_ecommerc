import { getOrder } from "@/utill/action/sellerActions/order";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const query = searchParams.get("query");
  const page = Number(searchParams.get("page"))!;
  const rows = Number(searchParams.get("rows"))!;

  try {
    const orders = await getOrder(uid as string, query as string, rows as number, page as number);
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ succes: false }, { status: 400 });
  }
}
