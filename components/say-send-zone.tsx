"use client";

import { useState } from "react";
import type { CalculatorInputs, CalculatorResults } from "@/lib/calculator";
import { getVerticalConfig } from "@/lib/verticals";
import { AE_BOOKING_URL } from "@/lib/constants";
import { generateSdrNote, generateFollowupEmail } from "@/lib/sdr-note";

interface SaySendZoneProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
  /** Lights the "Send" step in the guidance rail once the rep takes an action. */
  onSent: () => void;
}

/** Short recommended-stack line. Cost verticals derive it from the room mix;
 *  fit verticals use the vertical's portfolio fit. */
function recommendedStack(r: CalculatorResults): { stack: string; note: string } {
  if (r.resultMode !== "cost") {
    const fit = getVerticalConfig(r.vertical).portfolioFit;
    return { stack: fit.hardware.slice(0, 2).join(" + "), note: fit.note };
  }
  const mix = r.roomMix;
  // Headline the single best-fit stack (the room mix's dominant product), not a
  // concatenation — the full per-product mix lives in the Details drawer.
  const stack =
    mix.nexusEc20 > 0 ? "EC20 + Pearl Nexus"
    : mix.nexus > 0 ? "Pearl Nexus"
    : mix.nano > 0 ? "Pearl Nano"
    : "Pearl-2";
  // (Per-product pricing detail lives in the Details drawer, not this line.)
  return {
    stack,
    note: "Camera in every room, pool encoders as you grow · Edge fleet mgmt free",
  };
}

const actionBtn =
  "py-2.5 px-3 text-[12.5px] font-semibold rounded-md border border-line bg-white text-ink-2 hover:border-ink-3 transition-colors cursor-pointer text-center";

export function SaySendZone({ inputs, results: r, onSent }: SaySendZoneProps) {
  const cfg = getVerticalConfig(r.vertical);
  const [copied, setCopied] = useState<null | "note" | "email">(null);
  const email = generateFollowupEmail(inputs, r);
  const rec = recommendedStack(r);

  async function copy(kind: "note" | "email") {
    const text = kind === "note" ? generateSdrNote(inputs, r) : email.body;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      onSent();
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("Copy this:", text);
    }
  }

  return (
    <div className="panel-card flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-auto p-4">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-4 mb-2.5">
          {r.resultMode === "cost" ? "What to ask next" : "What to quantify next"}
        </h3>
        {cfg.discoveryFocus.map((q) => (
          <div
            key={q}
            className="border border-line border-l-[3px] border-l-teal rounded-md px-3 py-2.5 mb-2 text-[13px] leading-snug text-ink-2 hover:bg-aqua-tint hover:border-l-green transition-colors"
          >
            {q}
          </div>
        ))}

        <div className="bg-surface-2 border border-line rounded-md px-3 py-2.5 mt-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-4">Recommended stack</div>
          <div className="text-[14px] font-semibold text-teal mt-0.5">{rec.stack}</div>
          <div className="text-[11px] text-ink-3 mt-1">{rec.note}</div>
        </div>

        <div className="text-[11px] text-ink-2 mt-3">
          <span className="font-semibold">Decision-maker:</span> {cfg.personas.atl.join(" · ")}
        </div>
        <div className="text-[11px] text-ink-2 mt-0.5">
          <span className="font-semibold">Champion:</span> {cfg.personas.btl.join(" · ")}
        </div>
      </div>

      <div className="flex-none p-3 border-t border-line grid grid-cols-2 gap-2 bg-white">
        <button type="button" onClick={() => copy("note")} className={actionBtn}>
          {copied === "note" ? "✓ Copied" : "Copy note"}
        </button>
        <button type="button" onClick={() => copy("email")} className={actionBtn}>
          {copied === "email" ? "✓ Copied" : "Copy email"}
        </button>
        <a href={email.mailto} onClick={onSent} className={actionBtn} aria-label="Open a prefilled email draft">
          Draft email
        </a>
        <a
          href={AE_BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={onSent}
          className="py-2.5 px-3 text-[12.5px] font-semibold rounded-md bg-green text-ink border border-green hover:bg-green-hover transition-colors text-center"
        >
          Book AE &rarr;
        </a>
      </div>
    </div>
  );
}
