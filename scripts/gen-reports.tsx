// Generator logic — loaded via Vite SSR (see generate-account-reports.mjs) so
// the "@/" alias, TypeScript, and TSX all resolve the same way the app does.
//
// Produces, for every entry in lib/pipeline-scenarios.ts:
//   1. out/reports/<account>.pdf      — the branded Cost-of-Inaction report
//   2. docs/pipeline/account-roi-table.md — the ROI table + shareable URLs
//
// This is an ROI / cost-of-inaction model fed by real Clari calls, not a quote.

import React from "react";
import fs from "node:fs";
import path from "node:path";
import { renderToFile } from "@react-pdf/renderer";
import { calculate, formatCurrency, type CalculatorInputs } from "@/lib/calculator";
import { DEFAULT_INPUTS } from "@/lib/constants";
import { PIPELINE_SCENARIOS, type PipelineScenario } from "@/lib/pipeline-scenarios";
import { PdfReport } from "@/components/pdf-report";

const PROD_BASE = "https://epiphan-cost-calculator.vercel.app/";
const GENERATED_DATE = "June 19, 2026";

function toInputs(s: PipelineScenario): CalculatorInputs {
  return {
    rooms: s.rooms,
    equipmentAge: s.equipmentAge,
    lecturesPerWeek: s.lecturesPerWeek,
    teachWeeks: s.teachWeeks,
    students: s.students,
    tuition: s.tuition,
    itSalary: s.itSalary,
    currentFTE: s.currentFTE,
  };
}

/** Mirror of components/share-button.tsx buildShareUrl, pointed at production. */
function buildShareUrl(inputs: CalculatorInputs): string {
  const p = new URLSearchParams();
  if (inputs.rooms !== DEFAULT_INPUTS.rooms) p.set("rooms", String(inputs.rooms));
  if (inputs.equipmentAge !== DEFAULT_INPUTS.equipmentAge) p.set("age", inputs.equipmentAge);
  if (inputs.lecturesPerWeek !== DEFAULT_INPUTS.lecturesPerWeek) p.set("lpw", String(inputs.lecturesPerWeek));
  if (inputs.teachWeeks !== DEFAULT_INPUTS.teachWeeks) p.set("weeks", String(inputs.teachWeeks));
  if (inputs.students !== DEFAULT_INPUTS.students) p.set("students", String(inputs.students));
  if (inputs.tuition !== DEFAULT_INPUTS.tuition) p.set("tuition", String(inputs.tuition));
  if (inputs.itSalary !== DEFAULT_INPUTS.itSalary) p.set("salary", String(inputs.itSalary));
  if (inputs.currentFTE !== DEFAULT_INPUTS.currentFTE) p.set("fte", String(inputs.currentFTE));
  const qs = p.toString();
  return qs ? `${PROD_BASE}?${qs}` : PROD_BASE;
}

function slug(account: string): string {
  return account.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function mixSummary(m: { nano: number; nexus: number; nexusEc20: number; pearl2: number }): string {
  const parts: string[] = [];
  if (m.nano) parts.push(`${m.nano} Nano`);
  if (m.nexus) parts.push(`${m.nexus} Nexus`);
  if (m.nexusEc20) parts.push(`${m.nexusEc20} Nexus+EC20`);
  if (m.pearl2) parts.push(`${m.pearl2} Pearl-2`);
  return parts.join(", ") || "n/a";
}

export async function run(projectRoot: string): Promise<void> {
  const reportsDir = path.join(projectRoot, "out", "reports");
  const docsDir = path.join(projectRoot, "docs", "pipeline");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.mkdirSync(docsDir, { recursive: true });

  const rows: string[] = [];
  const details: string[] = [];

  // Sort by 3-year exposure descending so the biggest opportunities lead.
  const enriched = PIPELINE_SCENARIOS.map((scn) => {
    const inputs = toInputs(scn);
    return { scn, inputs, results: calculate(inputs) };
  }).sort((a, b) => b.results.threeYearCost - a.results.threeYearCost);

  for (const { scn, inputs, results } of enriched) {
    const file = path.join(reportsDir, `epiphan-cost-analysis-${slug(scn.account)}-${scn.rooms}rooms.pdf`);
    await renderToFile(
      React.createElement(PdfReport, { inputs, results, generatedDate: GENERATED_DATE }),
      file
    );

    const shareUrl = buildShareUrl(inputs);
    rows.push(
      `| ${scn.label} | ${scn.rep} | ${scn.rooms} | ${inputs.equipmentAge} | ` +
        `${formatCurrency(results.annualCost)} | ${formatCurrency(results.threeYearCost)} | ` +
        `${results.paybackMonths} mo | ${results.roi3Year.toLocaleString()}% | ` +
        `${formatCurrency(results.totalInvestment)} | ${mixSummary(results.roomMix)} | ` +
        `[link](${shareUrl}) |`
    );

    details.push(
      `### ${scn.account}\n` +
        `- **Rep / call:** ${scn.rep}, ${scn.callDate} (Clari \`${scn.callId}\`)\n` +
        `- **Products discussed:** ${scn.product}\n` +
        `- **Pain:** ${scn.pain}\n` +
        `- **Rooms basis:** ${scn.roomsBasis}\n` +
        `- **Inputs:** ${inputs.rooms} rooms, equipment age ${inputs.equipmentAge}, ` +
        `${inputs.students.toLocaleString()} students, ${formatCurrency(inputs.tuition)} tuition, ` +
        `${inputs.currentFTE} FTE\n` +
        `- **Result:** ${formatCurrency(results.annualCost)}/yr cost of inaction, ` +
        `${formatCurrency(results.threeYearCost)} over 3 yrs, ${results.paybackMonths}-month payback, ` +
        `${results.roi3Year.toLocaleString()}% 3-yr ROI\n` +
        `- **Recommended mix:** ${mixSummary(results.roomMix)} ` +
        `(${formatCurrency(results.totalInvestment)} total)\n` +
        `- **Share:** ${shareUrl}\n`
    );
  }

  const md =
    `# Account ROI Pipeline: Higher-Ed Deals from 2026 Sales Calls\n\n` +
    `Generated ${GENERATED_DATE} from substantive Clari calls worked by [redacted-rep] and [redacted-rep] ` +
    `(2026-02-01 to 2026-06-19). Each account's deployment size is call-sourced; campus profile fields ` +
    `(students, tuition, FTE, equipment age) are public figures or institution-type estimates, clamped to ` +
    `the calculator's valid ranges. This is a cost-of-inaction / ROI model, not a quote: the recommended ` +
    `product mix is generated from room count, not the SKUs proposed on the call.\n\n` +
    `Prices validated against the live Epiphan AI catalog on 2026-06-19: Pearl Nano $1,999, ` +
    `Pearl Nexus 256-SD (ESP1948) $3,999, EC20 $1,899, Pearl-2 $8,999.\n\n` +
    `| Account | Rep | Rooms | Age | Annual CoI | 3-Yr Exposure | Payback | 3-Yr ROI | Investment | Recommended Mix | Share URL |\n` +
    `|---|---|--:|--:|--:|--:|--:|--:|--:|---|---|\n` +
    rows.join("\n") +
    `\n\n## Account detail\n\n` +
    details.join("\n");

  fs.writeFileSync(path.join(docsDir, "account-roi-table.md"), md, "utf8");
  console.log(`Wrote ${enriched.length} PDF reports to out/reports/ and docs/pipeline/account-roi-table.md`);
}
