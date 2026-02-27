import { formatCurrency } from "@/lib/calculator";

interface CostSummaryProps {
  annualCost: number;
  threeYearCost: number;
}

export function CostSummary({ annualCost, threeYearCost }: CostSummaryProps) {
  return (
    <>
      <div className="text-center p-5 bg-[#ffebee] rounded-[10px] mb-5 border-2 border-[#d32f2f]">
        <div className="text-[12px] font-bold text-[#d32f2f] uppercase tracking-widest">
          Annual Cost of Inaction
        </div>
        <div className="text-[42px] font-extrabold text-[#d32f2f] leading-tight my-1">
          {formatCurrency(annualCost)}
        </div>
        <div className="text-[13px] text-[#757575]">
          per year — money you&apos;re already spending
        </div>
      </div>

      <div className="text-center p-3.5 bg-[#fce4ec] rounded-lg mb-5">
        <div className="text-[11px] font-bold text-[#c62828] uppercase tracking-wide">
          3-Year Cumulative Exposure
        </div>
        <div className="text-[28px] font-extrabold text-[#c62828]">
          {formatCurrency(threeYearCost)}
        </div>
      </div>
    </>
  );
}
