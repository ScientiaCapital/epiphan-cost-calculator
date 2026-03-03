"use client";

import { useEffect, useState } from "react";

const SOURCES = [
  { category: "Support Costs", source: "MetricNet Service Desk Benchmarks", detail: "$22 Tier 1 / $65 Tier 2 / $104 Tier 3" },
  { category: "Escalation Pricing", source: "HDI Industry Report", detail: "Tier-based pricing model" },
  { category: "Room Estimation", source: "IPEDS College Scorecard", detail: "~64 rooms per 1K students" },
  { category: "Student Retention", source: "Springer Higher Education", detail: "Lecture capture reduces attrition 12.3% → 5%" },
  { category: "Staff Efficiency", source: "Collegis Education / OculusIT", detail: "Industry staffing benchmarks" },
  { category: "ADA Compliance", source: "3Play Media / AudioEye", detail: "97% gap rate, $27K avg settlement" },
  { category: "Downtime Costs", source: "Blended cost methodology", detail: "$500 blended avg per event (minor ~$100, major ~$2K+)" },
  { category: "AV Operations", source: "Epiphan AV Professional Survey 2025", detail: "500+ respondents, 47 rooms/person avg" },
  { category: "Cost Savings", source: "Dartmouth OpenAV", detail: "$1.6M saved across 140 classrooms" },
];

const DEPLOYMENTS = [
  "NC State University — 300+ rooms",
  "UNLV — 215 units, remote fleet management",
  "MTSU — 428 rooms",
  "NTNU — 700 rooms, 42K students",
];

export function Methodology() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-[#f5f5f5] rounded-lg text-[13px] font-semibold text-[#616161] hover:bg-[#eeeeee] transition-colors cursor-pointer"
      >
        <span>Methodology &amp; Sources</span>
        <span className="text-[16px]">{open ? "\u25B4" : "\u25BE"}</span>
      </button>

      {open && (
        <div className="bg-[#f5f5f5] rounded-b-lg px-5 pb-5 -mt-1">
          {/* Section 1: How We Calculate */}
          <div className="mb-4">
            <h4 className="text-[13px] font-bold text-[#424242] mb-1">
              How We Calculate
            </h4>
            <p className="text-[12px] text-[#616161] leading-relaxed">
              Our model estimates the hidden annual cost of maintaining aging AV
              infrastructure across three tiers: operational costs (support tickets,
              excess staffing, configuration labor), productivity impact (capture
              failures, classroom downtime), and institutional risk (ADA compliance
              exposure, at-risk retention revenue). Each category uses age-adjusted
              multipliers derived from industry research.
            </p>
          </div>

          {/* Section 2: Sources */}
          <div className="mb-4">
            <h4 className="text-[13px] font-bold text-[#424242] mb-2">
              Sources
            </h4>
            <div className="border border-[#e0e0e0] rounded overflow-hidden">
              <div className="grid grid-cols-[140px_1fr_1fr] bg-[#e0e0e0] text-[10px] font-bold text-[#424242] uppercase tracking-wide">
                <div className="px-2.5 py-1.5">Category</div>
                <div className="px-2.5 py-1.5">Source</div>
                <div className="px-2.5 py-1.5">Detail</div>
              </div>
              {SOURCES.map((row, i) => (
                <div
                  key={row.category}
                  className={`grid grid-cols-[140px_1fr_1fr] text-[11px] text-[#616161] ${
                    i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
                  }`}
                >
                  <div className="px-2.5 py-1.5 font-semibold text-[#424242]">
                    {row.category}
                  </div>
                  <div className="px-2.5 py-1.5">{row.source}</div>
                  <div className="px-2.5 py-1.5">{row.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Reference Deployments */}
          <div className="mb-4">
            <h4 className="text-[13px] font-bold text-[#424242] mb-1">
              Reference Deployments
            </h4>
            <ul className="text-[12px] text-[#616161] space-y-0.5">
              {DEPLOYMENTS.map((d) => (
                <li key={d}>&#8226; {d}</li>
              ))}
            </ul>
          </div>

          {/* Section 4: Disclaimer */}
          <p className="text-[11px] text-[#757575] italic leading-relaxed">
            Figures represent conservative estimates. Actual exposure may vary
            based on institutional factors.
            {date && <> Generated {date}.</>}
          </p>
        </div>
      )}
    </div>
  );
}
