"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// Square Web Payments SDK types
interface SquarePayments {
  card: (options?: Record<string, unknown>) => Promise<SquareCard>;
}
interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: { message: string }[] }>;
  destroy: () => void;
}
interface SquareGlobal {
  payments: (appId: string, locationId: string) => Promise<SquarePayments>;
}

declare global {
  interface Window {
    Square?: SquareGlobal;
  }
}

type Step = "info" | "card" | "signature" | "success";

interface Props {
  squareAppId: string;
  squareLocationId: string;
}

export default function EnrollmentForm({ squareAppId, squareLocationId }: Props) {
  const [step, setStep] = useState<Step>("info");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [hasDifferentBilling, setHasDifferentBilling] = useState(false);
  const [billingAddress, setBillingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [authorized, setAuthorized] = useState(false);

  // Square card
  const [squareReady, setSquareReady] = useState(false);
  const cardRef = useRef<SquareCard | null>(null);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const [hasSigned, setHasSigned] = useState(false);
  const nonceRef = useRef("");

  // Success data
  const [cardLast4, setCardLast4] = useState("");
  const [cardBrand, setCardBrand] = useState("");

  // Load Square SDK when entering card step
  useEffect(() => {
    if (step !== "card") return;

    let cancelled = false;

    const init = async () => {
      // Load script if not present
      if (!window.Square) {
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector('script[src*="squarecdn.com/v1/square.js"]');
          if (existing) {
            if (window.Square) { resolve(); return; }
            existing.addEventListener("load", () => resolve());
            return;
          }
          const script = document.createElement("script");
          const isSandbox = squareAppId.startsWith("sandbox-");
          script.src = isSandbox
            ? "https://sandbox.web.squarecdn.com/v1/square.js"
            : "https://web.squarecdn.com/v1/square.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Square SDK"));
          document.head.appendChild(script);
        });
      }

      if (cancelled) return;

      const payments = await window.Square!.payments(squareAppId, squareLocationId);
      const card = await payments.card({ includeInputLabels: true });
      if (cancelled) {
        card.destroy();
        return;
      }
      await card.attach("#square-card-container");
      cardRef.current = card;
      setSquareReady(true);
    };

    init().catch((err) => {
      if (!cancelled) setError(err.message || "Failed to initialize card form");
    });

    return () => {
      cancelled = true;
      if (cardRef.current) {
        cardRef.current.destroy();
        cardRef.current = null;
      }
      setSquareReady(false);
    };
  }, [step, squareAppId, squareLocationId]);

  // Signature canvas setup
  useEffect(() => {
    if (step !== "signature") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
  }, [step]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setHasSigned(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasSigned(false);
  };

  // Step handlers
  const handleInfoNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStep("card");
  };

  const handleCardNext = useCallback(async () => {
    setError("");
    if (!authorized) {
      setError("Please accept the authorization to continue.");
      return;
    }
    if (!cardRef.current) {
      setError("Card form not ready. Please wait.");
      return;
    }

    const result = await cardRef.current.tokenize();
    if (result.status !== "OK" || !result.token) {
      const msg = result.errors?.map((e) => e.message).join(", ") || "Card tokenization failed";
      setError(msg);
      return;
    }

    // Store nonce temporarily — we'll use it on final submit
    nonceRef.current = result.token;
    setStep("signature");
  }, [authorized]);

  const handleSubmit = async () => {
    setError("");
    if (!hasSigned) {
      setError("Please sign above to continue.");
      return;
    }

    setSubmitting(true);

    try {
      const signatureData = canvasRef.current?.toDataURL("image/png") || "";
      const nonce = nonceRef.current;

      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || undefined,
          phone: phone || undefined,
          address: address || undefined,
          billingAddress: hasDifferentBilling && billingAddress ? billingAddress : undefined,
          notes: notes || undefined,
          nonce,
          signatureData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enrollment failed");

      setCardLast4(data.cardLast4 || "");
      setCardBrand(data.cardBrand || "");
      nonceRef.current = "";
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setSubmitting(false);
    }
  };

  const stepNumber = step === "info" ? 1 : step === "card" ? 2 : step === "signature" ? 3 : 4;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Intro message */}
      {step === "info" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-green-900 mb-2">Set Up Recurring Service</h2>
          <p className="text-sm text-green-800 leading-relaxed">
            Complete this form to enroll in recurring pickup service. We&apos;ll securely
            store your card on file through Square and only charge it after each
            service is performed. You&apos;ll receive a receipt for every charge and can
            cancel anytime by calling us.
          </p>
          <div className="mt-3 text-xs text-green-700 space-y-1">
            <p><strong>Step 1:</strong> Enter your contact and service address</p>
            <p><strong>Step 2:</strong> Securely add your payment card</p>
            <p><strong>Step 3:</strong> Sign the authorization</p>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {step !== "success" && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  n <= stepNumber
                    ? "bg-green-800 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {n}
              </div>
              {n < 3 && (
                <div
                  className={`w-12 h-0.5 ${
                    n < stepNumber ? "bg-green-800" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Info */}
      {step === "info" && (
        <form onSubmit={handleInfoNext} className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your Information</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter your details to set up recurring service.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farm/Property Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={hasDifferentBilling}
              onChange={(e) => {
                setHasDifferentBilling(e.target.checked);
                if (!e.target.checked) setBillingAddress("");
              }}
              className="w-4 h-4 accent-green-800"
            />
            Billing address is different from service address
          </label>
          {hasDifferentBilling && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address
              </label>
              <input
                type="text"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
              rows={2}
              placeholder="Gate code, stall count, special instructions..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Continue
          </button>
        </form>
      )}

      {/* Step 2: Card */}
      {step === "card" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Method</h2>
          <p className="text-sm text-gray-600 mb-4">
            Your card will be securely stored for recurring service charges.
          </p>
          <div
            id="square-card-container"
            className="min-h-[50px] border border-gray-300 rounded-lg p-3"
          />
          {!squareReady && (
            <p className="text-sm text-gray-500">Loading secure card form...</p>
          )}
          <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={authorized}
              onChange={(e) => setAuthorized(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-green-800"
            />
            <span className="text-sm text-gray-700 leading-snug">
              I authorize My Horse Farm to store my card on file and charge it for
              services rendered.
            </span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("info")}
              className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleCardNext}
              disabled={!squareReady}
              className="flex-1 bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Signature */}
      {step === "signature" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Authorization Signature</h2>
          <p className="text-sm text-gray-600 mb-4">
            Sign below to authorize card-on-file charges for services rendered by My
            Horse Farm.
          </p>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-48 cursor-crosshair"
              style={{ touchAction: "none" }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {hasSigned ? "Signature captured" : "Draw your signature above"}
            </p>
            <button
              type="button"
              onClick={clearSignature}
              className="text-sm text-gray-500 underline hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("card")}
              className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !hasSigned}
              className="flex-1 bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Enrollment"}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === "success" && (
        <div className="space-y-5">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">You&apos;re All Set!</h2>
            <p className="text-gray-600 mt-1">
              Your account has been created and your card is securely on file.
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
              <p className="font-medium text-gray-900">{name}</p>
            </div>
            {address && (
              <div className="px-4 py-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Service Address</p>
                <p className="font-medium text-gray-900">{address}</p>
              </div>
            )}
            {hasDifferentBilling && billingAddress && (
              <div className="px-4 py-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Billing Address</p>
                <p className="font-medium text-gray-900">{billingAddress}</p>
              </div>
            )}
            {cardBrand && cardLast4 && (
              <div className="px-4 py-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Card on File</p>
                <p className="font-medium text-gray-900">{cardBrand} ending in {cardLast4}</p>
              </div>
            )}
          </div>

          {/* What happens next */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">What Happens Next</h3>
            <ul className="text-sm text-green-800 space-y-1.5">
              <li>We&apos;ll contact you to confirm your service schedule.</li>
              <li>Your card is only charged after each service is performed.</li>
              <li>You&apos;ll receive a receipt by email for every charge.</li>
              <li>You can cancel or update your card anytime by calling us.</li>
            </ul>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Questions? Call us at{" "}
            <a href="tel:5615767667" className="text-green-800 underline">
              (561) 576-7667
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
