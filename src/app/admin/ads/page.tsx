"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getAdminToken, setAdminToken, adminHeaders } from "@/lib/admin-auth";

interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3: string;
  description1: string;
  description2: string;
}

interface FacebookAd {
  primary_text: string;
  headline: string;
  description: string;
  cta: string;
}

interface VideoScene {
  timestamp: string;
  visual: string;
  voiceover: string;
  text_overlay: string;
}

interface VideoScript {
  duration: string;
  scenes: VideoScene[];
}

interface VideoRender {
  headline: string;
  description: string;
  cta_text: string;
}

interface GeneratedAds {
  google_ads: GoogleAd[];
  facebook_ads: FacebookAd[];
  video_script: VideoScript;
  video_render?: VideoRender;
}

const SERVICE_TYPES = [
  { value: "junk_removal", label: "Junk Removal & Hauling" },
  { value: "green_waste", label: "Green Waste Pickup" },
  { value: "construction_debris", label: "Construction Debris" },
  { value: "property_cleanout", label: "Property Cleanout" },
  { value: "farm_cleanup", label: "Farm & Barn Cleanup" },
  { value: "manure_removal", label: "Manure Removal" },
  { value: "dumpster_rental", label: "Dumpster Rental" },
];

const TARGET_AREAS = [
  { value: "Palm Beach County", label: "All of Palm Beach County" },
  { value: "Royal Palm Beach, FL", label: "Royal Palm Beach" },
  { value: "Wellington, FL", label: "Wellington" },
  { value: "Loxahatchee, FL", label: "Loxahatchee" },
  { value: "West Palm Beach, FL", label: "West Palm Beach" },
  { value: "Palm Beach Gardens, FL", label: "Palm Beach Gardens" },
];

