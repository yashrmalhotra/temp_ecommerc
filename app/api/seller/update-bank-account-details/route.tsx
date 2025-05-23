import { updateBankAccountDetails } from "@/utill/action/sellerActions/sellerActions";
import { NextResponse } from "next/server";
import { sellerEvent } from "@/utill/action/sellerActions/sellerEvents";
export async function PUT(req: Request) {
  const { data, uid } = await req.json();
  try {
    await updateBankAccountDetails(uid, data);
    sellerEvent.emit("detailsUpdated", uid as string);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
