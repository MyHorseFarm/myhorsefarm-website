"use client";

import { useState, useEffect } from "react";
import type { ServicePricing } from "@/lib/types";

interface QuoteFormProps {
  services: ServicePricing[];
}

type Step = "service" | "details" | "location" | "contact" | "confirmation";

const LOCATION_OPTIONS = [
  { value: "wellington", label: "Wellington" },
  { value: "loxahatchee", label: "Loxahatchee" },
  { value: "royal_palm_beach", label: "Royal Palm Beach" },
  { value: "west_palm_beach", label: "West Palm Beach" },
  { value: "palm_beach_gardens", label: "Palm Beach Gardens" },
  { value: "loxahatchee_groves", label: "Loxahatchee Groves" },
];

export default function QuoteForm({ services }: QuoteFormProps) {
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<ServicePricing | null>(null);
  const [details, setDetails] = useState<Record<string, unknown>>({});
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [preview, setPreview] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    quote_number: string;
    estimated_amount: number;
    requires_site_visit: boolean;
  } | null>(null);
  const [error, setError] = useState("");

  // Calculate preview price when details change
  useEffect(() => {
    if (!selectedService || selectedService.requires_site_visit) {
      setPreview(null);
      return;
    }

    let base = 0;
    switch (selectedService.unit) {
      case "per_load":
        base = selectedService.base_rate * (Number(details.loads) || 0);
        break;
      case "per_can":
        base = selectedService.base_rate * (Number(details.cans) || 0);
        break;
      case "per_ton":
        base = selectedService.base_rate * Math.min(Number(details.estimated_tons) || 0, 10);
        break;
      case "per_yard":
        base = selectedService.base_rate * (Number(details.yards) || 0);
        break;
      case "per_sqft":
        base = selectedService.base_rate * (Number(details.sqft) || 0);
        break;
      case "flat":
        base = selectedService.base_rate;
        break;
    }

    if (selectedService.minimum_charge && base > 0 && base < selectedService.minimum_charge) {
      base = selectedService.minimum_charge;
    }

    setPreview(base > 0 ? Math.round(base * 100) / 100 : null);
  }, [selectedService, details]);

  async function handleSubmit() {
    if (!selectedService || !location || !contact.name || !contact.email || !contact.phone) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_key: selectedService.service_key,
          customer_name: contact.name,
          customer_email: contact.email,
          customer_phone: contact.phone,
          customer_location: location,
          property_details: details,
          source: "form",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create quote");

      setResult(data.quote);
      setStep("confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function renderDetailsFields() {
    if (!selectedService) return null;

    switch (selectedService.unit) {
      case "per_load":
        return (
          <>
            <label className="block mb-4">
              <span className="text-gray-700 font-semibold">Number of loads</span>
              <p className="text-sm text-gray-500 mt-0.5">Each load is a 40-yard truck</p>
              <input
                type="number"
                min={1}
                value={(details.loads as number) || ""}
                onChange={(e) => setDetails({ ...details, loads: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. 1"
              />
            </label>
            {selectedService.frequency_options && (
              <label className="block mb-4">
                <span className="text-gray-700 font-semibold">Pickup frequency</span>
                <select
                  value={(details.frequency as string) || ""}
                  onChange={(e) => setDetails({ ...details, frequency: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">Select frequency</option>
                  {selectedService.frequency_options.map((f) => (
                    <option key={f} value={f}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </>
        );

      case "per_can":
        return (
          <>
            <label className="block mb-4">
              <span className="text-gray-700 font-semibold">Number of trash cans</span>
              <p className="text-sm text-gray-500 mt-0.5">One-yard bins</p>
              <input
                type="number"
                min={1}
                value={(details.cans as number) || ""}
                onChange={(e) => setDetails({ ...details, cans: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. 4"
              />
            </label>
            {selectedService.frequency_options && (
              <label className="block mb-4">
                <span className="text-gray-700 font-semibold">Pickup frequency</span>
                <select
                  value={(details.frequency as string) || ""}
                  onChange={(e) => setDetails({ ...details, frequency: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">Select frequency</option>
                  {selectedService.frequency_options.map((f) => (
                    <option key={f} value={f}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </>
        );

      case "per_ton":
        return (
          <label className="block mb-4">
            <span className="text-gray-700 font-semibold">Estimated tons</span>
            <p className="text-sm text-gray-500 mt-0.5">Max 10 tons per truck load</p>
            <input
              type="number"
              min={1}
              max={10}
              step={0.5}
              value={(details.estimated_tons as number) || ""}
              onChange={(e) => setDetails({ ...details, estimated_tons: Math.min(Number(e.target.value), 10) })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. 5"
            />
          </label>
        );

      case "per_yard":
        return (
          <label className="block mb-4">
            <span className="text-gray-700 font-semibold">Cubic yards needed</span>
            <input
              type="number"
              min={1}
              value={(details.yards as number) || ""}
              onChange={(e) => setDetails({ ...details, yards: Number(e.target.value) })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. 20"
            />
          </label>
        );

      case "per_sqft":
        return (
          <label className="block mb-4">
            <span className="text-gray-700 font-semibold">Square footage</span>
            <input
              type="number"
              min={100}
              step={100}
              value={(details.sqft as number) || ""}
              onChange={(e) => setDetails({ ...details, sqft: Number(e.target.value) })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. 5000"
            />
          </label>
        );

      case "flat":
        return (
          selectedService.base_rate > 0 ? (
            <p className="text-gray-600 mb-4">
              This is a flat-rate service at <strong>${selectedService.base_rate.toFixed(2)}</strong>.
            </p>
          ) : null
        );

      default:
        return null;
    }
  }

  const steps: { key: Step; label: string }[] = [
    { key: "service", label: "Service" },
    { key: "details", label: "Details" },
    { key: "location", label: "Location" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      {step !== "confirmation" && (
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  steps.findIndex((x) => x.key === step) >= i
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <span className="ml-2 text-sm hidden sm:inline text-gray-600">{s.label}</span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 bg-gray-200">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: steps.findIndex((x) => x.key === step) > i ? "100%" : "0%",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
      )}

      {/* Step 1: Select Service */}
      {step === "service" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Select a Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((svc) => (
              <button
                key={svc.service_key}
                onClick={() => {
                  setSelectedService(svc);
                  setDetails({});
                  setStep("details");
                }}
                className={`text-left p-5 rounded-lg border-2 transition-all hover:border-primary hover:shadow-md ${
                  selectedService?.service_key === svc.service_key
                    ? "border-primary bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <h3 className="font-bold text-gray-800">{svc.display_name}</h3>
                <p className="text-sm text-gray-500 mt-1">{svc.description}</p>
                <p className="text-primary font-semibold mt-2">
                  {svc.requires_site_visit
                    ? "Custom quote"
                    : `From $${svc.base_rate.toFixed(2)}/${svc.unit.replace(/_/g, " ")}`}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Property Details */}
      {step === "details" && selectedService && (
        <div>
          <h2 className="text-xl font-bold mb-2">
            {selectedService.display_name} – Property Details
          </h2>
          {selectedService.requires_site_visit && (
            <div className="bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg mb-4 text-yellow-800 text-sm">
              This service requires a site visit for accurate pricing. We&rsquo;ll provide an estimate range and follow up to schedule a visit.
            </div>
          )}

          {renderDetailsFields()}

          <label className="block mb-4">
            <span className="text-gray-700 font-semibold">Additional notes (optional)</span>
            <textarea
              value={(details.notes as string) || ""}
              onChange={(e) => setDetails({ ...details, notes: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="Anything we should know about your property..."
            />
          </label>

          {/* Price preview */}
          {preview !== null && (
            <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-lg mb-4">
              <span className="text-gray-700">Estimated price: </span>
              <span className="text-xl font-bold text-primary">
                ${preview.toFixed(2)}
              </span>
              {selectedService.is_recurring && (
                <span className="text-gray-500 text-sm">/month</span>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep("service")}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep("location")}
              className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {step === "location" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Select Your Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LOCATION_OPTIONS.map((loc) => (
              <button
                key={loc.value}
                onClick={() => {
                  setLocation(loc.value);
                  setStep("contact");
                }}
                className={`text-left p-4 rounded-lg border-2 transition-all hover:border-primary ${
                  location === loc.value
                    ? "border-primary bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <span className="font-semibold text-gray-800">{loc.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep("details")}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Contact Info */}
      {step === "contact" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Contact Information</h2>
          <label className="block mb-4">
            <span className="text-gray-700 font-semibold">Full name</span>
            <input
              type="text"
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="John Smith"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700 font-semibold">Email</span>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="john@example.com"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700 font-semibold">Phone</span>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="(561) 555-1234"
            />
          </label>

          {/* Final price preview */}
          {preview !== null && (
            <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-lg mb-4">
              <span className="text-gray-700">Your quote: </span>
              <span className="text-xl font-bold text-primary">
                ${preview.toFixed(2)}
              </span>
              {selectedService?.is_recurring && (
                <span className="text-gray-500 text-sm">/month</span>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep("location")}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !contact.name || !contact.email || !contact.phone}
              className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Get My Quote"}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Confirmation */}
      {step === "confirmation" && result && (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-primary text-2xl" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {result.requires_site_visit
              ? "Quote Request Received!"
              : "Your Quote Is Ready!"}
          </h2>
          <p className="text-gray-600 mb-2">
            Quote #{result.quote_number}
          </p>
          {!result.requires_site_visit && (
            <p className="text-3xl font-bold text-primary mb-4">
              ${result.estimated_amount.toFixed(2)}
            </p>
          )}
          {result.requires_site_visit ? (
            <p className="text-gray-600 mb-6">
              We&rsquo;ll contact you within one business day to schedule a site visit and provide an accurate quote.
            </p>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                We&rsquo;ve sent the details to your email. Ready to schedule?
              </p>
              <a
                href={`/quote/${result.id}`}
                className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                Accept &amp; Schedule
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
