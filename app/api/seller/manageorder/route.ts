import { getOrder } from "@/utill/action/sellerActions/order";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid")!;
  const query = searchParams.get("query")!;
  const page = Number(searchParams.get("page"))!;
  const rows = Number(searchParams.get("rows"))!;
  const status = searchParams.get("status")!;
  const filter = searchParams.get("filter");
  const sort = searchParams.get("sort");
  try {
    const orders = await getOrder(uid, query, rows as number, page as number, status, filter, sort);
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ succes: false }, { status: 400 });
  }
}