export default function AdsPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [serviceType, setServiceType] = useState("junk_removal");
  const [targetArea, setTargetArea] = useState("Palm Beach County");
  const [platform, setPlatform] = useState("both");
  const [additionalContext, setAdditionalContext] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [ads, setAds] = useState<GeneratedAds | null>(null);
  const [rawText, setRawText] = useState("");

  // Facebook posting state
  const [posting, setPosting] = useState<number | null>(null);
  const [postResult, setPostResult] = useState("");

  // Clipboard state
  const [copied, setCopied] = useState<string | null>(null);

  // Video render state
  const [renderJobId, setRenderJobId] = useState<string | null>(null);
  const [renderStatus, setRenderStatus] = useState<string | null>(null);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderVideoUrl, setRenderVideoUrl] = useState<string | null>(null);
  const [renderError, setRenderError] = useState("");
  const [postingVideo, setPostingVideo] = useState(false);
  const [videoPostResult, setVideoPostResult] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdminToken(token);
    // Quick auth check
    try {
      const res = await fetch("/api/admin/pricing", {
        headers: adminHeaders(token),
      });
      if (!res.ok) throw new Error();
      setAuthed(true);
    } catch {
      setError("Invalid token");
    }
  };

  const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = (h * maxWidth) / w;
          w = maxWidth;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      if (images.length + i >= 4) break;
      try {
        const compressed = await compressImage(files[i]);
        setImages((prev) => {
          if (prev.length >= 4) return prev;
          return [...prev, compressed];
        });
      } catch {
        // skip failed images
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generateAds = async () => {
    setGenerating(true);
    setError("");
    setAds(null);
    setRawText("");
    // Reset render state
    setRenderJobId(null);
    setRenderStatus(null);
    setRenderProgress(0);
    setRenderVideoUrl(null);
    setRenderError("");
    setVideoPostResult("");
    if (pollRef.current) clearInterval(pollRef.current);
    try {
      const res = await fetch("/api/admin/ads/generate", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({
          serviceType,
          targetArea,
          platform,
          additionalContext,
          images,
        }),
      });
      if (!res.ok) {
        let msg = "Generation failed";
        try {
          const data = await res.json();
          msg = data.error || msg;
        } catch {
          msg = res.status === 413 ? "Images too large. Try fewer or smaller photos." : `Server error (${res.status})`;
        }
        throw new Error(msg);
      }
      const data = await res.json();
      if (data.ads) {
        setAds(data.ads);
      } else if (data.raw) {
        setRawText(data.raw);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate ads");
    } finally {
      setGenerating(false);
    }
  };

  const postToFacebook = async (index: number) => {
    if (!ads?.facebook_ads[index]) return;
    setPosting(index);
    setPostResult("");
    try {
      const fb = ads.facebook_ads[index];
      const message = `${fb.primary_text}\n\n${fb.headline}\n\n${fb.cta} at myhorsefarm.com/quote?service=${serviceType}`;
      const res = await fetch("/api/admin/ads/post-facebook", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({
          message,
          imageBase64: images[0] || null,
          link: `https://www.myhorsefarm.com/quote?service=${serviceType}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPostResult(`Posted to Facebook! Post ID: ${data.postId}`);
      } else {
        setPostResult(`Error: ${data.error}`);
      }
    } catch {
      setPostResult("Failed to post to Facebook");
    } finally {
      setPosting(null);
    }
  };

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const pollRenderStatus = useCallback((jobId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/admin/ads/render-status?jobId=${jobId}`,
          { headers: adminHeaders() }
        );
        const data = await res.json();
        if (!data.job) return;
        setRenderProgress(Math.round((data.job.progress || 0) * 100));
        if (data.job.status === "completed") {
          setRenderStatus("completed");
          setRenderVideoUrl(data.job.output_url);
          setRenderProgress(100);
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (data.job.status === "failed") {
          setRenderStatus("failed");
          setRenderError(data.job.error_message || "Render failed");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // Keep polling on transient errors
      }
    }, 3000);
  }, []);

  const renderVideo = async () => {
    if (!ads?.video_render || images.length === 0) return;
    setRenderError("");
    setRenderStatus("rendering");
    setRenderProgress(0);
    setRenderVideoUrl(null);
    setVideoPostResult("");
    try {
      const serviceLabel =
        SERVICE_TYPES.find((s) => s.value === serviceType)?.label || serviceType;
      const res = await fetch("/api/admin/ads/render", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({
          images,
          headline: ads.video_render.headline,
          description: ads.video_render.description,
          ctaText: ads.video_render.cta_text,
          serviceName: serviceLabel,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start render");
      }
      const data = await res.json();
      setRenderJobId(data.job.id);
      pollRenderStatus(data.job.id);
    } catch (err) {
      setRenderStatus("failed");
      setRenderError(err instanceof Error ? err.message : "Render failed");
    }
  };

  const postVideoToFacebook = async () => {
    if (!renderVideoUrl || !ads?.facebook_ads?.[0]) return;
    setPostingVideo(true);
    setVideoPostResult("");
    try {
      const fb = ads.facebook_ads[0];
      const message = `${fb.primary_text}\n\n${fb.headline}\n\n${fb.cta} at myhorsefarm.com/quote?service=${serviceType}`;
      const res = await fetch("/api/admin/ads/post-facebook", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ message, videoUrl: renderVideoUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setVideoPostResult(`Video posted to Facebook! Post ID: ${data.postId}`);
      } else {
        setVideoPostResult(`Error: ${data.error}`);
      }
    } catch {
      setVideoPostResult("Failed to post video to Facebook");
    } finally {
      setPostingVideo(false);
    }
  };

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        >
          <h1 className="text-xl font-bold mb-4">Admin Login</h1>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <input
            type="password"
            placeholder="Admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded font-semibold hover:bg-green-700"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">AI Ad Generator</h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate targeted ads for Google, Facebook, and video scripts
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Configuration Panel */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Campaign Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                {SERVICE_TYPES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Area
              </label>
              <select
                value={targetArea}
                onChange={(e) => setTargetArea(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                {TARGET_AREAS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="both">Google Ads + Facebook</option>
                <option value="google">Google Ads Only</option>
                <option value="facebook">Facebook Only</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Context (optional)
            </label>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="E.g., 'We just finished a big construction site cleanup' or 'Running a spring special 10% off' or 'Focus on same-day service'..."
              className="w-full border rounded px-3 py-2 text-sm h-20 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photos (up to 4) — job sites, equipment, before/after
            </label>
            <div className="flex flex-wrap gap-3 items-start">
              {images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 group">
                  <img
                    src={img}
                    alt={`Upload ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"
                >
                  <i className="fas fa-camera text-xl mb-1" />
                  <span className="text-xs">Add Photo</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <button
            onClick={generateAds}
            disabled={generating}
            className="w-full md:w-auto px-8 py-3 bg-green-800 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                Generating Ads...
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-2" />
                Generate Ad Copy
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {ads && (
          <div className="space-y-6">
            {/* Google Ads */}
            {ads.google_ads && ads.google_ads.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fab fa-google text-blue-500" />
                  Google Ads Variations
                </h2>
                <div className="space-y-4">
                  {ads.google_ads.map((ad, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-400 font-medium">
                          Variation {i + 1}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `Headlines:\n${ad.headline1}\n${ad.headline2}\n${ad.headline3}\n\nDescriptions:\n${ad.description1}\n${ad.description2}`,
                              `google-${i}`,
                            )
                          }
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          {copied === `google-${i}` ? (
                            "Copied!"
                          ) : (
                            <>
                              <i className="fas fa-copy mr-1" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      {/* Ad Preview */}
                      <div className="bg-gray-50 rounded p-3 mb-2">
                        <p className="text-sm text-gray-400 mb-1">Ad preview</p>
                        <p className="text-blue-700 text-base font-medium leading-tight">
                          {ad.headline1} | {ad.headline2} | {ad.headline3}
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                          myhorsefarm.com
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {ad.description1}
                        </p>
                        <p className="text-sm text-gray-700">
                          {ad.description2}
                        </p>
                      </div>
                      {/* Character counts */}
                      <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                        <span>
                          H1: {ad.headline1.length}/30
                          {ad.headline1.length > 30 && (
                            <span className="text-red-500 ml-1">OVER</span>
                          )}
                        </span>
                        <span>
                          H2: {ad.headline2.length}/30
                          {ad.headline2.length > 30 && (
                            <span className="text-red-500 ml-1">OVER</span>
                          )}
                        </span>
                        <span>
                          H3: {ad.headline3.length}/30
                          {ad.headline3.length > 30 && (
                            <span className="text-red-500 ml-1">OVER</span>
                          )}
                        </span>
                        <span>
                          D1: {ad.description1.length}/90
                          {ad.description1.length > 90 && (
                            <span className="text-red-500 ml-1">OVER</span>
                          )}
                        </span>
                        <span>
                          D2: {ad.description2.length}/90
                          {ad.description2.length > 90 && (
                            <span className="text-red-500 ml-1">OVER</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facebook Ads */}
            {ads.facebook_ads && ads.facebook_ads.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fab fa-facebook text-blue-600" />
                  Facebook Ad Variations
                </h2>
                {postResult && (
                  <div
                    className={`text-sm px-3 py-2 rounded mb-4 ${postResult.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
                  >
                    {postResult}
                  </div>
                )}
                <div className="space-y-4">
                  {ads.facebook_ads.map((ad, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs text-gray-400 font-medium">
                          Variation {i + 1}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              copyToClipboard(
                                `${ad.primary_text}\n\n${ad.headline}\n${ad.description}\n\nCTA: ${ad.cta}`,
                                `fb-${i}`,
                              )
                            }
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            {copied === `fb-${i}` ? (
                              "Copied!"
                            ) : (
                              <>
                                <i className="fas fa-copy mr-1" />
                                Copy
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => postToFacebook(i)}
                            disabled={posting !== null}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {posting === i ? (
                              <>
                                <i className="fas fa-spinner fa-spin mr-1" />
                                Posting...
                              </>
                            ) : (
                              <>
                                <i className="fab fa-facebook mr-1" />
                                Post to FB
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      {/* FB Ad Preview */}
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <div className="p-3 flex items-center gap-2 border-b border-gray-200">
                          <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            MHF
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              My Horse Farm
                            </p>
                            <p className="text-xs text-gray-400">
                              Sponsored
                            </p>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm whitespace-pre-wrap mb-3">
                            {ad.primary_text}
                          </p>
                        </div>
                        {images[0] && (
                          <img
                            src={images[0]}
                            alt="Ad preview"
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-3 border-t border-gray-200 bg-white">
                          <p className="text-xs text-gray-400 uppercase">
                            myhorsefarm.com
                          </p>
                          <p className="text-sm font-semibold">
                            {ad.headline}
                          </p>
                          <p className="text-xs text-gray-500">
                            {ad.description}
                          </p>
                        </div>
                        <div className="px-3 pb-3 bg-white">
                          <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded">
                            {ad.cta}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Script */}
            {ads.video_script && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <i className="fas fa-video text-red-500" />
                    Video Commercial Script ({ads.video_script.duration})
                  </h2>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        ads.video_script.scenes
                          .map(
                            (s) =>
                              `[${s.timestamp}]\nVisual: ${s.visual}\nVO: ${s.voiceover}\nText: ${s.text_overlay}`,
                          )
                          .join("\n\n"),
                        "video",
                      )
                    }
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {copied === "video" ? (
                      "Copied!"
                    ) : (
                      <>
                        <i className="fas fa-copy mr-1" />
                        Copy Script
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-3">
                  {ads.video_script.scenes.map((scene, i) => (
                    <div
                      key={i}
                      className="border-l-4 border-primary pl-4 py-2"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                          {scene.timestamp}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-xs text-gray-400 block">
                            Visual
                          </span>
                          <p className="text-gray-700">{scene.visual}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 block">
                            Voiceover
                          </span>
                          <p className="text-gray-700">
                            &ldquo;{scene.voiceover}&rdquo;
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 block">
                            On-Screen Text
                          </span>
                          <p className="font-semibold text-gray-800">
                            {scene.text_overlay}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Render */}
            {ads.video_render && images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-film text-purple-500" />
                  Video Ad Renderer
                </h2>

                {/* Render info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
                  <p className="text-gray-600 mb-2">
                    Renders a 25-second branded video ad using your uploaded
                    photos with Ken Burns effects, text overlays, and MHF
                    branding.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium text-gray-700">Headline:</span>{" "}
                      {ads.video_render.headline}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Description:</span>{" "}
                      {ads.video_render.description}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">CTA:</span>{" "}
                      {ads.video_render.cta_text}
                    </div>
                  </div>
                </div>

                {/* Render button */}
                {!renderStatus && (
                  <button
                    onClick={renderVideo}
                    className="px-6 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                  >
                    <i className="fas fa-magic mr-2" />
                    Render Video
                  </button>
                )}

                {/* Progress bar */}
                {renderStatus === "rendering" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-spinner fa-spin text-purple-600" />
                      <span className="text-sm text-gray-700">
                        Rendering video... {renderProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${renderProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      This takes 1-3 minutes. Do not close this page.
                    </p>
                  </div>
                )}

                {/* Error */}
                {renderStatus === "failed" && (
                  <div className="space-y-3">
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {renderError || "Video render failed"}
                    </div>
                    <button
                      onClick={() => {
                        setRenderStatus(null);
                        setRenderError("");
                      }}
                      className="text-sm text-purple-600 hover:text-purple-800"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Completed — video preview + actions */}
                {renderStatus === "completed" && renderVideoUrl && (
                  <div className="space-y-4">
                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">
                      Video rendered successfully!
                    </div>

                    {/* Video player */}
                    <div className="max-w-sm mx-auto">
                      <video
                        src={renderVideoUrl}
                        controls
                        className="w-full rounded-lg shadow-md"
                        style={{ aspectRatio: "9/16", maxHeight: 500 }}
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={renderVideoUrl}
                        download="mhf-ad-video.mp4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors inline-flex items-center"
                      >
                        <i className="fas fa-download mr-2" />
                        Download Video
                      </a>
                      <button
                        onClick={postVideoToFacebook}
                        disabled={postingVideo}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {postingVideo ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2" />
                            Posting Video...
                          </>
                        ) : (
                          <>
                            <i className="fab fa-facebook mr-2" />
                            Post Video to FB
                          </>
                        )}
                      </button>
                    </div>

                    {videoPostResult && (
                      <div
                        className={`text-sm px-3 py-2 rounded ${videoPostResult.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
                      >
                        {videoPostResult}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Raw text fallback */}
        {rawText && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Generated Copy</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded">
              {rawText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
