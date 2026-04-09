"use client";

import { useState, useRef } from "react";
import SquareCardForm, { type SquareCardFormHandle } from "@/components/SquareCardForm";
import SignaturePad, { type SignaturePadHandle } from "@/components/SignaturePad";

interface CustomerProfileFormProps {
  quoteId: string;
  token: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerLocation: string;
  squareAppId: string;
  squareLocationId: string;
  onComplete: () => void;
}

export default function CustomerProfileForm({
  quoteId,
  token,
  customerName,
  customerEmail,
  customerPhone,
  customerLocation,
  squareAppId,
  squareLocationId,
  onComplete,
}: CustomerProfileFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Farm/Property Details
  const [gateCode, setGateCode] = useState("");
  const [numHorses, setNumHorses] = useState("");
  const [numStalls, setNumStalls] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [accessInstructions, setAccessInstructions] = useState("");

  // Billing
  const [sameAsService, setSameAsService] = useState(true);
  const [billingAddress, setBillingAddress] = useState("");

  // Signature
  const [signatureData, setSignatureData] = useState<string | null>(null);

  // Notes
  const [notes, setNotes] = useState("");

  // Refs
  const cardFormRef = useRef<SquareCardFormHandle>(null);
  const signaturePadRef = useRef<SignaturePadHandle>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate signature
    if (!signatureData) {
      setError("Please sign the card authorization before continuing.");
      return;
    }

    // Validate card + tokenize
    if (!cardFormRef.current) {
      setError("Card form is not ready. Please wait a moment and try again.");
      return;
    }

    setSubmitting(true);

    try {
      const nonce = await cardFormRef.current.tokenize();

      const res = await fetch(
        `/api/quote/${quoteId}/profile?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gate_code: gateCode || undefined,
            num_horses: numHorses ? parseInt(numHorses, 10) : undefined,
            num_stalls: numStalls ? parseInt(numStalls, 10) : undefined,
            property_size: propertySize || undefined,
            access_instructions: accessInstructions || undefined,
            billing_address: sameAsService ? customerLocation : billingAddress || undefined,
            same_as_service: sameAsService,
            nonce,
            signature_data: signatureData,
            notes: notes || undefined,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-5 text-white">
          <p className="text-sm opacity-80">Almost there</p>
          <p className="text-xl font-bold">Complete Your Profile</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer summary */}
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <p className="font-semibold text-gray-900">{customerName}</p>
            <p className="text-sm text-gray-500">{customerLocation}</p>
          </div>

          {/* ─── Farm/Property Details ─── */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Farm / Property Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gate Code
                </label>
                <input
                  type="text"
                  value={gateCode}
                  onChange={(e) => setGateCode(e.target.value)}
                  placeholder="e.g. #1234"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Horses
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={numHorses}
                    onChange={(e) => setNumHorses(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Stalls
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={numStalls}
                    onChange={(e) => setNumStalls(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Size
                </label>
                <input
                  type="text"
                  value={propertySize}
                  onChange={(e) => setPropertySize(e.target.value)}
                  placeholder="e.g. 5 acres"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Access Instructions
                </label>
                <textarea
                  value={accessInstructions}
                  onChange={(e) => setAccessInstructions(e.target.value)}
                  rows={2}
                  placeholder="e.g. Enter through the back gate, barn is on the left"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
                />
              </div>
            </div>
          </div>

          {/* ─── Billing Address ─── */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Billing Address</h3>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsService}
                onChange={(e) => {
                  setSameAsService(e.target.checked);
                  if (e.target.checked) setBillingAddress("");
                }}
                className="w-4 h-4 accent-green-800"
              />
              Same as service address
            </label>
            {!sameAsService && (
              <div className="mt-3">
                <input
                  type="text"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  placeholder="Billing address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
                />
              </div>
            )}
          </div>

          {/* ─── Payment Card ─── */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Payment Card</h3>
            <SquareCardForm
              ref={cardFormRef}
              squareAppId={squareAppId}
              squareLocationId={squareLocationId}
            />
            <p className="text-xs text-gray-500 mt-2">
              <i className="fas fa-lock text-gray-400 mr-1" />
              Your card will only be charged after service is completed.
            </p>
          </div>

          {/* ─── Card Authorization Signature ─── */}
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Card Authorization</h3>
            <p className="text-sm text-gray-600 mb-3">
              I authorize My Horse Farm to charge the card above for services rendered.
            </p>
            <SignaturePad
              ref={signaturePadRef}
              onSignatureChange={setSignatureData}
              height={160}
            />
          </div>

          {/* ─── Additional Notes ─── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Anything else we should know..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-[#2d5016] text-white font-semibold rounded-lg hover:bg-[#234011] transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save & Continue to Scheduling"}
          </button>
        </form>
      </div>
    </div>
  );
}
