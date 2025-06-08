import { updateProductClicks } from "@/utill/action/userActions/product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pid, clickedBy, clickedOnKeyword } = await req.json();

  try {
    await updateProductClicks(pid, clickedBy, clickedOnKeyword);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
