"use client";

import { useState } from "react";
import { HUBSPOT_MEETING_URL } from "@/lib/constants";

const services = [
  { label: "General Booking", param: "general" },
  { label: "Manure Removal", param: "manure" },
  { label: "Dumpster / Delivery", param: "dumpster" },
  { label: "On\u2011site Estimate", param: "estimate" },
];

export default function HubSpotCalendar() {
  const [src, setSrc] = useState(HUBSPOT_MEETING_URL);

  return (
    <section id="calendar" className="py-15 px-5 max-w-[1200px] mx-auto text-center max-md:py-10 max-md:px-4">
      <h2 className="text-2xl max-md:text-xl">Schedule &amp; Availability</h2>
      <p>Pick a service and a time that works for you.</p>
      <img
        src="/logo.png"
        alt="My Horse Farm logo"
        className="w-[160px] h-auto mb-3 mx-auto"
      />
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {services.map((svc) => (
          <button
            key={svc.param}
            onClick={() =>
              setSrc(`${HUBSPOT_MEETING_URL}&service=${svc.param}`)
            }
            className="px-4 py-2 bg-primary text-white rounded font-semibold hover:bg-primary-dark transition-colors cursor-pointer border-none"
          >
            {svc.label}
          </button>
        ))}
      </div>
      <div className="min-h-[760px] max-md:min-h-[600px]">
        <iframe
          src={src}
          className="w-full min-h-[760px] max-md:min-h-[600px] border-0 rounded-xl"
          title="Book with My Horse Farm"
          loading="lazy"
        />
      </div>
    </section>
  );
}
