"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type FormEvent } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ToolStatus {
  name: string;
  label: string;
  done: boolean;
}

const EXAMPLE_PROMPTS = [
  "What are today's pending charges?",
  "Show revenue this month",
  "List overdue invoices",
  "Search customer John",
  "What bookings do we have this week?",
];

export default function AdminChat({ adminToken }: { adminToken: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toolStatus, setToolStatus] = useState<ToolStatus | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  // Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: Message = { role: "user", content: text.trim() };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setLoading(true);
      setStreamingText("");
      setToolStatus(null);

      try {
        const res = await fetch("/api/admin/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";
        const accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              const eventType = line.slice(7).trim();
              // next line should be data:
              continue;
            }
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6);
              try {
                const data = JSON.parse(jsonStr);
                // We need to know the event type. Let's parse event+data pairs.
                // Actually, let's re-parse the buffer properly.
              } catch {
                // ignore parse errors
              }
            }
          }
        }

        // Re-parse the full response properly using EventSource-style parsing
        // Actually let's redo this with a proper SSE parser inline:
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${message}` },
        ]);
      } finally {
        setLoading(false);
        setToolStatus(null);
      }
    },
    [messages, loading, adminToken]
  );

  // Better approach: use a proper SSE stream reader
  const sendMessageSSE = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: Message = { role: "user", content: text.trim() };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setLoading(true);
      setStreamingText("");
      setToolStatus(null);

      try {
        const res = await fetch("/api/admin/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";
        let accumulatedText = "";
        const currentEvent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages (double newline separated)
          while (buffer.includes("\n\n")) {
            const idx = buffer.indexOf("\n\n");
            const block = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);

            let eventType = "";
            let eventData = "";

            for (const line of block.split("\n")) {
              if (line.startsWith("event: ")) {
                eventType = line.slice(7).trim();
              } else if (line.startsWith("data: ")) {
                eventData = line.slice(6);
              }
            }

            if (!eventType || !eventData) continue;

            try {
              const parsed = JSON.parse(eventData);

              switch (eventType) {
                case "text":
                  accumulatedText += parsed.text;
                  setStreamingText(accumulatedText);
                  break;
                case "tool_start":
                  setToolStatus({ name: parsed.name, label: parsed.label, done: false });
                  break;
                case "tool_result":
                  setToolStatus({ name: parsed.name, label: parsed.label, done: true });
                  break;
                case "done":
                  // Final text
                  if (parsed.text) {
                    accumulatedText = parsed.text;
                  }
                  setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: accumulatedText },
                  ]);
                  setStreamingText("");
                  accumulatedText = "";
                  break;
                case "error":
                  setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: `Error: ${parsed.message}` },
                  ]);
                  setStreamingText("");
                  break;
              }
            } catch {
              // ignore parse errors
            }
          }
        }

        // If we have accumulated text but no "done" event, add it
        if (accumulatedText && !messages.find((m) => m.content === accumulatedText)) {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && last.content === accumulatedText) return prev;
            return [...prev, { role: "assistant", content: accumulatedText }];
          });
          setStreamingText("");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${message}` },
        ]);
      } finally {
        setLoading(false);
        setToolStatus(null);
        setStreamingText("");
      }
    },
    [messages, loading, adminToken]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessageSSE(input);
  };

  const handleExampleClick = (prompt: string) => {
    sendMessageSSE(prompt);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageSSE(input);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
          title="AI Assistant (Ctrl+K)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-[440px]:w-[calc(100vw-2rem)] max-[440px]:right-4 max-[440px]:left-4">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-green-800 text-white shrink-0">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="font-semibold text-sm">MHF Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-green-200 mr-2">⌘K</span>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-green-700 transition-colors"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-4">Ask me anything about your farm operations</p>
                <div className="space-y-2 w-full">
                  {EXAMPLE_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleExampleClick(prompt)}
                      className="w-full text-left text-xs px-3 py-2 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-lg transition-colors text-gray-700"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-green-700 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Streaming text */}
            {streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[85%] px-3 py-2 rounded-lg rounded-bl-sm bg-gray-100 text-gray-800 text-sm whitespace-pre-wrap">
                  {streamingText}
                  <span className="inline-block w-1.5 h-4 bg-green-600 ml-0.5 animate-pulse" />
                </div>
              </div>
            )}

            {/* Tool status */}
            {toolStatus && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
                  {!toolStatus.done ? (
                    <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {toolStatus.label}...
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {loading && !streamingText && !toolStatus && (
              <div className="flex justify-start">
                <div className="px-3 py-2 bg-gray-100 rounded-lg rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="shrink-0 border-t border-gray-200 p-3 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about payments, bookings..."
              disabled={loading}
              className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
