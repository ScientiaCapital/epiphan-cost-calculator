// ── SDR Note + Follow-up Email Generation ───────────────────────────────
// Turns a calculation into (a) a clean plain-text note an SDR pastes into
// HubSpot / Nooks / Google Docs, and (b) a tailored follow-up email with a
// prefilled mailto: link. Pure + deterministic (no network, no MCP) so it runs
// in the browser and is fully testable. The MCP-powered transcript pull + CRM
// write are Phase 2 (server-side).
//
// BUYER-FACING GUARDRAIL: never the AV-matrix mechanism (matrix/switchboard/
// routing switch) or third-party brands (CMS/competitor names) — "your CMS/LMS";
// the pooled figure is "a more affordable path — a starting point, not a quote."

import { formatCurrency, type CalculatorInputs, type CalculatorResults } from "./calculator";
import { getVerticalConfig } from "./verticals";
import { AE_BOOKING_URL } from "./constants";

function topCategories(results: CalculatorResults, n: number): string[] {
  return [...results.categories]
    .sort((a, b) => b.cost - a.cost)
    .slice(0, n)
    .map((c) => `  • ${c.name}: ${formatCurrency(c.cost)}/yr`);
}

/**
 * A clean note for HubSpot / Nooks / Google Docs. The cost vertical (Higher
 * Education — flagships through budget-constrained two-year colleges) gets the
 * dollar story; fit verticals (Live Events, Corporate, Broadcast) get the
 * recommended portfolio + discovery angles instead of an un-calibrated number.
 */
export function generateSdrNote(
  inputs: CalculatorInputs,
  results: CalculatorResults,
): string {
  const cfg = getVerticalConfig(results.vertical);
  const units = inputs.rooms.toLocaleString();
  const L: string[] = [];

  L.push(`EPIPHAN — ${cfg.label} (${results.framing === "greenfield" ? "new build / per-project" : "current setup"})`);
  L.push("=".repeat(48));
  L.push(`${cfg.labels.profileTitle}: ${units} ${cfg.labels.unitsLabel.toLowerCase()} · ~${inputs.equipmentAge}yr equipment`);
  L.push("");

  if (results.resultMode === "cost") {
    L.push(`COST OF INACTION`);
    L.push(`  Annual: ${formatCurrency(results.annualCost)}`);
    L.push(`  3-year cumulative: ${formatCurrency(results.threeYearCost)}`);
    L.push("");
    L.push("TOP DRIVERS");
    L.push(...topCategories(results, 3));
    L.push("");
    L.push("INVESTMENT OPTIONS");
    L.push(`  • Room-by-room: ${formatCurrency(results.totalInvestment)} (${formatCurrency(results.blendedPerRoom)}/room)`);
    if (results.showEc20DirectPath) {
      L.push(`  • Start simple — a camera in every room, no encoder, straight to your CMS: ${formatCurrency(results.ec20DirectInvestment)}`);
    }
    if (results.showPooledPath) {
      L.push(`  • A more affordable path (starting point, not a quote): ~${formatCurrency(results.pooledInvestment)}`);
    }
    L.push("");
    L.push(`ROI: ${results.paybackMonths}-month payback · ${results.roi3Year.toLocaleString()}% 3-yr ROI · ${results.hoursReclaimed.toLocaleString()} IT hours/yr reclaimed`);
  } else {
    L.push("RECOMMENDED FIT");
    cfg.portfolioFit.hardware.forEach((h) => L.push(`  • ${h}`));
    cfg.portfolioFit.software.forEach((s) => L.push(`  • ${s}`));
    L.push(`  ${cfg.portfolioFit.note}`);
    L.push("");
    L.push("WHAT TO QUANTIFY NEXT");
    cfg.discoveryFocus.forEach((d) => L.push(`  • ${d}`));
  }

  L.push("");
  L.push(`Next step: 20 min with an Epiphan account executive → ${AE_BOOKING_URL}`);
  return L.join("\n");
}

export interface FollowupEmail {
  subject: string;
  body: string;
  /** Prefilled mailto: link (no recipient — the SDR adds it). */
  mailto: string;
}

/**
 * A tailored follow-up email. Phase 1 fills it from the calculation; Phase 2
 * will personalize the opener from the Nooks/Clari call transcript server-side.
 */
export function generateFollowupEmail(
  inputs: CalculatorInputs,
  results: CalculatorResults,
): FollowupEmail {
  const cfg = getVerticalConfig(results.vertical);
  const units = inputs.rooms.toLocaleString();

  const subject =
    results.resultMode === "cost"
      ? `Your ${units}-${cfg.labels.unitsLabel.toLowerCase().replace(/s$/, "")} analysis: ${formatCurrency(results.annualCost)}/yr, ${results.paybackMonths}-mo payback`
      : `Following up: a simpler ${cfg.label.toLowerCase()} capture setup`;

  const lines: string[] = [];
  lines.push("Hi [name],");
  lines.push("");
  lines.push(`Great talking through your ${cfg.label.toLowerCase()} setup. Quick recap of what we covered:`);
  lines.push("");

  if (results.resultMode === "cost") {
    lines.push(`Across your ${units} ${cfg.labels.unitsLabel.toLowerCase()}, aging AV is quietly costing about ${formatCurrency(results.annualCost)} a year — ${formatCurrency(results.threeYearCost)} over three.`);
    lines.push("");
    lines.push("The biggest drivers:");
    topCategories(results, 3).forEach((c) => lines.push(c.replace(/^ {2}/, "")));
    lines.push("");
    lines.push(`A standardized refresh pays for itself in about ${results.paybackMonths} months (${results.roi3Year.toLocaleString()}% 3-year ROI).`);
    if (results.showEc20DirectPath || results.showPooledPath) {
      lines.push("");
      lines.push("And if budget is tight, there are lighter ways in — happy to walk through them.");
    }
  } else {
    lines.push(`For a setup like yours, here's what we'd typically reach for:`);
    cfg.portfolioFit.hardware.concat(cfg.portfolioFit.software).forEach((p) => lines.push(`• ${p}`));
    lines.push("");
    lines.push(cfg.portfolioFit.note);
  }

  lines.push("");
  lines.push(`Worth 20 minutes to map it to your exact rooms? ${AE_BOOKING_URL}`);
  lines.push("");
  lines.push("Best,");
  lines.push("[your name] · Epiphan Video");

  const body = lines.join("\n");
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { subject, body, mailto };
}
