import { getOrder } from "@/utill/action/userActions/order";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const order = await getOrder(uid as string);
  try {
    return NextResponse.json({ status: true, order });
  } catch (error) {}
}
