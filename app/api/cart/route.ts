import { addItemToCart, getCartItemId, updateCartItemQty } from "@/utill/action/userActions/cart";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    if (data.mode === "addItem") {
      await addItemToCart(data);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  const { data } = await req.json();

  try {
    await updateCartItemQty(data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  try {
    const ids = await getCartItemId(uid as string);
    return NextResponse.json({ success: true, ids });
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}

