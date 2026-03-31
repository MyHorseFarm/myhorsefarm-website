import { NextRequest, NextResponse } from "next/server";
import { submitMultipleUrls } from "@/lib/google-indexing";

export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { urls } = await request.json();
  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json(
      { error: "Provide an array of URLs" },
      { status: 400 },
    );
  }

  const results = await submitMultipleUrls(urls.slice(0, 50));
  return NextResponse.json({ results });
}
