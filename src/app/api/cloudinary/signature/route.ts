import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paramsToSign } = body;

    if (!paramsToSign) {
      return NextResponse.json({ error: "paramsToSign is required" }, { status: 400 });
    }

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      return NextResponse.json({ error: "CLOUDINARY_API_SECRET environment variable is missing" }, { status: 500 });
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    return NextResponse.json({ signature });
  } catch (error: any) {
    console.error("Cloudinary signature generation failed:", error);
    return NextResponse.json({ error: error.message || "Signature generation failed" }, { status: 500 });
  }
}
