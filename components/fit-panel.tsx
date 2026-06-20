"use client";

import type { CalculatorInputs, CalculatorResults } from "@/lib/calculator";
import { getVerticalConfig } from "@/lib/verticals";
import { AE_BOOKING_URL } from "@/lib/constants";

interface FitPanelProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
}

/** Results view for "fit" verticals (Live Events, Corporate, Broadcast): show the
 *  recommended portfolio + discovery angles instead of an un-calibrated dollar
 *  figure. No invented numbers — that's the guardrail. */
export function FitPanel({ inputs, results }: FitPanelProps) {
  const cfg = getVerticalConfig(results.vertical);
  const fit = cfg.portfolioFit;

  return (
    <section aria-label={`${cfg.label} recommended fit`} className="mb-5">
      <div className="text-center p-5 bg-[#170F30] rounded-[10px] mb-5">
        <div className="text-[12px] font-bold text-[#83CE41] uppercase tracking-widest">
          {cfg.label} · {results.framing === "greenfield" ? "New build / per-project" : "Current setup"}
        </div>
        <div className="text-[20px] font-extrabold text-white leading-snug my-2">
          Let&rsquo;s scope the right setup for your {inputs.rooms.toLocaleString()}{" "}
          {cfg.labels.unitsLabel.toLowerCase()}
        </div>
        <div className="text-[13px] text-[#b8b4d9]">
          A tailored cost model for this vertical is in the works &mdash; here&rsquo;s the fit and the
          questions that get us there.
        </div>
      </div>

      <div className="bg-white rounded-lg border-2 border-[#83CE41] p-4 mb-4">
        <h3 className="text-[14px] font-bold text-[#170F30] mb-2">&#9989; Recommended fit</h3>
        <ul className="space-y-1 mb-2">
          {fit.hardware.map((h) => (
            <li key={h} className="text-[13px] text-[#424242]">
              <span className="font-semibold text-[#170F30]">{h}</span>
            </li>
          ))}
          {fit.software.map((s) => (
            <li key={s} className="text-[13px] text-[#0C3D34]">{s}</li>
          ))}
        </ul>
        <p className="text-[13px] text-[#5a5a5a] italic">{fit.note}</p>
      </div>

      <div className="bg-white rounded-lg border-2 border-[#0C3D34] p-4 mb-4">
        <h3 className="text-[14px] font-bold text-[#0C3D34] mb-2">What to quantify next</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
          {cfg.discoveryFocus.map((d) => (
            <li key={d} className="text-[13px] text-[#424242] flex gap-1.5">
              <span className="text-[#0C3D34]">&bull;</span> {d}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[#f5f7f6] rounded-lg p-4 mb-4">
        <h3 className="text-[12px] font-bold uppercase tracking-wide text-[#5a6b7b] mb-1.5">
          Who to bring into the room
        </h3>
        <p className="text-[13px] text-[#424242]">
          <span className="font-semibold">Decision-maker:</span> {cfg.personas.atl.join(" · ")}
        </p>
        <p className="text-[13px] text-[#424242]">
          <span className="font-semibold">Champion:</span> {cfg.personas.btl.join(" · ")}
        </p>
      </div>

      <a
        href={AE_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 py-2.5 px-4 bg-[#0C3D34] text-white font-semibold text-[13px] rounded-lg hover:bg-[#0a322b] transition-colors"
      >
        Talk to an Epiphan AE &rarr;
      </a>
    </section>
  );
}
