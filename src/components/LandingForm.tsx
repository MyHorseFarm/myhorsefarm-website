"use client";

import { EMAIL_FORM, SITE_URL } from "@/lib/constants";

export default function LandingForm({
  formSubject,
  selectLabel,
  selectOptions,
  addressPlaceholder,
  messagePlaceholder,
  extraFields,
}: {
  formSubject: string;
  selectLabel: string;
  selectOptions: { value: string; label: string }[];
  addressPlaceholder: string;
  messagePlaceholder: string;
  extraFields?: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-[320px] max-md:min-w-0 bg-white border-2 border-primary rounded-[10px] p-8 max-[480px]:p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <h2 className="text-center mt-0 text-primary-dark">Get Your Free Quote</h2>
      <form
        action={`https://formsubmit.co/${EMAIL_FORM}`}
        method="POST"
        className="flex flex-col gap-3.5"
      >
        <input type="hidden" name="_subject" value={formSubject} />
        <input type="hidden" name="_captcha" value="true" />
        <input
          type="hidden"
          name="_next"
          value={`${SITE_URL}/thank-you`}
        />
        <input type="hidden" name="_template" value="table" />
        <input
          type="text"
          name="name"
          placeholder="Your Name *"
          required
          className="px-3.5 py-3 border border-gray-300 rounded text-base font-[inherit] w-full box-border focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(104,159,56,0.2)]"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number *"
          required
          className="px-3.5 py-3 border border-gray-300 rounded text-base font-[inherit] w-full box-border focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(104,159,56,0.2)]"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="px-3.5 py-3 border border-gray-300 rounded text-base font-[inherit] w-full box-border focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(104,159,56,0.2)]"
        />
        <input
          type="text"
          name="address"
          placeholder={addressPlaceholder}
          required
          className="px-3.5 py-3 border border-gray-300 rounded text-base font-[inherit] w-full box-border focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(104,159,56,0.2)]"
        />
        <select
          name="service"
          required
          className="px-3.5 py-3 border border-gray-300 rounded text-base font-[inherit] w-full box-border focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(104,159,56,0.2)]"
        >
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
          className="px-3.5 py-3 border border-gray-300 rounded text-base font-[inherit] w-full box-border min-h-[80px] resize-y focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(104,159,56,0.2)]"
        />
        <button
          type="submit"
          className="py-3.5 bg-primary text-white border-none rounded text-lg font-bold cursor-pointer hover:bg-primary-dark transition-colors"
        >
          <i className="fas fa-paper-plane" /> Get My Free Quote
        </button>
      </form>
    </div>
  );
}
