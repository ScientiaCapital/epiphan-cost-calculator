import { formatCompact } from "@/lib/calculator";

interface MetricsRowProps {
  hoursReclaimed: number;
  missedLectures: number;
}

export function MetricsRow({
  hoursReclaimed,
  missedLectures,
}: MetricsRowProps) {
  const metrics = [
    { value: formatCompact(hoursReclaimed), label: "IT Hours Saved / Year" },
    { value: formatCompact(missedLectures), label: "Failed Recordings Prevented" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-[#eef7f5] border-2 border-[#0C3D34] rounded-[10px] p-3.5 text-center"
        >
          <div className="text-[22px] font-extrabold text-[#0C3D34] leading-tight">
            {m.value}
          </div>
          <div className="text-[10px] font-semibold text-[#5a5a5a] uppercase tracking-wide mt-1">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
