"use client";

import { SCENARIOS, type ScenarioPreset } from "@/lib/constants";
import { PIPELINE_SCENARIOS, type PipelineScenario } from "@/lib/pipeline-scenarios";
import type { CalculatorInputs } from "@/lib/calculator";

interface ScenarioBarProps {
  activeRooms: number;
  onSelect: (inputs: Partial<CalculatorInputs>) => void;
}

/** Map a preset to the eight calculator input fields. */
function presetToInputs(s: ScenarioPreset): Partial<CalculatorInputs> {
  return {
    rooms: s.rooms,
    students: s.students,
    tuition: s.tuition,
    currentFTE: s.currentFTE,
    equipmentAge: s.equipmentAge,
    lecturesPerWeek: s.lecturesPerWeek,
    teachWeeks: s.teachWeeks,
    itSalary: s.itSalary,
  };
}

export function ScenarioBar({ activeRooms, onSelect }: ScenarioBarProps) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.rooms}
            onClick={() => onSelect(presetToInputs(s))}
            className={`flex-1 min-w-[100px] py-2 px-1 text-[11px] font-bold uppercase tracking-wide border-2 rounded-md bg-white cursor-pointer text-center transition-all ${
              activeRooms === s.rooms
                ? "border-[#7ab800] bg-[#f1f8e9] text-[#5a8a00]"
                : "border-[#e0e0e0] hover:border-[#7ab800]"
            }`}
          >
            {s.label}
            <span className="text-[13px] block mt-0.5">{s.rooms} rooms</span>
          </button>
        ))}
      </div>

      <details className="mt-3">
        <summary className="text-[11px] font-bold uppercase tracking-wide text-[#5a6b7b] cursor-pointer select-none">
          Real deals from 2026 sales calls ({PIPELINE_SCENARIOS.length})
        </summary>
        <div className="flex flex-wrap gap-2 mt-2">
          {PIPELINE_SCENARIOS.map((s: PipelineScenario) => (
            <button
              key={s.account}
              onClick={() => onSelect(presetToInputs(s))}
              title={`${s.product} | ${s.pain}`}
              className="py-1.5 px-2 text-[11px] font-semibold border border-[#e0e0e0] rounded-md bg-white cursor-pointer text-left transition-all hover:border-[#7ab800]"
            >
              {s.label}
              <span className="text-[12px] block text-[#5a6b7b]">{s.rooms} rooms</span>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
