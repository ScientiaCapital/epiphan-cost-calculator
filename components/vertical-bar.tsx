"use client";

import { VERTICAL_CONFIGS, type Vertical, type Framing } from "@/lib/verticals";
import type { CalculatorInputs } from "@/lib/calculator";

interface VerticalBarProps {
  vertical: Vertical;
  framing: Framing;
  onSelect: (partial: Partial<CalculatorInputs>) => void;
}

const VERTICALS = Object.values(VERTICAL_CONFIGS);

// Two natural groups, derived from each vertical's result mode so the split
// stays in lock-step with the cost engine: "cost" = calibrated academic dollar
// model, "fit" = positioning/discovery. A future vertical sorts itself here.
const ACADEMIC = VERTICALS.filter((c) => c.mode === "cost");
const OTHER = VERTICALS.filter((c) => c.mode === "fit");

const GROUP_CAPTION = "text-[11px] font-semibold uppercase tracking-wide text-ink-3";

/** Vertical selector + framing toggle. Selecting a vertical also resets framing
 *  to that vertical's natural default (aging vs greenfield). */
export function VerticalBar({ vertical, framing, onSelect }: VerticalBarProps) {
  const renderButton = (c: (typeof VERTICALS)[number]) => {
    const active = c.id === vertical;
    return (
      <button
        key={c.id}
        type="button"
        aria-pressed={active}
        onClick={() => onSelect({ vertical: c.id, framing: c.defaultFraming })}
        className={`flex-1 min-w-0 py-2 px-2 text-[11px] font-bold uppercase tracking-wide border-2 rounded-md cursor-pointer text-center transition-all ${
          active
            ? "border-green bg-green-tint text-ink"
            : "border-line bg-white hover:border-green"
        }`}
      >
        {c.label}
      </button>
    );
  };

  return (
    <div className="mb-4">
      <div className="mb-3">
        <span className={GROUP_CAPTION}>Academic — full cost model</span>
        <div role="group" aria-label="Academic verticals" className="flex flex-wrap gap-2 mt-1">
          {ACADEMIC.map(renderButton)}
        </div>
      </div>

      <div>
        <span className={GROUP_CAPTION}>Other — fit &amp; discovery</span>
        <div role="group" aria-label="Other verticals" className="flex flex-wrap gap-2 mt-1">
          {OTHER.map(renderButton)}
        </div>
      </div>

      <div className="mt-3">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-3 mb-1">Framing</span>
        <div role="group" aria-label="Framing" className="flex rounded-md border border-line overflow-hidden">
          {(["aging", "greenfield"] as Framing[]).map((f) => {
            const active = f === framing;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect({ framing: f })}
                title={f === "aging" ? "Aging / replace" : "Greenfield / new build"}
                className={`flex-1 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                  f === "greenfield" ? "border-l border-line" : ""
                } ${active ? "bg-teal text-white" : "bg-white text-ink-3 hover:bg-surface-2"}`}
              >
                {f === "aging" ? "Aging" : "Greenfield"}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
