import { cashfreeVerify } from "@/utill/action/webhooks/webhook";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature");
  const timeStamp = req.headers.get("x-webhook-timestamp");
  try {
  
    if (!signature || !timeStamp) {
      console.log("verify missing attribute");
      return NextResponse.json({ error: "Missing webhook header" }, { status: 400 });
    }
    await cashfreeVerify(signature, rawBody, timeStamp);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("error from route", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
