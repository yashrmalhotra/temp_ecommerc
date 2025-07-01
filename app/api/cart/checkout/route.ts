import { processBulkOrder } from "@/utill/action/userActions/order";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { details } = await req.json();
  try {
    const session = await processBulkOrder(details);

    return NextResponse.json({ sucess: true, session });
  } catch (error) {
    return NextResponse.json({ sucess: false }, { status: 500 });
  }
}
