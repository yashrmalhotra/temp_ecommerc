import { getReturn } from "@/utill/action/sellerActions/return";
import { inngest } from "@/utill/inngest/inngest";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const query = searchParams.get("query");
  const page = Number(searchParams.get("page"))!;
  const rows = Number(searchParams.get("rows"))!;

  try {
    const returns = await getReturn(uid as string, rows as number, page as number, query as string);
    return NextResponse.json({ success: true, returns });
  } catch (error) {
    return NextResponse.json({ succes: false }, { status: 400 });
  }
}
export async function POST(req: Request) {
  const { oid } = await req.json();
  try {
    await inngest.send({ name: "update-return-in-db", data: { oid } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ succes: false }, { status: 500 });
  }
}
