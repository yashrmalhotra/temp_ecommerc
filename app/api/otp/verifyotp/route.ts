import { NextResponse } from "next/server";
import { verifyOTP } from "@/utill/action/userActions/userAction";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    
    const res = await verifyOTP(email, otp);
    return NextResponse.json({ success: true, res });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
