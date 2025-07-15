import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature");
  const timeStamp = req.headers.get("x-webhook-timestamp");
  try {
    console.log("headers", signature, timeStamp);
    if (!signature || !timeStamp) {
      console.log("verify missing attribute");
      return NextResponse.json({ error: "Missing webhook header" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("error from route", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
