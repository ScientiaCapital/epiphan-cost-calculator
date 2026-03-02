"use client";

import dynamic from "next/dynamic";
import type { CalculatorInputs, CalculatorResults } from "@/lib/calculator";

interface PdfDownloadButtonProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
}

/** Inner component — only loaded client-side (react-pdf crashes in Node SSR) */
const PdfDownloadButtonInner = dynamic(
  () => import("./pdf-download-button-inner").then((m) => m.PdfDownloadButtonInner),
  {
    ssr: false,
    loading: () => (
      <button
        disabled
        className="mt-3 w-full py-3 px-4 bg-[#1a2332] text-white font-semibold text-[14px] rounded-lg opacity-60 cursor-not-allowed flex items-center justify-center gap-2"
      >
        Preparing PDF...
      </button>
    ),
  }
);

export function PdfDownloadButton({ inputs, results }: PdfDownloadButtonProps) {
  return <PdfDownloadButtonInner inputs={inputs} results={results} />;
}
