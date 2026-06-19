"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/calculator";

interface CostCategoryProps {
  name: string;
  cost: number;
  barColor: "red" | "amber" | "blue";
  maxCost: number;
  children: React.ReactNode;
}

const BAR_COLORS = {
  red: "bg-[#F4716E]",
  amber: "bg-[#6651FC]",
  blue: "bg-[#0C3D34]",
};

export function CostCategory({ name, cost, barColor, maxCost, children }: CostCategoryProps) {
  const [open, setOpen] = useState(false);
  const barWidth = maxCost > 0 ? (cost / maxCost) * 100 : 0;

  return (
    <div
      className="px-5 py-4 border-b border-[#f5f5f5] last:border-b-0 cursor-pointer transition-colors hover:bg-[#fafafa]"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center gap-3">
        <div className="font-semibold text-[14px] flex items-center gap-2">
          <span
            className={`text-[10px] text-[#757575] inline-block transition-transform ${
              open ? "rotate-90" : ""
            }`}
          >
            &#9654;
          </span>
          {name}
        </div>
        <div className="font-bold text-[16px] text-[#170F30] whitespace-nowrap">
          {formatCurrency(cost)}
        </div>
      </div>

      <div className="mt-2 bg-[#eeeeee] rounded h-2 overflow-hidden">
        <div
          className={`h-full rounded transition-[width] duration-400 ${BAR_COLORS[barColor]}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className={`mt-2.5 text-[13px] text-[#333333] leading-relaxed [&_em]:text-[#5a5a5a] ${open ? "" : "hidden print:block"}`}>
        {children}
      </div>
    </div>
  );
}
