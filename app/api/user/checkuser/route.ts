import { checkExistingUser } from "@/utill/action/userActions/userAction";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const request = await req.json();
  try {
    const msg = await checkExistingUser(request?.email, request?.role);
    return NextResponse.json({ success: true, msg });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
