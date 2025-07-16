import { deleteItemToCart, getCartItem } from "@/utill/action/userActions/cart";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  try {
    const items = await getCartItem(uid as string);
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
export async function DELETE(req: Request) {
  try {
    const { uid, pid } = await req.json();
    
    await deleteItemToCart(uid, pid);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
