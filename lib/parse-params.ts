import type { CalculatorInputs } from "./calculator";
import { DEFAULT_INPUTS, type EquipmentAge } from "./constants";

const VALID_AGES: EquipmentAge[] = ["3", "5", "7", "10"];

/** Parse URL search params into calculator inputs, falling back to defaults */
export function parseInputsFromParams(searchParams: string): CalculatorInputs {
  const params = new URLSearchParams(searchParams);
  const inputs = { ...DEFAULT_INPUTS };

  const rooms = parseInt(params.get("rooms") || "");
  if (rooms >= 1 && rooms <= 5000) inputs.rooms = rooms;

  const age = params.get("age") as EquipmentAge | null;
  if (age && VALID_AGES.includes(age)) inputs.equipmentAge = age;

  const lpw = parseInt(params.get("lpw") || "");
  if (lpw >= 1 && lpw <= 50) inputs.lecturesPerWeek = lpw;

  const weeks = parseInt(params.get("weeks") || "");
  if (weeks >= 20 && weeks <= 52) inputs.teachWeeks = weeks;

  const students = parseInt(params.get("students") || "");
  if (students >= 500 && students <= 100000) inputs.students = students;

  const tuition = parseInt(params.get("tuition") || "");
  if (tuition >= 1000 && tuition <= 80000) inputs.tuition = tuition;

  const salary = parseInt(params.get("salary") || "");
  if (salary >= 40000 && salary <= 200000) inputs.itSalary = salary;

  const fte = parseInt(params.get("fte") || "");
  if (fte >= 1 && fte <= 50) inputs.currentFTE = fte;

  return inputs;
}
