import { NextResponse } from "next/server";
import { inngest } from "@/utill/inngest/inngest";
export async function POST(req: Request) {
  const { oids } = await req.json();
  try {
    console.log("oids", oids);
    await inngest.send({ name: "update-order-status-in-db", data: { oids } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
