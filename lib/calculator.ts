import {
  type EquipmentAge,
  TICKET_BASE_RATE,
  TICKET_AGE_MULTIPLIER,
  COST_PER_TICKET,
  MINUTES_PER_TICKET,
  FAIL_RATES,
  COST_PER_MISSED_CAPTURE,
  STUDENTS_PER_LECTURE,
  DOWNTIME_EVENTS_PER_ROOM,
  COST_PER_DOWNTIME_EVENT,
  CONFIG_HOURS_PER_ROOM,
  PARTS_COST_PER_ROOM,
  IT_HOURLY_RATE,
  ADA_COST_PER_ROOM,
  ADA_MINIMUM_COST,
  RETENTION_PCT_BY_AGE,
  OPTIMAL_ROOMS_PER_PERSON,
  PER_ROOM_INVESTMENT,
  THREE_YEAR_MULTIPLIER,
} from "./constants";

// ── Input / Output Types ──────────────────────────────────────────────

export interface CalculatorInputs {
  rooms: number;
  equipmentAge: EquipmentAge;
  lecturesPerWeek: number;
  teachWeeks: number;
  students: number;
  tuition: number;
  itSalary: number;
  currentFTE: number;
}

export interface CategoryCost {
  name: string;
  cost: number;
  barColor: "red" | "amber" | "blue";
}

export interface CalculatorResults {
  // Totals
  annualCost: number;
  threeYearCost: number;

  // Per-category costs
  ticketCost: number;
  missedCaptureCost: number;
  downtimeCost: number;
  staffCost: number;
  maintenanceCost: number;
  adaCost: number;
  retentionCost: number;

  // Category breakdown for rendering
  categories: CategoryCost[];

  // Detail fields for category 1 (IT Staff Time)
  ticketsPerRoomYear: number;
  totalTickets: number;
  ticketHours: number;

  // Detail fields for category 2 (Failed Captures)
  failRate: number;
  totalLectures: number;
  missedLectures: number;
  studentsAffected: number;

  // Detail fields for category 3 (Classroom Downtime)
  downtimeEventsPerRoom: number;
  totalDowntimeEvents: number;

  // Detail fields for category 4 (Manual Operation)
  currentRoomsPerPerson: number;
  optimalFTE: number;
  excessFTE: number;

  // Detail fields for category 5 (Config & Maintenance)
  configHoursPerRoom: number;

  // Detail fields for category 7 (Student Retention)
  retentionPercent: number;

  // Solution / metrics
  hoursReclaimed: number;
  totalInvestment: number;
  paybackMonths: number;
  roi3Year: number;
}

// ── Calculator ────────────────────────────────────────────────────────

export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const { rooms, equipmentAge, lecturesPerWeek, teachWeeks, students, tuition, itSalary, currentFTE } = inputs;

  const totalLectures = rooms * lecturesPerWeek * teachWeeks;

  // 1. IT Staff Time Wasted
  const ticketsPerRoomYear = TICKET_BASE_RATE * TICKET_AGE_MULTIPLIER[equipmentAge];
  const totalTickets = Math.round(rooms * ticketsPerRoomYear);
  const ticketHours = Math.round(totalTickets * MINUTES_PER_TICKET / 60);
  const ticketCost = totalTickets * COST_PER_TICKET;

  // 2. Failed & Missed Captures
  const failRate = FAIL_RATES[equipmentAge];
  const missedLectures = Math.round(totalLectures * failRate);
  const studentsAffected = missedLectures * STUDENTS_PER_LECTURE;
  const missedCaptureCost = missedLectures * COST_PER_MISSED_CAPTURE;

  // 3. Classroom Downtime
  const downtimeEventsPerRoom = DOWNTIME_EVENTS_PER_ROOM[equipmentAge];
  const totalDowntimeEvents = Math.round(rooms * downtimeEventsPerRoom);
  const downtimeCost = totalDowntimeEvents * COST_PER_DOWNTIME_EVENT;

  // 4. Manual Operation Burden (FTE redeployment)
  const currentRoomsPerPerson = Math.round(rooms / currentFTE);
  const optimalFTE = Math.max(1, Math.ceil(rooms / OPTIMAL_ROOMS_PER_PERSON));
  const excessFTE = Math.max(0, currentFTE - optimalFTE);
  const staffCost = excessFTE * itSalary;

  // 5. Configuration & Maintenance Labor
  const configHoursPerRoom = CONFIG_HOURS_PER_ROOM[equipmentAge];
  const configLabor = rooms * configHoursPerRoom * IT_HOURLY_RATE;
  const partsCost = rooms * PARTS_COST_PER_ROOM[equipmentAge];
  const maintenanceCost = configLabor + partsCost;

  // 6. ADA Compliance Exposure
  const adaCost = Math.max(ADA_MINIMUM_COST, rooms * ADA_COST_PER_ROOM[equipmentAge]);

  // 7. Student Retention Impact
  const retentionPercent = RETENTION_PCT_BY_AGE[equipmentAge];
  const retentionCost = students * retentionPercent * tuition;

  // Totals
  const annualCost = ticketCost + missedCaptureCost + downtimeCost + staffCost + maintenanceCost + adaCost + retentionCost;
  const threeYearCost = annualCost * THREE_YEAR_MULTIPLIER;

  // Hours reclaimed = ticket handling hours + config labor hours
  const hoursReclaimed = ticketHours + Math.round(rooms * configHoursPerRoom);

  // Investment & ROI
  const totalInvestment = rooms * PER_ROOM_INVESTMENT;
  const paybackMonths = Math.min(36, Math.max(1, Math.round((totalInvestment / annualCost) * 12)));
  const roi3Year = Math.round(((threeYearCost - totalInvestment) / totalInvestment) * 100);

  // Category breakdown for rendering
  const categories: CategoryCost[] = [
    { name: "IT Staff Time Wasted", cost: ticketCost, barColor: "red" },
    { name: "Failed & Missed Captures", cost: missedCaptureCost, barColor: "red" },
    { name: "Classroom Downtime", cost: downtimeCost, barColor: "amber" },
    { name: "Manual Operation Burden", cost: staffCost, barColor: "amber" },
    { name: "Configuration & Maintenance Labor", cost: maintenanceCost, barColor: "blue" },
    { name: "ADA / Accessibility Compliance Exposure", cost: adaCost, barColor: "red" },
    { name: "Student Retention Impact", cost: retentionCost, barColor: "blue" },
  ];

  return {
    annualCost,
    threeYearCost,
    ticketCost,
    missedCaptureCost,
    downtimeCost,
    staffCost,
    maintenanceCost,
    adaCost,
    retentionCost,
    categories,
    ticketsPerRoomYear,
    totalTickets,
    ticketHours,
    failRate,
    totalLectures,
    missedLectures,
    studentsAffected,
    downtimeEventsPerRoom,
    totalDowntimeEvents,
    currentRoomsPerPerson,
    optimalFTE,
    excessFTE,
    configHoursPerRoom,
    retentionPercent,
    hoursReclaimed,
    totalInvestment,
    paybackMonths,
    roi3Year,
  };
}

// ── Formatting Utilities ──────────────────────────────────────────────

export function formatCurrency(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function formatCompact(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return k % 1 === 0 ? k.toFixed(0) + "K" : k.toFixed(1).replace(/\.0$/, "") + "K";
  }
  return Math.round(n).toLocaleString("en-US");
}
