import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/indexing"];

async function getAuthClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
  return auth.getClient();
}

export async function submitUrlForIndexing(
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED",
) {
  const auth = await getAuthClient();
  const indexing = google.indexing({
    version: "v3",
    auth: auth as unknown as InstanceType<typeof google.auth.GoogleAuth>,
  });
  const result = await indexing.urlNotifications.publish({
    requestBody: { url, type },
  });
  return result.data;
}

export async function submitMultipleUrls(urls: string[]) {
  const results: { url: string; status: string; data?: unknown; error?: string }[] = [];
  for (const url of urls) {
    try {
      const data = await submitUrlForIndexing(url);
      results.push({ url, status: "success", data });
    } catch (error) {
      results.push({ url, status: "error", error: String(error) });
    }
  }
  return results;
}
