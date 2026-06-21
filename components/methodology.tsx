"use client";

import { useEffect, useState } from "react";

const SOURCES = [
  { category: "Support Costs", source: "MetricNet Service Desk Benchmarks", detail: "$22 Tier 1 / ~$70 Tier 2 / $104 Tier 3" },
  { category: "Escalation Pricing", source: "HDI Industry Report", detail: "Tier-based pricing model" },
  { category: "Room Estimation", source: "Epiphan planning estimate", detail: "~64 rooms per 1K students" },
  { category: "Student Retention", source: "ben Hassen et al. 2025 (SAGE Open)", detail: "First-year attrition 12.3% to 5%, single cohort" },
  { category: "Staff Efficiency", source: "Campus Technology / Collegis Education", detail: "~43 rooms/person published benchmark" },
  { category: "ADA Compliance", source: "AudioEye / WebAIM; Accessible.org", detail: "97% gap rate; $5K to $20K typical settlements" },
  { category: "Downtime Costs", source: "Blended cost methodology", detail: "$500 blended avg per event (minor ~$100, major ~$2K+)" },
  { category: "AV Operations", source: "Epiphan AV Professional Survey 2025", detail: "500+ respondents, 4.6 tickets/room/year" },
  { category: "Reference Scale", source: "Epiphan case studies", detail: "NC State, UNLV, MTSU, NTNU at-scale deployments" },
];

const DEPLOYMENTS = [
  "NC State University: 300+ rooms, core team of 3",
  "UNLV: 200+ Pearl Nexus units, remote fleet management",
  "MTSU: 428 rooms",
  "NTNU: 700+ rooms, 42K students",
];

export function Methodology() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");

  // Format the date client-side only: a locale/timezone-formatted string would
  // otherwise differ between the server prerender and the client and trigger a
  // hydration mismatch, so we set it after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only value to avoid hydration mismatch, see comment above
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
        className="w-full flex items-center justify-between p-4 bg-surface-2 rounded-lg text-[13px] font-semibold text-ink-3 hover:bg-line transition-colors cursor-pointer"
      >
        <span>Methodology &amp; Sources</span>
        <span className="text-[16px]">{open ? "\u25B4" : "\u25BE"}</span>
      </button>

      {open && (
        <div className="bg-surface-2 rounded-b-lg px-5 pb-5 -mt-1">
          {/* Section 1: How We Calculate */}
          <div className="mb-4">
            <h4 className="text-[13px] font-bold text-ink-2 mb-1">
              How We Calculate
            </h4>
            <p className="text-[12px] text-ink-3 leading-relaxed">
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
            <h4 className="text-[13px] font-bold text-ink-2 mb-2">
              Sources
            </h4>
            <div className="border border-line rounded overflow-hidden">
              <div className="grid grid-cols-[140px_1fr_1fr] bg-line text-[10px] font-bold text-ink-2 uppercase tracking-wide">
                <div className="px-2.5 py-1.5">Category</div>
                <div className="px-2.5 py-1.5">Source</div>
                <div className="px-2.5 py-1.5">Detail</div>
              </div>
              {SOURCES.map((row, i) => (
                <div
                  key={row.category}
                  className={`grid grid-cols-[140px_1fr_1fr] text-[11px] text-ink-3 ${
                    i % 2 === 0 ? "bg-white" : "bg-surface-2"
                  }`}
                >
                  <div className="px-2.5 py-1.5 font-semibold text-ink-2">
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
            <h4 className="text-[13px] font-bold text-ink-2 mb-1">
              Reference Deployments
            </h4>
            <ul className="text-[12px] text-ink-3 space-y-0.5">
              {DEPLOYMENTS.map((d) => (
                <li key={d}>&#8226; {d}</li>
              ))}
            </ul>
          </div>

          {/* Section 4: Disclaimer */}
          <p className="text-[11px] text-ink-3 italic leading-relaxed">
            Figures represent conservative estimates. Actual exposure may vary
            based on institutional factors.
            {date && <> Generated {date}.</>}
          </p>
        </div>
      )}
    </div>
  );
}
