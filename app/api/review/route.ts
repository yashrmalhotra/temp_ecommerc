import { inngest } from "@/utill/inngest/inngest";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { uid, rating, review, pid, oid, name } = await req.json();
  try {
    await inngest.send({ name: "add-review-in-db", data: { uid, pid, oid, review, rating, name } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
