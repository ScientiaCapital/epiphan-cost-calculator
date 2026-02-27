"use client";

import { useEffect, useState } from "react";

export function Methodology() {
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
    <div className="mt-5 p-4 bg-[#f5f5f5] rounded-lg text-[11px] text-[#757575] leading-relaxed">
      <strong>Methodology &amp; Sources:</strong>{" "}
      MetricNet Service Desk Benchmarks (support costs: $22/$65/$104 by tier) &bull;{" "}
      HDI Industry Report (escalation tier pricing) &bull;{" "}
      IPEDS College Scorecard (room estimation: ~64 rooms/1K students) &bull;{" "}
      Springer Higher Education (lecture capture retention: 12.3% → 5%) &bull;{" "}
      Collegis Education / OculusIT (staff efficiency benchmarks) &bull;{" "}
      3Play Media / AudioEye (ADA compliance: 97% gap, $27K avg settlement) &bull;{" "}
      eCampus News / Cenero (downtime cost: $2K/event) &bull;{" "}
      Epiphan AV Professional Survey 2025 (500+ respondents, 47 rooms/person avg) &bull;{" "}
      Dartmouth OpenAV ($1.6M savings across 140 classrooms) &bull;{" "}
      Reference deployments: NC State (300+), UNLV (215), MTSU (428), NTNU (700 rooms).
      Figures represent conservative estimates — actual exposure may be higher.
      {date && <> Generated {date} for Epiphan Video BDR use.</>}
    </div>
  );
}
