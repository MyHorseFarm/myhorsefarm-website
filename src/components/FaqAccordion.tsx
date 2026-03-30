"use client";

import { useState } from "react";
import { FAQ_ITEMS, PHONE_OFFICE, PHONE_OFFICE_TEL } from "@/lib/constants";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-20 bg-surface-alt">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Quick answers to common questions about our services.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`border-b border-gray-100 last:border-b-0 transition-colors ${
                  isOpen ? "bg-primary/[0.02]" : ""
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  {/* Green accent bar */}
                  <div
                    className={`w-1 self-stretch rounded-full transition-colors duration-300 ${
                      isOpen ? "bg-primary" : "bg-transparent"
                    }`}
                  />
                  <span className="flex-1 text-base font-semibold text-gray-800">
                    {item.question}
                  </span>
                  {/* Chevron */}
                  <svg
                    className={`faq-chevron w-5 h-5 text-primary shrink-0 ${isOpen ? "open" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Animated answer */}
                <div className={`faq-answer-grid ${isOpen ? "open" : ""}`}>
                  <div>
                    <p className="px-6 pl-11 pb-5 text-sm text-gray-500 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-8 text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <p className="text-lg font-semibold text-gray-800 font-heading mb-2">
            Still have questions?
          </p>
          <p className="text-sm text-gray-500 mb-4">
            We&apos;re happy to help. Reach out and we&apos;ll get back to you quickly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
            >
              <i className="fas fa-envelope text-sm" />
              Contact Us
            </a>
            <a
              href={`tel:${PHONE_OFFICE_TEL}`}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors"
            >
              <i className="fas fa-phone text-sm" />
              {PHONE_OFFICE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
