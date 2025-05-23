import { getProduct } from "@/utill/action/userActions/product";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params;
  try {
    const product = await getProduct(pid);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
