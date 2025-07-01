import { inngest } from "@/utill/inngest/inngest";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { oid } = await req.json();

  try {
    await inngest.send({
      name: "create-return-in-db",
      data: { oid },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
export async function DELETE(req: Request) {
  const { oid } = await req.json();

  try {
    await inngest.send({
      name: "cancel-return-in-db",
      data: { oid },
    });
    return NextResponse.json({ msg: "return canceled" });
  } catch (error) {
    return NextResponse.json({ msg: "return canceled failed" });
  }
}
