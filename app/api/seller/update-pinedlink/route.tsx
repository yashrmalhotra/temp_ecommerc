import { updatePinedLink } from "@/utill/action/sellerActions/sellerActions";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { uid, pinedLink } = await req.json();
  
  try {
    await updatePinedLink(uid, pinedLink);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
