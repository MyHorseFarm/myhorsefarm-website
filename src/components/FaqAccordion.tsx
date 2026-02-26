import { FAQ_ITEMS } from "@/lib/constants";

export default function FaqAccordion() {
  return (
    <section id="faq" className="py-15 px-5 max-w-[1200px] mx-auto max-md:py-10 max-md:px-4">
      <h2 className="text-center text-2xl max-md:text-xl">Frequently Asked Questions</h2>
      <div className="max-w-[800px] mx-auto mt-5 text-left">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="faq-item border-b border-gray-300">
            <summary className="py-4 text-[1.05rem] max-md:text-[0.95rem] font-semibold text-gray-800 cursor-pointer flex justify-between items-center">
              {item.question}
            </summary>
            <p className="pb-4 m-0 text-gray-600 leading-relaxed">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
