import { processOrder } from "@/utill/action/userActions/order";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pid, uid, address, kw, qty, soldBy, name, email } = await req.json();
  try {
    const session = await processOrder(pid, uid, name, email, soldBy, address, kw, qty);
    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 400 });
  }
}
