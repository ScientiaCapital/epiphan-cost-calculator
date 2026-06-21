"use client";

import { useState } from "react";
import type { CalculatorInputs } from "@/lib/calculator";
import {
  EQUIPMENT_AGE_OPTIONS,
  SCENARIOS,
  defaultConcurrentRooms,
  type EquipmentAge,
  type ScenarioPreset,
} from "@/lib/constants";
import { getVerticalConfig } from "@/lib/verticals";
import { VerticalBar } from "./vertical-bar";

interface OperatePanelProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
  /** Apply a partial patch (used by the vertical selector + presets). */
  onPatch: (partial: Partial<CalculatorInputs>) => void;
  onOpenDetails: () => void;
}

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
    concurrentRooms: s.concurrentRooms ?? defaultConcurrentRooms(s.rooms),
  };
}

const ctrl =
  "w-full border border-line rounded-md bg-white text-[14px] text-ink-1 px-2.5 py-2 focus:outline-none focus:border-green";

/** Left cockpit zone — everything the rep changes as the prospect talks, in one
 *  tight column: vertical, the 3 core numbers, a preset jump, advanced inputs on
 *  demand, and the Details drawer trigger. */
export function OperatePanel({ inputs, onChange, onPatch, onOpenDetails }: OperatePanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const cfg = getVerticalConfig(inputs.vertical);
  const labels = cfg.labels;

  function update<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) {
    onChange({ ...inputs, [key]: value });
  }

  return (
    <div className="panel-card flex flex-col flex-1 min-h-0 overflow-auto">
      <div className="p-3 border-b border-line">
        <VerticalBar vertical={inputs.vertical ?? "higher-ed"} framing={inputs.framing ?? "aging"} onSelect={onPatch} />
      </div>

      {cfg.mode === "cost" ? (
        <>
          {/* Cost mode — inputs feed the dollar model, so they earn their place. */}
          <div className="p-3 border-b border-line">
            <label className="block text-[11px] font-semibold text-ink-3 mb-1">{labels.unitsLabel}</label>
            <input
              type="number" className={ctrl} value={inputs.rooms} min={1} max={5000}
              onChange={(e) => update("rooms", parseInt(e.target.value) || 150)}
            />
            <div className="text-[10px] text-ink-4 mt-0.5">{labels.unitsHint}</div>

            <label className="block text-[11px] font-semibold text-ink-3 mb-1 mt-3">Average equipment age</label>
            <select
              className={ctrl} value={inputs.equipmentAge}
              onChange={(e) => update("equipmentAge", e.target.value as EquipmentAge)}
            >
              {EQUIPMENT_AGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <label className="block text-[11px] font-semibold text-ink-3 mb-1 mt-3">Current AV staff (FTE)</label>
            <input
              type="number" className={ctrl} value={inputs.currentFTE} min={1} max={50}
              onChange={(e) => update("currentFTE", parseInt(e.target.value) || 4)}
            />
            <div className="text-[10px] text-ink-4 mt-0.5">Benchmark: ~43 rooms / person</div>

            <label className="block text-[11px] font-semibold text-ink-3 mb-1 mt-3">Jump to a preset</label>
            <select
              className={ctrl} value=""
              onChange={(e) => {
                const s = SCENARIOS.find((x) => x.label === e.target.value);
                if (s) onPatch(presetToInputs(s));
              }}
            >
              <option value="" disabled>Choose a scenario&hellip;</option>
              {SCENARIOS.map((s) => (
                <option key={s.label} value={s.label}>{s.label} ({s.rooms} rooms)</option>
              ))}
            </select>
          </div>

          <div className="p-3">
            <button
              type="button" onClick={() => setShowAdvanced((v) => !v)}
              className="text-[12px] font-semibold text-ink hover:text-teal cursor-pointer"
            >
              {showAdvanced ? "Hide advanced ▴" : "Advanced inputs ▾"}
            </button>
            {showAdvanced && (
              <div className="mt-3 space-y-3">
                {([
                  ["lecturesPerWeek", "Recordings / room / week", 1, 50, 15],
                  ["teachWeeks", "Teaching weeks / year", 20, 52, 30],
                  ["tuition", "Avg annual tuition ($)", 1000, 80000, 22000],
                  ["students", "Enrolled students", 500, 100000, 12000],
                  ["itSalary", "IT staff salary (avg)", 40000, 200000, 85000],
                ] as const).map(([key, label, min, max, fallback]) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold text-ink-3 mb-1">{label}</label>
                    <input
                      type="number" className={ctrl} min={min} max={max}
                      value={inputs[key] as number}
                      onChange={(e) => update(key, (parseInt(e.target.value) || fallback) as never)}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[11px] font-semibold text-ink-3 mb-1">Rooms recording at once (peak)</label>
                  <input
                    type="number" className={ctrl} min={1} max={inputs.rooms}
                    value={inputs.concurrentRooms ?? defaultConcurrentRooms(inputs.rooms)}
                    onChange={(e) =>
                      update("concurrentRooms", Math.min(inputs.rooms, parseInt(e.target.value) || defaultConcurrentRooms(inputs.rooms)))
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Fit mode — no dollar model is computed, so the only input is the
              vertical's scale, captured for the note. Inputs that change nothing
              would imply false precision; lead with discovery instead. */}
          <div className="p-3 border-b border-line">
            <label className="block text-[11px] font-semibold text-ink-3 mb-1">{labels.unitsLabel}</label>
            <input
              type="number" className={ctrl} value={inputs.rooms} min={1} max={5000}
              onChange={(e) => update("rooms", parseInt(e.target.value) || 1)}
            />
            <div className="text-[10px] text-slate mt-0.5">Captured for your note, not computed</div>
            <p className="text-[11px] text-ink-4 mt-3 leading-relaxed">
              Discovery mode. The figure shown is illustrative{cfg.illustrative ? `, ${cfg.illustrative.unitWord}` : ""}, not computed from inputs.
            </p>
          </div>

          <div className="p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-4 mb-1.5">Ask on the call</div>
            <ul className="space-y-1.5">
              {cfg.discoveryFocus.map((q) => (
                <li key={q} className="text-[12.5px] text-ink-2 flex gap-2">
                  <span className="w-[6px] h-[6px] rounded-full bg-green mt-[7px] flex-none" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="p-3 mt-auto">
        <button
          type="button" onClick={onOpenDetails}
          className="w-full py-2.5 border border-dashed border-line rounded-md bg-surface-2 text-[12px] font-semibold text-teal hover:border-teal hover:bg-aqua-tint transition-colors cursor-pointer"
        >
          Details &amp; proof &rsaquo;
        </button>
      </div>
    </div>
  );
}
