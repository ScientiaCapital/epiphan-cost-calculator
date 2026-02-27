import { formatCompact } from "@/lib/calculator";

interface MetricsRowProps {
  hoursReclaimed: number;
  missedLectures: number;
  currentRoomsPerPerson: number;
  paybackMonths: number;
}

export function MetricsRow({
  hoursReclaimed,
  missedLectures,
  currentRoomsPerPerson,
  paybackMonths,
}: MetricsRowProps) {
  const metrics = [
    { value: formatCompact(hoursReclaimed), label: "Hours Reclaimed / Year" },
    { value: formatCompact(missedLectures), label: "Lectures Saved / Year" },
    { value: `${currentRoomsPerPerson} → 100+`, label: "Rooms / Staff Member" },
    { value: `${paybackMonths} mo`, label: "Payback Period" },
  ];

  return (
    <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-3 mb-5">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-[#e0f2f1] border-2 border-[#00897b] rounded-[10px] p-3.5 text-center"
        >
          <div className="text-[22px] font-extrabold text-[#00897b] leading-tight">
            {m.value}
          </div>
          <div className="text-[10px] font-semibold text-[#757575] uppercase tracking-wide mt-1">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
