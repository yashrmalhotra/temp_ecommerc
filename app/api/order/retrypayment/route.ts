import { retryPayment } from "@/utill/action/userActions/order";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { oid } = await req.json();
  try {
    const session = await retryPayment(oid);
    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
