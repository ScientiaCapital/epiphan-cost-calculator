// Research-backed constants for the Cost of Inaction Calculator
// Sources cited inline — do not modify without updating methodology section

export type EquipmentAge = "3" | "5" | "7" | "10";

export type AgeMultiplierTable = Record<EquipmentAge, number>;

// ── Ticket / Support Costs ────────────────────────────────────────────
// Epiphan AV Professional Survey 2025 (500+ respondents)
export const TICKET_BASE_RATE = 4.6; // tickets/room/year baseline

// Age-based multiplier on ticket rate
export const TICKET_AGE_MULTIPLIER: AgeMultiplierTable = {
  "3": 0.5,
  "5": 1.0,
  "7": 1.8,
  "10": 3.0,
};

// MetricNet Service Desk Benchmarks — blended Tier 1–3
export const COST_PER_TICKET = 35; // $22 T1 / $65 T2 / $104 T3 blended
export const MINUTES_PER_TICKET = 45; // avg hands-on support time

// ── Capture Failure Rates ─────────────────────────────────────────────
// NC State achieved 99%+ reliability with Pearl fleet
export const FAIL_RATES: AgeMultiplierTable = {
  "3": 0.03,
  "5": 0.06,
  "7": 0.10,
  "10": 0.18,
};

export const COST_PER_MISSED_CAPTURE = 250; // rescheduling + re-recording + complaints
export const STUDENTS_PER_LECTURE = 75; // avg students affected per missed capture

// ── Classroom Downtime ────────────────────────────────────────────────
// eCampus News / Cenero downtime cost methodology
export const DOWNTIME_EVENTS_PER_ROOM: AgeMultiplierTable = {
  "3": 1.0,
  "5": 2.5,
  "7": 4.0,
  "10": 6.0,
};

export const COST_PER_DOWNTIME_EVENT = 2000; // instructor + student time + rescheduling

// ── Configuration & Maintenance ───────────────────────────────────────
// REMI Group equipment lifecycle analysis, Epiphan TCO model
export const CONFIG_HOURS_PER_ROOM: AgeMultiplierTable = {
  "3": 1.0,
  "5": 2.5,
  "7": 3.5,
  "10": 4.0,
};

export const PARTS_COST_PER_ROOM: AgeMultiplierTable = {
  "3": 50,
  "5": 150,
  "7": 350,
  "10": 700,
};

export const IT_HOURLY_RATE = 55; // fully loaded IT cost

// ── ADA / Accessibility Compliance ────────────────────────────────────
// 3Play Media / AudioEye: 97% gap, $27K avg settlement
export const ADA_COST_PER_ROOM: AgeMultiplierTable = {
  "3": 80,
  "5": 200,
  "7": 400,
  "10": 750,
};

export const ADA_MINIMUM_COST = 25000;

// ── Student Retention ─────────────────────────────────────────────────
// Springer Higher Education: lecture capture reduces attrition 12.3% → 5%
export const RETENTION_PCT_BY_AGE: AgeMultiplierTable = {
  "3": 0.002,
  "5": 0.005,
  "7": 0.008,
  "10": 0.01,
};

// ── Staff Efficiency ──────────────────────────────────────────────────
// NC State: 300+ rooms with team of 3 — benchmark for cloud-managed
// Collegis Education / OculusIT benchmarks
export const OPTIMAL_ROOMS_PER_PERSON = 100;

// ── Solution Investment ───────────────────────────────────────────────
// Pearl Nexus ($3,299) + EC20 PTZ Camera ($1,899)
export const PER_ROOM_INVESTMENT = 5198;

// 3-year escalation factor (maintenance costs grow over time)
export const THREE_YEAR_MULTIPLIER = 3.15;

// ── Scenario Presets ──────────────────────────────────────────────────
export interface ScenarioPreset {
  label: string;
  rooms: number;
  students: number;
  tuition: number;
  currentFTE: number;
  equipmentAge: EquipmentAge;
}

export const SCENARIOS: ScenarioPreset[] = [
  { label: "Small",    rooms: 50,  students: 3000,  tuition: 25000, currentFTE: 2,  equipmentAge: "5" },
  { label: "Mid-Size", rooms: 150, students: 12000, tuition: 20000, currentFTE: 4,  equipmentAge: "5" },
  { label: "Large",    rooms: 300, students: 25000, tuition: 18000, currentFTE: 6,  equipmentAge: "5" },
  { label: "Major",    rooms: 600, students: 45000, tuition: 15000, currentFTE: 12, equipmentAge: "7" },
];

// ── Input Defaults ────────────────────────────────────────────────────
export const DEFAULT_INPUTS = {
  rooms: 300,
  equipmentAge: "5" as EquipmentAge,
  lecturesPerWeek: 15,
  teachWeeks: 30,
  students: 25000,
  tuition: 18000,
  itSalary: 90000,
  currentFTE: 6,
};

// ── Equipment Age Options (for select dropdown) ───────────────────────
export const EQUIPMENT_AGE_OPTIONS = [
  { value: "3" as EquipmentAge, label: "3 years (approaching refresh)" },
  { value: "5" as EquipmentAge, label: "5 years (standard cycle end)" },
  { value: "7" as EquipmentAge, label: "7 years (overdue)" },
  { value: "10" as EquipmentAge, label: "10+ years (critical)" },
];
