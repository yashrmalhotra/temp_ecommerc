import { updateShopDisplayName } from "@/utill/action/sellerActions/sellerActions";
import { NextResponse } from "next/server";
import { sellerEvent } from "@/utill/action/sellerActions/sellerEvents";
export async function PUT(req: Request) {
  const { uid, data } = await req.json();

  try {
    await updateShopDisplayName(uid, data.displayName);
    sellerEvent.emit("detailsUpdated", uid as string);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
