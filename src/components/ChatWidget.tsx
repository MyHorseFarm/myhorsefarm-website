"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import NextImage from "next/image";
import { trackEvent } from "@/lib/analytics";

interface QuoteCard {
  quote_number: string;
  service: string;
  total: number;
  quote_url: string;
  requires_site_visit: boolean;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  quoteCard?: QuoteCard;
  timestamp?: number;
}

const QUICK_OPTIONS = [
  { label: "Manure Removal", icon: "fas fa-truck", message: "I need manure removal" },
  { label: "Junk Removal", icon: "fas fa-dumpster", message: "I need junk removal" },
  { label: "Get a Quote", icon: "fas fa-file-invoice-dollar", message: "I'd like to get a quote" },
  { label: "Same-Day Service", icon: "fas fa-bolt", message: "I need same-day service — it's urgent" },
];

/** Resize an image file to max 800px wide and return a base64 data URI. */
function resizeImage(file: File, maxWidth = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const THROTTLE_MS = 2500;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ dataUri: string; objectUrl: string } | null>(null);
  const [chatEnded, setChatEnded] = useState(false);
  const lastSendTime = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (pendingImage) URL.revokeObjectURL(pendingImage.objectUrl);
    };
  }, [pendingImage]);

  async function initSession(): Promise<string> {
    if (sessionId) return sessionId;
    const res = await fetch("/api/chat/session", { method: "POST" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setSessionId(data.session_id);
    return data.session_id;
  }

  const handleSend = useCallback(async (overrideMessage?: string) => {
    const userMessage = overrideMessage || input.trim() || (pendingImage ? "Here's a photo" : "");
    if (!userMessage || sending || chatEnded) return;

    const now = Date.now();
    if (now - lastSendTime.current < THROTTLE_MS) return;
    lastSendTime.current = now;

    setInput("");
    setSending(true);

    const imageToSend = pendingImage;
    setPendingImage(null);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        imageUrl: imageToSend?.objectUrl,
        timestamp: Date.now(),
      },
    ]);

    try {
      const sid = await initSession();

      setMessages((prev) => [...prev, { role: "assistant", content: "", timestamp: Date.now() }]);
      setStreaming(true);

      const body: Record<string, string> = { session_id: sid, message: userMessage };
      if (imageToSend) body.image = imageToSend.dataUri;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        if (res.status === 429) {
          const data = await res.json().catch(() => ({}));
          if (data.error === "limit_reached") {
            const endMsg = "Thanks for chatting! For anything else, reach Jose directly at (561) 576-7667 or start a new chat.";
            setMessages((prev) =>
              prev.map((msg, idx) =>
                idx === prev.length - 1 && msg.role === "assistant"
                  ? { ...msg, content: endMsg }
                  : msg
              )
            );
            setChatEnded(true);
            return;
          }
          setMessages((prev) => prev.filter((_, idx) => idx !== prev.length - 1));
          return;
        }
        throw new Error("Chat request failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "text") {
              setMessages((prev) =>
                prev.map((msg, idx) =>
                  idx === prev.length - 1 && msg.role === "assistant"
                    ? { ...msg, content: msg.content + event.text }
                    : msg
                )
              );
            } else if (event.type === "quote_card") {
              setMessages((prev) =>
                prev.map((msg, idx) =>
                  idx === prev.length - 1 && msg.role === "assistant"
                    ? {
                        ...msg,
                        quoteCard: {
                          quote_number: event.quote_number,
                          service: event.service,
                          total: event.total,
                          quote_url: event.quote_url,
                          requires_site_visit: event.requires_site_visit,
                        },
                      }
                    : msg
                )
              );
              trackEvent("generate_lead", {
                currency: "USD",
                value: event.total,
                service: event.service,
                source: "chatbot",
                quote_number: event.quote_number,
              });
            } else if (event.type === "error") {
              setMessages((prev) =>
                prev.map((msg, idx) =>
                  idx === prev.length - 1 && msg.role === "assistant"
                    ? { ...msg, content: event.text }
                    : msg
                )
              );
            }
          } catch {
            // Skip malformed events
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content) {
          return [
            ...prev.slice(0, -1),
            { ...last, content: "Hey, I ran into a hiccup on my end. Can you try sending that again? Or text Jose directly at (561) 576-7667." },
          ];
        }
        return prev;
      });
    } finally {
      setSending(false);
      setStreaming(false);
    }
  }, [input, sending, pendingImage, sessionId, chatEnded]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Photo is too large. Please use an image under 10MB.");
      return;
    }

    try {
      const dataUri = await resizeImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPendingImage({ dataUri, objectUrl });
      inputRef.current?.focus();
    } catch {
      alert("Could not process that image. Please try another.");
    }
  }

  function removePendingImage() {
    if (pendingImage) {
      URL.revokeObjectURL(pendingImage.objectUrl);
      setPendingImage(null);
    }
  }

  const showQuickOptions = messages.length === 0 && !sending;

  return (
    <>
      {/* Floating button with label */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 max-md:bottom-20">
          <div
            onClick={() => setOpen(true)}
            className="bg-white text-gray-700 px-4 py-2 rounded-full shadow-lg text-sm font-medium cursor-pointer hover:shadow-xl transition-shadow border border-gray-100"
          >
            Chat with us
          </div>
          <button
            onClick={() => setOpen(true)}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark hover:scale-105 transition-all flex items-center justify-center"
            aria-label="Open chat"
          >
            <i className="fas fa-comments text-xl" />
          </button>
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-24px)] h-[520px] max-h-[calc(100vh-48px)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-chat-open max-md:bottom-0 max-md:right-0 max-md:w-full max-md:h-full max-md:rounded-none max-md:max-w-full max-md:max-h-full">
          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <NextImage src="/logo.png" alt="My Horse Farm logo" width={32} height={32} className="w-8 h-8 rounded-full bg-white p-0.5" />
              <div>
                <div className="font-semibold text-sm">My Horse Farm</div>
                <div className="text-xs opacity-80">Usually replies instantly</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <i className="fas fa-times text-lg" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Welcome + Quick select buttons */}
            {showQuickOptions && (
              <div className="space-y-3 py-2">
                <div className="text-center text-gray-500 text-sm">
                  <p className="font-medium text-gray-700 mb-1">Hey! How can we help?</p>
                  <p>Tap an option or type a message below.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleSend(opt.message)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all border ${
                        opt.label === "Same-Day Service"
                          ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <i className={`${opt.icon} text-xs ${
                        opt.label === "Same-Day Service" ? "text-amber-600" : "text-primary"
                      }`} />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {/* Photo thumbnail */}
                  {msg.imageUrl && (
                    <div className="p-1.5 pb-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded photo"
                        className="rounded-xl max-h-40 w-auto object-cover"
                      />
                    </div>
                  )}
                  <div className="px-3 py-2 whitespace-pre-line">
                    {msg.content || (
                      <span className="inline-flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    )}
                  </div>
                  {/* Inline quote card */}
                  {msg.quoteCard && (
                    <div className="mx-2 mb-2 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{msg.quoteCard.quote_number}</p>
                        <p className="font-semibold text-gray-800 text-sm">{msg.quoteCard.service}</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-2xl font-bold text-primary">
                          ${msg.quoteCard.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        {msg.quoteCard.requires_site_visit && (
                          <p className="text-xs text-amber-600 mt-1">
                            <i className="fas fa-info-circle mr-1" />
                            Final price confirmed after site visit
                          </p>
                        )}
                      </div>
                      <div className="px-3 pb-3 flex gap-2">
                        <a
                          href={msg.quoteCard.quote_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center px-3 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          View Quote
                        </a>
                        <a
                          href="tel:+15615767667"
                          className="flex-1 text-center px-3 py-2 border border-primary text-primary text-xs font-semibold rounded-lg hover:bg-green-50 transition-colors"
                        >
                          Call to Schedule
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                {/* Timestamp */}
                {msg.timestamp && msg.content && (
                  <p className="text-[10px] text-gray-400 mt-0.5 px-1">
                    {formatTime(msg.timestamp)}
                  </p>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Pending image preview */}
          {pendingImage && (
            <div className="px-3 pb-1 shrink-0">
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pendingImage.objectUrl}
                  alt="Photo to send"
                  className="h-16 w-auto rounded-lg border border-gray-200 object-cover"
                />
                <button
                  onClick={removePendingImage}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  aria-label="Remove photo"
                >
                  <i className="fas fa-times text-[10px]" />
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 shrink-0">
            {chatEnded ? (
              <div className="text-center text-sm text-gray-500 py-1">
                Chat ended.{" "}
                <button
                  onClick={() => {
                    setMessages([]);
                    setSessionId(null);
                    setChatEnded(false);
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  Start a new chat
                </button>{" "}
                or call{" "}
                <a href="tel:+15615767667" className="text-primary font-medium hover:underline">
                  (561) 576-7667
                </a>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2 items-center"
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={sending}
                  className="w-9 h-9 text-gray-400 hover:text-primary transition-colors disabled:opacity-50 shrink-0 flex items-center justify-center"
                  aria-label="Upload photo"
                  title="Send a photo"
                >
                  <i className="fas fa-camera text-base" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={pendingImage ? "Add a note about this photo..." : "Type a message..."}
                  disabled={sending}
                  className="flex-1 px-3 py-2 rounded-full border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={sending || (!input.trim() && !pendingImage)}
                  className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-30 shrink-0 shadow-sm"
                >
                  <i className="fas fa-paper-plane text-sm" />
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-gray-300 pb-1.5 shrink-0">
            myhorsefarm.com
          </div>
        </div>
      )}
    </>
  );
}
