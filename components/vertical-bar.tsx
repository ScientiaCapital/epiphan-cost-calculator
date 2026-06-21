"use client";

import { VERTICAL_CONFIGS, type Vertical, type Framing } from "@/lib/verticals";
import type { CalculatorInputs } from "@/lib/calculator";

interface VerticalBarProps {
  vertical: Vertical;
  framing: Framing;
  onSelect: (partial: Partial<CalculatorInputs>) => void;
}

// Flat, priority-ordered row in declaration order (Higher Ed first, then the
// fit verticals). Each button carries a mode tag — "cost model" vs "fit" — so
// the calibrated-vs-discovery signal survives without a lopsided two-group split.
const VERTICALS = Object.values(VERTICAL_CONFIGS);

/** Vertical selector + framing toggle. Selecting a vertical also resets framing
 *  to that vertical's natural default (aging vs greenfield). */
export function VerticalBar({ vertical, framing, onSelect }: VerticalBarProps) {
  const renderButton = (c: (typeof VERTICALS)[number]) => {
    const active = c.id === vertical;
    const isCost = c.mode === "cost";
    return (
      <button
        key={c.id}
        type="button"
        aria-pressed={active}
        onClick={() => onSelect({ vertical: c.id, framing: c.defaultFraming })}
        className={`w-full flex items-center justify-between gap-2 py-2 px-3 border-2 rounded-md cursor-pointer text-left transition-all ${
          active ? "border-green bg-green-tint" : "border-line bg-white hover:border-green"
        }`}
      >
        <span className={`text-[13px] font-semibold ${active ? "text-teal-deep" : "text-ink-1"}`}>{c.label}</span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 border ${
            active
              ? isCost
                ? "bg-teal text-white border-teal"
                : "bg-slate text-white border-slate"
              : "border-line text-ink-4"
          }`}
        >
          {isCost ? "cost model" : "fit"}
        </span>
      </button>
    );
  };

  return (
    <div className="mb-4">
      <div role="group" aria-label="Vertical" className="flex flex-col gap-2">
        {VERTICALS.map(renderButton)}
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
