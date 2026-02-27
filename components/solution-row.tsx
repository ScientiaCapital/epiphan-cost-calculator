import type { CalculatorInputs, CalculatorResults } from "@/lib/calculator";
import { formatCurrency, formatCompact } from "@/lib/calculator";

interface SolutionRowProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
}

export function SolutionRow({ inputs, results: r }: SolutionRowProps) {
  const cards = [
    { value: formatCompact(r.hoursReclaimed), label: "Hours Reclaimed / Year", hero: true },
    { value: formatCompact(r.missedLectures), label: "Lectures Saved / Year", hero: true },
    { value: `${r.currentRoomsPerPerson} → 100+`, label: "Rooms / Staff Member", hero: false },
    { value: formatCurrency(r.totalInvestment), label: "Investment ($5,198/room)", hero: false },
    { value: String(r.paybackMonths), label: "Month Payback Period", hero: false },
    { value: `${r.roi3Year}%`, label: "3-Year ROI", hero: false },
  ];

  return (
    <div className="bg-[#e8f5e9] rounded-[10px] p-5 mt-5">
      <h3 className="text-[16px] font-bold text-[#5a8a00] mb-3">&#9989; The Epiphan Path Forward</h3>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-lg p-3.5 text-center ${
              card.hero ? "border-2 border-[#7ab800]" : ""
            }`}
          >
            <div className={`font-extrabold text-[#5a8a00] ${card.hero ? "text-[28px]" : "text-[22px]"}`}>
              {card.value}
            </div>
            <div className="text-[11px] text-[#757575] uppercase tracking-wide mt-0.5">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 p-2.5 bg-white rounded-lg text-[12px] text-[#757575] leading-normal">
        <strong className="text-[#5a8a00]">Includes free Epiphan Edge cloud fleet management</strong> — monitor and manage all devices from one dashboard. No recurring fees for basic monitoring and status dashboards. Per room: Pearl Nexus ($3,299) + EC20 PTZ Camera ($1,899).
      </div>

      <div className="mt-2 text-[11px] text-[#757575] italic">
        Reference deployments: NC State (300+ rooms, team of 3) &bull; UNLV (215 units, remote fleet mgmt) &bull; MTSU (428 rooms) &bull; NTNU (700 rooms, 42K students, zero dedicated operators)
      </div>
    </div>
  );
}
