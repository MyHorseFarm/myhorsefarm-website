import { supabase } from "./supabase";

const BUCKET = "ad-images";

/**
 * Upload a base64 image to Supabase Storage and return its public URL.
 * The base64 string should include the data URI prefix (e.g., "data:image/jpeg;base64,...").
 */
export async function uploadAdImage(
  base64DataUri: string,
  filename: string
): Promise<string> {
  // Parse the data URI
  const match = base64DataUri.match(
    /^data:(image\/\w+);base64,(.+)$/
  );
  if (!match) {
    throw new Error("Invalid base64 data URI");
  }

  const mimeType = match[1];
  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, "base64");

  const path = `${Date.now()}-${filename}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
}

/**
 * Upload multiple base64 images and return their public URLs.
 */
export async function uploadAdImages(
  images: string[]
): Promise<string[]> {
  const urls = await Promise.all(
    images.map((img, i) => uploadAdImage(img, `ad-image-${i}.jpg`))
  );
  return urls;
}
