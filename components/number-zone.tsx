"use client";

import type { CalculatorResults } from "@/lib/calculator";
import { formatCurrency } from "@/lib/calculator";
import { getVerticalConfig, type Confidence } from "@/lib/verticals";
import { ConfidenceChip } from "./confidence-chip";

interface NumberZoneProps {
  results: CalculatorResults;
  rooms: number;
  /** Opens the Details drawer; pass an anchor id to deep-link to a category. */
  onOpenDetails: (anchor?: string) => void;
}

type Tier = "operational" | "productivity" | "institutional";
const TIER_VAR: Record<Tier, string> = {
  operational: "var(--color-teal)",
  productivity: "var(--color-coral)",
  institutional: "var(--color-indigo)",
};

/** Center cockpit zone — the cost-of-inaction hero + key metrics + a compact,
 *  color-coded cost-driver list (cost verticals). Fit verticals lead with the
 *  scoping framing instead of an un-calibrated dollar figure. */
export function NumberZone({ results: r, rooms, onOpenDetails }: NumberZoneProps) {
  const cfg = getVerticalConfig(r.vertical);

  if (r.resultMode !== "cost") {
    const fit = cfg.portfolioFit;
    const ill = cfg.illustrative;
    return (
      <div className="flex flex-col gap-3 min-h-0 flex-1">
        <div className="panel-card p-5 text-white border-0" style={{ background: "linear-gradient(160deg,var(--color-ink) 0%,var(--color-teal-deep) 100%)" }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-aqua">
            {cfg.label} &middot; discovery mode
          </div>
          {ill ? (
            <>
              <div className="mt-2 mb-1">
                <ConfidenceChip level={ill.confidence} label={`${ill.chip} · ${ill.unitNote}`} />
              </div>
              <div className="mono text-[clamp(30px,3.6vw,42px)] font-semibold tracking-[-0.02em] leading-none my-1.5">
                {ill.range}
              </div>
              <div className="text-[12px] text-indigo-soft">illustrative, {ill.unitWord}</div>
              <p className="text-[12.5px] text-indigo-soft mt-3 leading-relaxed">{ill.note}</p>
            </>
          ) : (
            <>
              <div className="text-[30px] font-semibold leading-none my-2">Let&rsquo;s scope it</div>
              <div className="text-[13px] text-indigo-soft">
                A tailored $ model for this vertical is calibrating &mdash; lead with the fit and the
                questions that get us there for your {rooms.toLocaleString()} {cfg.labels.unitsLabel.toLowerCase()}.
              </div>
            </>
          )}
        </div>
        <div className="panel-card p-4 flex-1 min-h-0 overflow-auto">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-4 mb-2">Recommended fit</div>
          <ul className="space-y-1 text-[13px]">
            {fit.hardware.map((h) => <li key={h} className="font-semibold text-ink-1">{h}</li>)}
            {fit.software.map((s) => <li key={s} className="text-teal">{s}</li>)}
          </ul>
          <p className="text-[12px] text-ink-4 italic mt-3">{fit.note}</p>
          <p className="text-[11px] text-ink-4 mt-3">Run the discovery prompts in Operate, then capture answers into the note.</p>
        </div>
      </div>
    );
  }

  const drivers = ([
    { name: "Student retention revenue", cost: r.retentionCost, tier: "institutional", anchor: "cat-retention", conf: "estimated" },
    { name: "Failed & missed captures", cost: r.missedCaptureCost, tier: "productivity", anchor: "cat-captures", conf: "calibrated" },
    { name: "Classroom downtime", cost: r.downtimeCost, tier: "productivity", anchor: "cat-downtime", conf: "calibrated" },
    { name: "Manual operation", cost: r.staffCost, tier: "operational", anchor: "cat-manual", conf: "asserted" },
    { name: "Configuration & maint. labor", cost: r.maintenanceCost, tier: "operational", anchor: "cat-config", conf: "asserted" },
    { name: "ADA compliance exposure", cost: r.adaCost, tier: "institutional", anchor: "cat-ada", conf: "asserted" },
    { name: "AV support tickets", cost: r.ticketCost, tier: "operational", anchor: "cat-tickets", conf: "asserted" },
  ] as { name: string; cost: number; tier: Tier; anchor: string; conf: Confidence }[])
    .filter((d) => d.cost > 0)
    .sort((a, b) => b.cost - a.cost);

  return (
    <div className="flex flex-col gap-3 min-h-0 flex-1">
      {/* Hero — floor-led. Lead with the defensible operational floor; show the
          single-study retention layer as a subordinate at-risk line; full
          exposure reads underneath. */}
      <div className="panel-card p-5 text-white border-0" style={{ background: "linear-gradient(160deg,var(--color-ink) 0%,var(--color-teal-deep) 100%)" }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-green">
          Annual cost of inaction &middot; {cfg.label}
        </div>
        <div className="mono text-[clamp(36px,4.2vw,52px)] font-semibold tracking-[-0.03em] leading-none my-1.5">
          {formatCurrency(r.annualCostExRetention)}
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[12px] text-indigo-soft">operational floor</span>
          <ConfidenceChip level="calibrated" label="mostly calibrated" />
        </div>

        {r.retentionCost > 0 && (
          <div className="flex items-baseline gap-2.5 flex-wrap mt-3 pt-3 border-t border-dashed border-white/15">
            <span className="text-[12.5px] text-coral font-semibold">+ revenue at risk</span>
            <span className="mono text-[18px] text-coral">{formatCurrency(r.retentionCost)}</span>
            <ConfidenceChip level="estimated" label="single study" />
          </div>
        )}

        <div className="flex items-baseline gap-2.5 mt-3 pt-3 border-t border-white/25">
          <span className="mono text-[22px] font-semibold">{formatCurrency(r.annualCost)}</span>
          <span className="text-[10px] uppercase tracking-[0.06em] text-indigo-soft">full exposure</span>
        </div>
        <div className="flex gap-4 mt-3 text-[12px] text-indigo-soft">
          <span>3-year <b className="text-white font-semibold mono">{formatCurrency(r.threeYearCost)}</b></span>
          <span>payback <b className="text-white font-semibold mono">{r.paybackMonths} mo</b></span>
          <span>ROI <b className="text-white font-semibold mono">{r.roi3Year}%</b></span>
        </div>
      </div>

      {/* Cost drivers */}
      <div className="panel-card p-4 flex-1 min-h-0 flex flex-col">
        <div className="flex justify-between items-baseline mb-2.5">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-4">Cost drivers</h3>
          <button onClick={() => onOpenDetails()} className="text-[10px] text-ink-4 hover:text-teal cursor-pointer">click a row for detail</button>
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          {drivers.map((d) => (
            <button
              key={d.name} onClick={() => onOpenDetails(d.anchor)}
              className="w-full grid grid-cols-[1fr_auto_auto] items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-surface-2 transition-colors text-left cursor-pointer"
            >
              <span className="text-[12.5px] text-ink-2 truncate flex items-center gap-2 min-w-0">
                <span className="w-[7px] h-[7px] rounded-[2px] inline-block flex-none" style={{ background: TIER_VAR[d.tier] }} />
                <span className="truncate">{d.name}</span>
              </span>
              <span className="text-[13px] font-semibold text-ink-1 text-right min-w-[74px] mono">{formatCurrency(d.cost)}</span>
              <ConfidenceChip level={d.conf} />
            </button>
          ))}
        </div>
        <div className="flex gap-3.5 mt-2.5 pt-2.5 border-t border-line text-[10px] text-ink-4">
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-[2px]" style={{ background: "var(--color-teal)" }} />Operational</span>
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-[2px]" style={{ background: "var(--color-coral)" }} />Productivity</span>
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-[2px]" style={{ background: "var(--color-indigo)" }} />Institutional risk</span>
        </div>
      </div>
    </div>
  );
}
