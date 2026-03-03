"use client";

import { useState, type FormEvent } from "react";
import { PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

type FormState = "idle" | "submitting" | "success" | "error";

export default function LandingForm({
  serviceKey,
  locationKey,
  selectLabel,
  selectOptions,
  addressPlaceholder,
  messagePlaceholder,
  extraFields,
}: {
  serviceKey: string;
  locationKey: string;
  selectLabel: string;
  selectOptions: { value: string; label: string }[];
  addressPlaceholder: string;
  messagePlaceholder: string;
  extraFields?: React.ReactNode;
}) {
  const [state, setState] = useState<FormState>("idle");
  const [quoteNumber, setQuoteNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const inputClass =
    "px-3.5 py-3 border border-gray-300 rounded text-base font-[inherit] w-full box-border focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(104,159,56,0.2)]";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const propertyDetails: Record<string, unknown> = {
      address: data.get("address"),
      service_subtype: data.get("service"),
    };
    const stalls = data.get("stalls");
    if (stalls) propertyDetails.stalls = stalls;
    const message = data.get("message");
    if (message) propertyDetails.notes = message;

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_key: serviceKey,
          customer_name: data.get("name"),
          customer_email: data.get("email"),
          customer_phone: data.get("phone"),
          customer_location: locationKey,
          property_details: propertyDetails,
          source: "landing_page",
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }

      const result = await res.json();
      setQuoteNumber(result.quote_number || "");
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex-1 min-w-[320px] max-md:min-w-0 bg-white border-2 border-primary rounded-[10px] p-8 max-[480px]:p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="text-center py-8">
          <div className="text-5xl text-primary mb-4">
            <i className="fas fa-check-circle" />
          </div>
          <h2 className="text-primary-dark mt-0 mb-3">Thank You!</h2>
          <p className="text-gray-700 mb-2">Check your email for your quote details.</p>
          {quoteNumber && (
            <p className="text-sm text-gray-500 mb-4">
              Quote #{quoteNumber}
            </p>
          )}
          <p className="text-gray-600 mb-4">
            We&apos;ll be in touch shortly. Need immediate help?
          </p>
          <a
            href={`tel:${PHONE_OFFICE_TEL}`}
            className="inline-block px-8 py-3.5 bg-primary text-white rounded font-bold text-lg hover:bg-primary-dark transition-colors no-underline"
          >
            <i className="fas fa-phone" /> Call {PHONE_OFFICE}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-[320px] max-md:min-w-0 bg-white border-2 border-primary rounded-[10px] p-8 max-[480px]:p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <h2 className="text-center mt-0 text-primary-dark">Get Your Free Quote</h2>

      {state === "error" && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded p-3 mb-4 text-sm">
          {errorMsg || "Something went wrong. Please try again."}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <input
          type="text"
          name="name"
          placeholder="Your Name *"
          required
          className={inputClass}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number *"
          required
          className={inputClass}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address *"
          required
          className={inputClass}
        />
        <input
          type="text"
          name="address"
          placeholder={addressPlaceholder}
          required
          className={inputClass}
        />
        <select name="service" required className={inputClass}>
          <option value="">{selectLabel}</option>
          {selectOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {extraFields}
        <textarea
          name="message"
          placeholder={messagePlaceholder}
          className={`${inputClass} min-h-[80px] resize-y`}
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="py-3.5 bg-primary text-white border-none rounded text-lg font-bold cursor-pointer hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {state === "submitting" ? (
            <>
              <i className="fas fa-spinner fa-spin" /> Submitting...
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane" /> Get My Free Quote
            </>
          )}
        </button>
      </form>
    </div>
  );
}
