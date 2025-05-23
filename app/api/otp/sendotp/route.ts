import { NextResponse } from "next/server";
import { sendOTPVerificationMail } from "@/utill/action/userActions/userAction";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const res = await sendOTPVerificationMail(email);
    return NextResponse.json({ success: true, res });
  } catch (error: any) {
    return NextResponse.json({ success: true, error: error.message });
  }
}
