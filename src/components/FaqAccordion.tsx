import { FAQ_ITEMS } from "@/lib/constants";

export default function FaqAccordion() {
  return (
    <section id="faq" className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Quick answers to common questions about our services.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="faq-item group">
              <summary className="px-6 py-5 text-base font-semibold text-gray-800 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors">
                {item.question}
              </summary>
              <p className="px-6 pb-5 -mt-1 text-sm text-gray-500 leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
