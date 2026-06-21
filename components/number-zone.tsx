"use client";

import type { CalculatorResults } from "@/lib/calculator";
import { formatCurrency, formatCompact } from "@/lib/calculator";
import { getVerticalConfig } from "@/lib/verticals";

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
    return (
      <div className="flex flex-col gap-3 min-h-0 flex-1">
        <div className="panel-card p-5 text-white border-0" style={{ background: "linear-gradient(160deg,var(--color-ink) 0%,var(--color-teal-deep) 100%)" }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-aqua">
            Fit &amp; discovery &middot; {cfg.label}
          </div>
          <div className="text-[30px] font-semibold leading-none my-2">Let&rsquo;s scope it</div>
          <div className="text-[13px] text-indigo-soft">
            A tailored $ model for this vertical is calibrating &mdash; lead with the fit and the
            questions that get us there for your {rooms.toLocaleString()} {cfg.labels.unitsLabel.toLowerCase()}.
          </div>
        </div>
        <div className="panel-card p-4 flex-1 min-h-0 overflow-auto">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-4 mb-2">Recommended fit</div>
          <ul className="space-y-1 text-[13px]">
            {fit.hardware.map((h) => <li key={h} className="font-semibold text-ink-1">{h}</li>)}
            {fit.software.map((s) => <li key={s} className="text-teal">{s}</li>)}
          </ul>
          <p className="text-[12px] text-ink-4 italic mt-3">{fit.note}</p>
        </div>
      </div>
    );
  }

  const drivers = ([
    { name: "Student retention revenue", cost: r.retentionCost, tier: "institutional", anchor: "cat-retention" },
    { name: "Failed & missed captures", cost: r.missedCaptureCost, tier: "productivity", anchor: "cat-captures" },
    { name: "Classroom downtime", cost: r.downtimeCost, tier: "productivity", anchor: "cat-downtime" },
    { name: "Manual operation", cost: r.staffCost, tier: "operational", anchor: "cat-manual" },
    { name: "Configuration & maint. labor", cost: r.maintenanceCost, tier: "operational", anchor: "cat-config" },
    { name: "ADA compliance exposure", cost: r.adaCost, tier: "institutional", anchor: "cat-ada" },
    { name: "AV support tickets", cost: r.ticketCost, tier: "operational", anchor: "cat-tickets" },
  ] as { name: string; cost: number; tier: Tier; anchor: string }[])
    .filter((d) => d.cost > 0)
    .sort((a, b) => b.cost - a.cost);
  const maxCost = Math.max(...drivers.map((d) => d.cost), 1);

  return (
    <div className="flex flex-col gap-3 min-h-0 flex-1">
      {/* Hero */}
      <div className="panel-card p-5 text-white border-0" style={{ background: "linear-gradient(160deg,var(--color-ink) 0%,var(--color-teal-deep) 100%)" }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-green">
          Annual cost of inaction &middot; {cfg.label}
        </div>
        <div className="mono text-[clamp(38px,4.4vw,54px)] font-semibold tracking-[-0.03em] leading-none my-1.5">
          {formatCurrency(r.annualCost)}
        </div>
        <div className="text-[13px] text-indigo-soft">
          <b className="text-green font-semibold">{formatCurrency(r.threeYearCost)}</b> over 3 years &middot; money already being spent
        </div>
        <div className="flex gap-2.5 mt-4">
          <div className="flex-1 bg-white/[0.06] border border-white/10 rounded-md px-3 py-2.5">
            <div className="mono text-[20px] font-semibold">{r.hoursReclaimed.toLocaleString()}</div>
            <div className="text-[10px] text-indigo-soft uppercase tracking-[0.06em] mt-0.5">IT hours saved / yr</div>
          </div>
          <div className="flex-1 bg-white/[0.06] border border-white/10 rounded-md px-3 py-2.5">
            <div className="mono text-[20px] font-semibold">{formatCompact(r.missedLectures)}</div>
            <div className="text-[10px] text-indigo-soft uppercase tracking-[0.06em] mt-0.5">failed recordings prevented</div>
          </div>
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
              className="w-full grid grid-cols-[150px_1fr_auto] items-center gap-3 px-2 py-1.5 rounded-md hover:bg-surface-2 transition-colors text-left cursor-pointer"
            >
              <span className="text-[12.5px] text-ink-2 truncate flex items-center gap-2">
                <span className="w-[7px] h-[7px] rounded-[2px] inline-block flex-none" style={{ background: TIER_VAR[d.tier] }} />
                {d.name}
              </span>
              <span className="h-[9px] bg-surface-2 rounded-full overflow-hidden">
                <span className="block h-full rounded-full" style={{ width: `${(d.cost / maxCost) * 100}%`, background: TIER_VAR[d.tier] }} />
              </span>
              <span className="text-[13px] font-semibold text-ink-1 text-right min-w-[74px] mono">{formatCurrency(d.cost)}</span>
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
