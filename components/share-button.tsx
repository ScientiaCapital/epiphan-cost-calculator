"use client";

import { useState } from "react";
import type { CalculatorInputs } from "@/lib/calculator";
import { DEFAULT_INPUTS } from "@/lib/constants";

interface ShareButtonProps {
  inputs: CalculatorInputs;
}

/** Build a URL with only non-default inputs as query params */
function buildShareUrl(inputs: CalculatorInputs): string {
  const params = new URLSearchParams();

  if (inputs.rooms !== DEFAULT_INPUTS.rooms) params.set("rooms", String(inputs.rooms));
  if (inputs.equipmentAge !== DEFAULT_INPUTS.equipmentAge) params.set("age", inputs.equipmentAge);
  if (inputs.lecturesPerWeek !== DEFAULT_INPUTS.lecturesPerWeek) params.set("lpw", String(inputs.lecturesPerWeek));
  if (inputs.teachWeeks !== DEFAULT_INPUTS.teachWeeks) params.set("weeks", String(inputs.teachWeeks));
  if (inputs.students !== DEFAULT_INPUTS.students) params.set("students", String(inputs.students));
  if (inputs.tuition !== DEFAULT_INPUTS.tuition) params.set("tuition", String(inputs.tuition));
  if (inputs.itSalary !== DEFAULT_INPUTS.itSalary) params.set("salary", String(inputs.itSalary));
  if (inputs.currentFTE !== DEFAULT_INPUTS.currentFTE) params.set("fte", String(inputs.currentFTE));

  const qs = params.toString();
  const base = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
  return qs ? `${base}?${qs}` : base;
}

export function ShareButton({ inputs }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = buildShareUrl(inputs);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="mt-5 w-full py-3 px-4 bg-[#1a2332] text-white font-semibold text-[14px] rounded-lg hover:bg-[#263346] transition-colors cursor-pointer flex items-center justify-center gap-2"
    >
      {copied ? (
        <>&#10003; Link Copied — Send It</>
      ) : (
        <>&#128279; Share This Analysis</>
      )}
    </button>
  );
}

export { buildShareUrl };
