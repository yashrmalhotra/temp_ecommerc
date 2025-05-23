import { addBuyerAddress, deleteBuyerAddress, updateBuyerAddress } from "@/utill/action/userActions/userAction";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, buyerAddress } = await req.json();

  try {
    await addBuyerAddress(email, buyerAddress);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.log(error, "uar");
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
export async function PUT(req: Request) {
  const { email, buyerAddress } = await req.json();
  try {
    await updateBuyerAddress(email, buyerAddress);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
export async function DELETE(req: Request) {
  const { email, buyerAddress } = await req.json();
  try {
    await deleteBuyerAddress(email, buyerAddress);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
