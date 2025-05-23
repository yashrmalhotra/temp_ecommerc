import { getSuggestion } from "@/utill/action/userActions/product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  try {
    const suggestions = await getSuggestion(searchParams.get("keyword") as string);

    return NextResponse.json({ success: true, suggestions });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
