import { createUser } from "@/utill/action/userActions/userAction";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { data } = await req.json();

  try {
    await createUser(data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
