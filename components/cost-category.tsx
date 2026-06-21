"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/calculator";

interface CostCategoryProps {
  name: string;
  cost: number;
  barColor: "red" | "amber" | "blue";
  maxCost: number;
  /** Anchor id so the cockpit can deep-link a driver row to this category. */
  id?: string;
  children: React.ReactNode;
}

const BAR_COLORS = {
  red: "bg-coral",
  amber: "bg-indigo-bright",
  blue: "bg-teal",
};

export function CostCategory({ name, cost, barColor, maxCost, id, children }: CostCategoryProps) {
  const [open, setOpen] = useState(false);
  const barWidth = maxCost > 0 ? (cost / maxCost) * 100 : 0;

  return (
    <div
      id={id}
      style={{ scrollMarginTop: 12 }}
      className="px-5 py-4 border-b border-surface-2 last:border-b-0 cursor-pointer transition-colors hover:bg-surface-2"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center gap-3">
        <div className="font-semibold text-[14px] flex items-center gap-2">
          <span
            className={`text-[10px] text-ink-3 inline-block transition-transform ${
              open ? "rotate-90" : ""
            }`}
          >
            &#9654;
          </span>
          {name}
        </div>
        <div className="font-bold text-[16px] text-ink whitespace-nowrap">
          {formatCurrency(cost)}
        </div>
      </div>

      <div className="mt-2 bg-line rounded h-2 overflow-hidden">
        <div
          className={`h-full rounded transition-[width] duration-400 ${BAR_COLORS[barColor]}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className={`mt-2.5 text-[13px] text-ink-2 leading-relaxed [&_em]:text-ink-3 ${open ? "" : "hidden print:block"}`}>
        {children}
      </div>
    </div>
  );
}
