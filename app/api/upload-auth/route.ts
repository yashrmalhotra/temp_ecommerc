import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKITIO_PRIVATE_KEY as string,
      publicKey: process.env.IMAGEKITIO_PRIVATE_KEY as string,
    });
    return Response.json({ token, expire, signature, publicKey: process.env.IMAGEKITIO_PUBLIC_KEY });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
