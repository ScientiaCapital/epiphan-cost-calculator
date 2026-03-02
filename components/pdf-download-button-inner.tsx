"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import type { CalculatorInputs, CalculatorResults } from "@/lib/calculator";
import { PdfReport } from "./pdf-report";

interface Props {
  inputs: CalculatorInputs;
  results: CalculatorResults;
}

function getFilename(rooms: number): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `epiphan-cost-analysis-${rooms}rooms-${yyyy}-${mm}-${dd}.pdf`;
}

function getGeneratedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PdfDownloadButtonInner({ inputs, results }: Props) {
  const generatedDate = getGeneratedDate();

  return (
    <PDFDownloadLink
      document={
        <PdfReport
          inputs={inputs}
          results={results}
          generatedDate={generatedDate}
        />
      }
      fileName={getFilename(inputs.rooms)}
      className="mt-3 w-full py-3 px-4 bg-[#1a2332] text-white font-semibold text-[14px] rounded-lg hover:bg-[#263346] transition-colors cursor-pointer flex items-center justify-center gap-2 no-underline"
    >
      {({ loading }) =>
        loading ? "Preparing PDF..." : "\u{1F4C4} Download PDF Report"
      }
    </PDFDownloadLink>
  );
}
