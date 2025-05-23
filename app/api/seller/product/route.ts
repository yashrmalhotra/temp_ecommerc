import { addProduct, deleteProduct, editProduct } from "@/utill/action/sellerActions/product";
import { getProductForEdit } from "@/utill/action/sellerActions/sellerActions";
import { parseFormData } from "@/utill/utillityFunctions";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pid = searchParams.get("pid");
  try {
    const product = await getProductForEdit(pid as string);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
export async function POST(req: Request) {
  const formData: FormData = await req.formData();
  try {
    const productInfo = parseFormData(formData);
    await addProduct(productInfo);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData: FormData = await req.formData();
    const productInfo = parseFormData(formData);
    await editProduct(productInfo);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { pid } = await req.json();

  try {
    await deleteProduct(pid);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
