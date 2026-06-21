import type { Confidence } from "@/lib/verticals";

/** A small chip that makes a figure's defensibility visible. This is the
 *  integrity primitive: every displayed dollar carries its confidence so the
 *  headline never launders a weak driver as solid. */
const STYLE: Record<Confidence, string> = {
  calibrated: "bg-green-tint border-green text-teal-deep",
  estimated: "bg-aqua-tint border-aqua text-slate",
  asserted: "bg-surface-3 border-surface-3 text-ink-3",
};
const DOT: Record<Confidence, string> = {
  calibrated: "bg-green",
  estimated: "bg-slate",
  asserted: "bg-ink-4",
};

export function ConfidenceChip({ level, label }: { level: Confidence; label?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10.5px] leading-none rounded px-1.5 py-1 border whitespace-nowrap ${STYLE[level]}`}
    >
      <span className={`w-[7px] h-[7px] rounded-full flex-none ${DOT[level]}`} />
      {label ?? level}
    </span>
  );
}
