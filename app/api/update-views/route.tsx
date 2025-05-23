import { updateProductViews } from "@/utill/action/userActions/product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pids, viewedBy } = await req.json();

  try {
    await updateProductViews(pids, viewedBy);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
