"use client";

import { useState, useMemo } from "react";
import { calculate, type CalculatorInputs } from "@/lib/calculator";
import { DEFAULT_INPUTS } from "@/lib/constants";
import { Header } from "@/components/header";
import { ScenarioBar } from "@/components/scenario-bar";
import { InputPanel } from "@/components/input-panel";
import { CostSummary } from "@/components/cost-summary";
import { MetricsRow } from "@/components/metrics-row";
import { CostBreakdown } from "@/components/cost-breakdown";
import { SolutionRow } from "@/components/solution-row";
import { TalkingPoints } from "@/components/talking-points";
import { Methodology } from "@/components/methodology";

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  const results = useMemo(() => calculate(inputs), [inputs]);

  function handleScenarioSelect(partial: Partial<CalculatorInputs>) {
    setInputs((prev) => ({ ...prev, ...partial }));
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#424242] leading-normal font-sans">
      <Header />

      <div className="max-w-[1200px] mx-auto p-6">
        <ScenarioBar activeRooms={inputs.rooms} onSelect={handleScenarioSelect} />

        <div className="grid grid-cols-[340px_1fr] max-[900px]:grid-cols-1 gap-6 items-start">
          {/* Left: Inputs */}
          <InputPanel inputs={inputs} onChange={setInputs} />

          {/* Right: Results */}
          <div>
            <CostSummary annualCost={results.annualCost} threeYearCost={results.threeYearCost} />
            <MetricsRow
              hoursReclaimed={results.hoursReclaimed}
              missedLectures={results.missedLectures}
              currentRoomsPerPerson={results.currentRoomsPerPerson}
              paybackMonths={results.paybackMonths}
            />
            <CostBreakdown inputs={inputs} results={results} />
            <SolutionRow inputs={inputs} results={results} />
            <TalkingPoints inputs={inputs} results={results} />
            <Methodology />
          </div>
        </div>
      </div>
    </div>
  );
}
