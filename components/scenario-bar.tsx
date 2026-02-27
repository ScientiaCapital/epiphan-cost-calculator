"use client";

import { SCENARIOS, type ScenarioPreset } from "@/lib/constants";
import type { CalculatorInputs } from "@/lib/calculator";

interface ScenarioBarProps {
  activeRooms: number;
  onSelect: (inputs: Partial<CalculatorInputs>) => void;
}

export function ScenarioBar({ activeRooms, onSelect }: ScenarioBarProps) {
  function handleClick(s: ScenarioPreset) {
    onSelect({
      rooms: s.rooms,
      students: s.students,
      tuition: s.tuition,
      currentFTE: s.currentFTE,
      equipmentAge: s.equipmentAge,
    });
  }

  return (
    <div className="flex gap-2 mb-4">
      {SCENARIOS.map((s) => (
        <button
          key={s.rooms}
          onClick={() => handleClick(s)}
          className={`flex-1 py-2 px-1 text-[11px] font-bold uppercase tracking-wide border-2 rounded-md bg-white cursor-pointer text-center transition-all ${
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
  );
}
