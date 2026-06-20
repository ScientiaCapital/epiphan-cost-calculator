"use client";

import { useState } from "react";
import type { CalculatorInputs, CalculatorResults } from "@/lib/calculator";
import { generateSdrNote, generateFollowupEmail } from "@/lib/sdr-note";

interface SdrActionsProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
}

/** SDR cockpit actions: copy a clean note (HubSpot/Nooks/Docs), copy a tailored
 *  follow-up email, open a prefilled draft, or download the note as a .txt.
 *  All client-side + deterministic — the MCP-powered transcript pull and CRM
 *  write are Phase 2 (server-side). */
export function SdrActions({ inputs, results }: SdrActionsProps) {
  const [copied, setCopied] = useState<null | "note" | "email">(null);

  async function copy(kind: "note" | "email") {
    const text =
      kind === "note"
        ? generateSdrNote(inputs, results)
        : generateFollowupEmail(inputs, results).body;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("Copy this:", text);
    }
  }

  function download() {
    const text = generateSdrNote(inputs, results);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `epiphan-${results.vertical}-${inputs.rooms}-units.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const email = generateFollowupEmail(inputs, results);
  const btn =
    "py-2.5 px-3 text-[13px] font-semibold rounded-lg border-2 border-[#170F30] text-[#170F30] bg-white hover:bg-[#170F30] hover:text-white transition-colors cursor-pointer text-center";

  return (
    <div className="mt-5">
      <div className="text-[11px] font-bold uppercase tracking-wide text-[#5a6b7b] mb-2">
        SDR follow-up
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button type="button" onClick={() => copy("note")} className={btn}>
          {copied === "note" ? "✓ Copied" : "Copy note"}
        </button>
        <button type="button" onClick={() => copy("email")} className={btn}>
          {copied === "email" ? "✓ Copied" : "Copy email"}
        </button>
        <a href={email.mailto} className={btn} aria-label="Open a prefilled email draft">
          Draft email
        </a>
        <button type="button" onClick={download} className={btn}>
          Download
        </button>
      </div>
      <p className="text-[11px] text-[#8a8a8a] italic mt-2">
        Paste into HubSpot, Nooks, or your notes. Transcript-aware drafting &amp; one-click CRM save
        arrive once integrations are connected.
      </p>
    </div>
  );
}
