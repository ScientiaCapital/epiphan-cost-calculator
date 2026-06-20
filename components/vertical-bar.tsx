"use client";

import { VERTICAL_CONFIGS, getVerticalConfig, type Vertical, type Framing } from "@/lib/verticals";
import type { CalculatorInputs } from "@/lib/calculator";

interface VerticalBarProps {
  vertical: Vertical;
  framing: Framing;
  onSelect: (partial: Partial<CalculatorInputs>) => void;
}

const VERTICALS = Object.values(VERTICAL_CONFIGS);

/** Vertical selector + framing toggle. Selecting a vertical also resets framing
 *  to that vertical's natural default (aging vs greenfield). */
export function VerticalBar({ vertical, framing, onSelect }: VerticalBarProps) {
  return (
    <div className="mb-4">
      <div role="group" aria-label="Choose a vertical" className="flex flex-wrap gap-2">
        {VERTICALS.map((c) => {
          const active = c.id === vertical;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect({ vertical: c.id, framing: c.defaultFraming })}
              className={`flex-1 min-w-[120px] py-2 px-2 text-[12px] font-bold uppercase tracking-wide border-2 rounded-md cursor-pointer text-center transition-all ${
                active
                  ? "border-[#83CE41] bg-[#D4F4C1] text-[#170F30]"
                  : "border-[#e0e0e0] bg-white hover:border-[#83CE41]"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5a6b7b]">Framing</span>
        {(["aging", "greenfield"] as Framing[]).map((f) => {
          const active = f === framing;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect({ framing: f })}
              className={`py-1 px-3 text-[11px] font-semibold rounded-full border transition-all cursor-pointer ${
                active
                  ? "border-[#0C3D34] bg-[#0C3D34] text-white"
                  : "border-[#e0e0e0] bg-white text-[#5a5a5a] hover:border-[#0C3D34]"
              }`}
            >
              {f === "aging" ? "Aging / replace" : "Greenfield / new build"}
            </button>
          );
        })}
        <span className="text-[11px] text-[#8a8a8a] italic ml-1">
          {getVerticalConfig(vertical).mode === "fit"
            ? "fit & discovery — $ math calibrating"
            : "full cost-of-inaction model"}
        </span>
      </div>
    </div>
  );
}
