import { getOrderById } from "@/utill/action/sellerActions/order";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ oid: string }> }) {
  const { oid } = await params;
  try {
    const order = await getOrderById(oid as string);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
