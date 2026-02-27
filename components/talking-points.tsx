import type { CalculatorInputs, CalculatorResults } from "@/lib/calculator";
import { formatCurrency } from "@/lib/calculator";

interface TalkingPointsProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
}

interface TalkingPoint {
  role: string;
  message: string;
}

function generateTalkingPoints(inputs: CalculatorInputs, r: CalculatorResults): TalkingPoint[] {
  return [
    {
      role: "For the CIO / VP of IT",
      message: `"Your team is fielding an estimated ${r.totalTickets.toLocaleString()} AV support tickets per year — that's ${r.ticketHours.toLocaleString()} hours of reactive firefighting. With automated, cloud-managed systems, institutions like NC State manage 300+ rooms with a team of 3. That could free ${r.excessFTE} of your ${inputs.currentFTE} FTEs (${formatCurrency(r.staffCost)}/yr) to focus on strategic projects instead of room-by-room troubleshooting."`,
    },
    {
      role: "For the Provost / Academic Affairs",
      message: `"With ${inputs.equipmentAge}-year-old capture equipment, roughly ${r.missedLectures.toLocaleString()} lectures go unrecorded or fail each year across ${inputs.rooms} rooms — affecting an estimated ${r.studentsAffected.toLocaleString()} student-views. NTNU runs 700 rooms for 42,000 students with near-zero failure and zero dedicated operators. The April 24, 2026 ADA deadline makes every missed recording a compliance liability."`,
    },
    {
      role: "For the CFO / Budget Office",
      message: `"The 3-year cost of maintaining current infrastructure is approximately ${formatCurrency(r.threeYearCost)}. Modernizing all ${inputs.rooms} rooms with Epiphan at ${formatCurrency(r.totalInvestment)} pays for itself in ${r.paybackMonths} months — a ${r.roi3Year}% three-year ROI. No recurring software fees for basic fleet management, and the hardware investment is a one-time CapEx line item."`,
    },
  ];
}

export function TalkingPoints({ inputs, results }: TalkingPointsProps) {
  const points = generateTalkingPoints(inputs, results);

  return (
    <div className="mt-5">
      <h3 className="text-[14px] font-bold uppercase tracking-wide text-[#1a2332] mb-3">
        &#128172; Discovery Call Talking Points
      </h3>
      {points.map((tp) => (
        <div
          key={tp.role}
          className="bg-white border-l-[3px] border-l-[#7ab800] rounded-r-lg px-4 py-3.5 mb-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <div className="text-[11px] font-bold text-[#5a8a00] uppercase tracking-wide">
            {tp.role}
          </div>
          <div className="text-[13px] mt-1 text-[#424242]">{tp.message}</div>
        </div>
      ))}
    </div>
  );
}
