import { updateBuyerName } from "@/utill/action/userActions/userAction";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { email, name } = await req.json();
  try {
    await updateBuyerName(email, name);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false });
  }
}
