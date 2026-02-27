"use client";

import type { CalculatorInputs } from "@/lib/calculator";
import type { EquipmentAge } from "@/lib/constants";
import { EQUIPMENT_AGE_OPTIONS } from "@/lib/constants";

interface InputPanelProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="block text-[12px] font-semibold text-[#757575] mb-1 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {hint && <div className="text-[11px] text-[#757575] mt-0.5">{hint}</div>}
    </div>
  );
}

export function InputPanel({ inputs, onChange }: InputPanelProps) {
  function update<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) {
    onChange({ ...inputs, [key]: value });
  }

  const inputClass =
    "w-full px-3 py-2.5 border-[1.5px] border-[#e0e0e0] rounded-md text-[15px] transition-colors focus:outline-none focus:border-[#7ab800]";

  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="px-5 py-4 font-bold text-[14px] uppercase tracking-wide bg-[#1a2332] text-white flex items-center gap-2 border-b border-[#eeeeee]">
          &#9881; Your Campus Profile
        </div>
        <div className="p-5">
          <Field label="AV-Equipped Rooms" hint="Classrooms, lecture halls, labs, studios">
            <input
              type="number"
              className={inputClass}
              value={inputs.rooms}
              min={1}
              max={5000}
              onChange={(e) => update("rooms", parseInt(e.target.value) || 300)}
            />
          </Field>

          <Field label="Average Equipment Age">
            <select
              className={inputClass}
              value={inputs.equipmentAge}
              onChange={(e) => update("equipmentAge", e.target.value as EquipmentAge)}
            >
              {EQUIPMENT_AGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="border-t border-[#eeeeee] my-4" />

          <Field label="Lectures per Room / Week" hint="Avg scheduled recordings/streams">
            <input
              type="number"
              className={inputClass}
              value={inputs.lecturesPerWeek}
              min={1}
              max={50}
              onChange={(e) => update("lecturesPerWeek", parseInt(e.target.value) || 15)}
            />
          </Field>

          <Field label="Teaching Weeks / Year">
            <input
              type="number"
              className={inputClass}
              value={inputs.teachWeeks}
              min={20}
              max={52}
              onChange={(e) => update("teachWeeks", parseInt(e.target.value) || 30)}
            />
          </Field>

          <Field label="Enrolled Students">
            <input
              type="number"
              className={inputClass}
              value={inputs.students}
              min={500}
              max={100000}
              step={500}
              onChange={(e) => update("students", parseInt(e.target.value) || 25000)}
            />
          </Field>

          <Field label="Avg Annual Tuition ($)">
            <input
              type="number"
              className={inputClass}
              value={inputs.tuition}
              min={1000}
              max={80000}
              step={500}
              onChange={(e) => update("tuition", parseInt(e.target.value) || 18000)}
            />
          </Field>

          <div className="border-t border-[#eeeeee] my-4" />

          <Field label="IT Staff Salary (avg)">
            <input
              type="number"
              className={inputClass}
              value={inputs.itSalary}
              min={40000}
              max={200000}
              step={5000}
              onChange={(e) => update("itSalary", parseInt(e.target.value) || 90000)}
            />
          </Field>

          <Field label="Current AV / Media Staff (FTEs)" hint="Industry avg: 47 rooms per person">
            <input
              type="number"
              className={inputClass}
              value={inputs.currentFTE}
              min={1}
              max={50}
              onChange={(e) => update("currentFTE", parseInt(e.target.value) || 6)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
