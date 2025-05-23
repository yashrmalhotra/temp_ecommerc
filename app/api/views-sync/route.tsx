import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pid } = await req.json();
  try {
    console.log("before running");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
