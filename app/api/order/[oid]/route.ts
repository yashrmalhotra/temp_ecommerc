import { cancelOrder, getOrderById } from "@/utill/action/userActions/order";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ oid: string }> }) {
  const { oid } = await params;

  try {
    const order = await getOrderById(oid);
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 400 });
  }
}
export async function DELETE(req: Request, { params }: { params: Promise<{ oid: string }> }) {
  const { oid } = await params;

  try {
    await cancelOrder(oid);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 400 });
  }
}
