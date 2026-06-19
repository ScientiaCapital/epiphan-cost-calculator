import { formatCurrency } from "@/lib/calculator";

interface CostSummaryProps {
  annualCost: number;
  threeYearCost: number;
}

export function CostSummary({ annualCost, threeYearCost }: CostSummaryProps) {
  return (
    <>
      <div className="text-center p-5 bg-[#170F30] rounded-[10px] mb-5">
        <div className="text-[12px] font-bold text-[#83CE41] uppercase tracking-widest">
          Annual Cost of Inaction
        </div>
        <div className="text-[42px] font-extrabold text-white leading-tight my-1">
          {formatCurrency(annualCost)}
        </div>
        <div className="text-[13px] text-[#b8b4d9]">
          per year, money your campus is already spending
        </div>
      </div>

      <div className="text-center p-3.5 bg-[#F4716E] rounded-lg mb-5">
        <div className="text-[11px] font-bold text-white uppercase tracking-wide">
          3-Year Cumulative Exposure
        </div>
        <div className="text-[28px] font-extrabold text-white">
          {formatCurrency(threeYearCost)}
        </div>
      </div>
    </>
  );
}
