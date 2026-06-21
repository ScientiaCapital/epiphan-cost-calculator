interface GuidanceRailProps {
  /** Highest step the rep has reached; steps up to and including it light up. */
  reached: 1 | 2 | 3 | 4;
}

const STEPS = ["Vertical", "Numbers", "Talk track", "Send"] as const;

/** Thin call-flow guide in the header. Orients a new rep without forcing order —
 *  steps are an affordance, not a wizard. */
export function GuidanceRail({ reached }: GuidanceRailProps) {
  return (
    <nav aria-label="Call flow" className="flex items-center gap-1">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const on = n <= reached;
        return (
          <div key={label} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] text-[12px] transition-colors ${
                on ? "bg-green/15 text-white" : "text-indigo-soft"
              }`}
            >
              <span
                className={`grid place-items-center w-[18px] h-[18px] rounded-full text-[10px] font-semibold ${
                  on ? "bg-green text-ink" : "bg-white/10 text-white"
                }`}
              >
                {n}
              </span>
              <span className="hidden md:inline">{label}</span>
            </div>
            {i < STEPS.length - 1 && <span className="text-white/25 text-[12px]">&rarr;</span>}
          </div>
        );
      })}
    </nav>
  );
}
