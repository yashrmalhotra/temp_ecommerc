import { NextResponse } from "next/server";
import { getUser } from "@/utill/action/userActions/userAction";

export async function GET(req: Request, { params }: { params: Promise<{ email: string }> }) {
  const { email } = await params;
  const user = await getUser(email);
  return NextResponse.json({ success: true, user });
}
