"use client";

import { useState, FormEvent } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-4">
        <i className="fas fa-check-circle text-accent text-lg" />
        <p className="text-sm text-white/90">
          You&apos;re in! Watch your inbox for farm tips and updates.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 bg-accent text-earth font-semibold rounded-xl hover:bg-accent-light transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <i className="fas fa-spinner fa-spin text-xs" />
            Subscribing...
          </span>
        ) : (
          "Subscribe"
        )}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-300 sm:absolute sm:bottom-0 sm:translate-y-full sm:pt-1">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
