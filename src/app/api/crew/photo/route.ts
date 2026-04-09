import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

async function authenticateCrew(
  request: NextRequest,
): Promise<{ id: string; name: string } | null> {
  const pin = request.headers.get("x-crew-pin");
  if (!pin) return null;

  const { data: member } = await supabase
    .from("crew_members")
    .select("id, name")
    .eq("pin", pin)
    .eq("active", true)
    .single();

  if (member) return member;

  if (pin === process.env.CREW_PIN) {
    return { id: "legacy", name: "field" };
  }

  return null;
}

export async function POST(request: NextRequest) {
  const crew = await authenticateCrew(request);
  if (!crew) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("photo") as File | null;
  const logId = formData.get("log_id") as string | null;

  if (!file || !logId) {
    return NextResponse.json(
      { error: "photo and log_id are required" },
      { status: 400 },
    );
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "File must be an image" },
      { status: 400 },
    );
  }

  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large (max 10MB)" },
      { status: 400 },
    );
  }

  // Verify log exists and belongs to this crew member
  const { data: log } = await supabase
    .from("service_logs")
    .select("id, crew_member")
    .eq("id", logId)
    .single();

  if (!log) {
    return NextResponse.json({ error: "Service log not found" }, { status: 404 });
  }

  if (log.crew_member !== crew.name) {
    return NextResponse.json({ error: "Not authorized for this log" }, { status: 403 });
  }

  // Upload to Supabase Storage
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${logId}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("service-photos")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 },
    );
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("service-photos")
    .getPublicUrl(filename);

  const photoUrl = urlData.publicUrl;

  // Update service_logs with photo_url
  const { error: updateError } = await supabase
    .from("service_logs")
    .update({ photo_url: photoUrl })
    .eq("id", logId);

  if (updateError) {
    console.error("Update service_log error:", updateError);
    return NextResponse.json(
      { error: "Photo uploaded but failed to link to log" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, photo_url: photoUrl }, { status: 200 });
}
